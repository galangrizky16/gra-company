"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages,
  Upload,
  Plus,
  Trash2,
  Film,
} from "lucide-react";
import { compressVideo, type CompressProgress } from "@/lib/compress-video";

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = "id" | "en";
type Stat = { value: string; label: string };

type SectionData = {
  badge: string;
  heading: string;
  ctaText: string;
  stats: Stat[];
  videoUrl: string | null;
};

const EMPTY: SectionData = {
  badge: "",
  heading: "",
  ctaText: "",
  stats: [{ value: "", label: "" }],
  videoUrl: null,
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminWhyUsPage() {
  const [locale, setLocale] = useState<Locale>("id");
  const [form, setForm] = useState<SectionData>(EMPTY);
  const [saved, setSaved] = useState<Record<string, SectionData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressInfo, setCompressInfo] = useState<CompressProgress | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const videoRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/why-us");
      const data = await res.json();
      setSaved(data);
      if (data[locale]) {
        const rawStats = data[locale].stats as Stat[] | undefined;
        setForm({
          badge: data[locale].badge ?? "",
          heading: data[locale].heading ?? "",
          ctaText: data[locale].ctaText ?? "",
          stats: rawStats?.length ? rawStats : [{ value: "", label: "" }],
          videoUrl: data[locale].videoUrl ?? null,
        });
      } else {
        setForm(EMPTY);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Locale switch ──

  const switchLocale = (l: Locale) => {
    setLocale(l);
    if (saved[l]) {
      const rawStats = saved[l].stats as Stat[] | undefined;
      setForm({
        badge: saved[l].badge ?? "",
        heading: saved[l].heading ?? "",
        ctaText: saved[l].ctaText ?? "",
        stats: rawStats?.length ? rawStats : [{ value: "", label: "" }],
        videoUrl: saved[l].videoUrl ?? null,
      });
    } else {
      setForm(EMPTY);
    }
    setStatus("idle");
  };

  // ── Save text ──

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/why-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...form }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("success");
      setStatusMsg("Saved! Auto-translating to the other language...");
      setTimeout(() => fetchData(), 3000);
    } catch {
      setStatus("error");
      setStatusMsg("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Video upload + compress ──

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setCompressInfo({ phase: "loading", percent: 0 });
    setStatus("idle");

    try {
      // Compress video client-side
      const compressed = await compressVideo(file, (p) => setCompressInfo(p));

      // Upload compressed video
      const fd = new FormData();
      fd.append("video", compressed);

      const res = await fetch("/api/admin/why-us/video", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { videoUrl } = await res.json();
      setForm((f) => ({ ...f, videoUrl }));
      setStatus("success");
      setStatusMsg(
        `Video uploaded! ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`
      );
      await fetchData();
    } catch {
      setStatus("error");
      setStatusMsg("Failed to upload video");
    } finally {
      setUploading(false);
      setCompressInfo(null);
      if (videoRef.current) videoRef.current.value = "";
    }
  };

  // ── Stat helpers ──

  const updateStat = (i: number, key: keyof Stat, value: string) => {
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, j) => (j === i ? { ...s, [key]: value } : s)),
    }));
  };

  const addStat = () => {
    setForm((f) => ({ ...f, stats: [...f.stats, { value: "", label: "" }] }));
  };

  const removeStat = (i: number) => {
    setForm((f) => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }));
  };

  const hasContent = form.badge && form.heading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#6D28D9]" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Why Us Section</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage the &quot;Why Clients Love Working With Us&quot; section.
          </p>
        </div>
        <div className="flex rounded-lg border border-[#F1F5F9] bg-white p-1">
          {(["id", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition-all ${
                locale === l
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Languages className="h-3.5 w-3.5" />
              {l === "id" ? "Indonesia" : "English"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Status */}
      <AnimatePresence>
        {status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
              status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video Upload ── */}
      <motion.div variants={fadeUp} className="mb-6 rounded-xl border border-[#F1F5F9] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">Background Video</h2>

        {form.videoUrl && (
          <div className="mb-4 overflow-hidden rounded-lg border border-[#E5E7EB]">
            <video
              src={form.videoUrl}
              muted
              autoPlay
              loop
              playsInline
              className="h-40 w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]">
            <Upload className="h-4 w-4" />
            {uploading ? "Processing..." : "Upload Video"}
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {compressInfo && compressInfo.phase === "compressing" && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#6D28D9]" />
              <span className="text-xs text-[#64748B]">
                Compressing... {compressInfo.percent}%
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 text-[11px] text-[#94A3B8]">
          Video is auto-compressed to WebM (720p, 1.5Mbps) before upload. Shared across both languages.
        </p>
      </motion.div>

      {/* ── Text Fields ── */}
      <motion.div variants={fadeUp} className="mb-6 rounded-xl border border-[#F1F5F9] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">Section Text</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Badge</label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder="e.g. Trust & Credibility"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">CTA Button Text</label>
            <input
              type="text"
              value={form.ctaText}
              onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
              placeholder="e.g. About Us"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Heading</label>
          <input
            type="text"
            value={form.heading}
            onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
            placeholder="e.g. Why Clients Love Working with Us"
            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
          />
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={fadeUp} className="mb-6 rounded-xl border border-[#F1F5F9] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0F172A]">Statistics ({form.stats.length})</h2>
          <button
            onClick={addStat}
            className="inline-flex items-center gap-1 rounded-lg bg-[#6D28D9] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5B21B6]"
          >
            <Plus className="h-3 w-3" /> Add Stat
          </button>
        </div>

        <div className="space-y-3">
          {form.stats.map((stat, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#64748B]">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="100+"
                    className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#64748B]">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="Satisfied Clients"
                    className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9]"
                  />
                </div>
              </div>
              {form.stats.length > 1 && (
                <button
                  onClick={() => removeStat(i)}
                  className="mt-6 flex h-8 w-8 items-center justify-center rounded-md text-[#94A3B8] hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Save Button ── */}
      <motion.div variants={fadeUp}>
        <button
          onClick={handleSave}
          disabled={saving || !hasContent}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save & Translate"}
        </button>
      </motion.div>

      {/* Info */}
      <motion.div variants={fadeUp} className="mt-6 rounded-xl border border-[#F1F5F9] bg-white p-5">
        <div className="flex items-start gap-3">
          <Film className="mt-0.5 h-4 w-4 text-[#6D28D9]" />
          <div>
            <h3 className="text-xs font-semibold text-[#0F172A]">How it works</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
              Save text for one language and it auto-translates to the other via MyMemory API.
              Stat values (numbers like &quot;100+&quot;) are kept as-is, only labels are translated.
              The background video is shared across both languages and auto-compressed to WebM format.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
