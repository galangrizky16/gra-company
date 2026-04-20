/**
 * Client-side video compression using Canvas + MediaRecorder.
 * Re-encodes video at lower resolution & bitrate for lighter background videos.
 */

const MAX_WIDTH = 1280;
const MAX_HEIGHT = 720;
const BITRATE = 1_500_000; // 1.5 Mbps

export type CompressProgress = {
  phase: "loading" | "compressing" | "done";
  percent: number;
};

export async function compressVideo(
  file: File,
  onProgress?: (p: CompressProgress) => void,
  maxWidth = MAX_WIDTH,
  maxHeight = MAX_HEIGHT,
  bitrate = BITRATE
): Promise<File> {
  onProgress?.({ phase: "loading", percent: 0 });

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Calculate output dimensions
      let w = video.videoWidth;
      let h = video.videoHeight;

      if (w > maxWidth || h > maxHeight) {
        const ratio = Math.min(maxWidth / w, maxHeight / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      // Ensure even dimensions (required by some codecs)
      w = w % 2 === 0 ? w : w - 1;
      h = h % 2 === 0 ? h : h - 1;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Pick best available codec
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm;codecs=vp8";

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrate,
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(url);
        const blob = new Blob(chunks, { type: "video/webm" });
        const compressed = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".webm"),
          { type: "video/webm", lastModified: Date.now() }
        );
        onProgress?.({ phase: "done", percent: 100 });
        resolve(compressed);
      };

      recorder.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("MediaRecorder error"));
      };

      const duration = video.duration || 10;

      recorder.start(100);
      video.play();

      const drawFrame = () => {
        if (video.ended || video.paused) {
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, w, h);
        const pct = Math.min(99, Math.round((video.currentTime / duration) * 100));
        onProgress?.({ phase: "compressing", percent: pct });
        requestAnimationFrame(drawFrame);
      };

      video.onplay = drawFrame;

      video.onended = () => {
        setTimeout(() => recorder.stop(), 200);
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video"));
    };
  });
}
