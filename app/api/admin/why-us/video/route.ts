import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "why-us");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Video file is required" },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = file.name.split(".").pop() ?? "webm";
    const filename = `bg-${Date.now()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const videoUrl = `/uploads/why-us/${filename}`;

    // Delete old files (keep only the latest)
    const rows = await prisma.whyUsSectionContent.findMany();
    for (const row of rows) {
      if (row.videoUrl && row.videoUrl !== videoUrl && row.videoUrl.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), "public", row.videoUrl);
        await unlink(oldPath).catch(() => {});
      }
    }

    // Upsert videoUrl on ALL locale records
    for (const loc of ["id", "en"]) {
      await prisma.whyUsSectionContent.upsert({
        where: { locale: loc },
        create: {
          locale: loc,
          badge: "",
          heading: "",
          ctaText: "",
          stats: [],
          videoUrl,
        },
        update: { videoUrl },
      });
    }

    return NextResponse.json({ success: true, videoUrl });
  } catch (e) {
    console.error("POST /api/admin/why-us/video error:", e);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
