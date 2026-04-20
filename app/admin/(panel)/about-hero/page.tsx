"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages,
  Eye,
  Upload,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = "id" | "en";

type AboutHeroFields = {
  badge: string;
  headline: string;
  headlineAccent: string;
  description: string;
  cta: string;
  ctaSecondary: string;
  imageUrl: string | null;
};

const EMPTY: AboutHeroFields = {
  badge: "",
  headline: "",
  headlineAccent: "",
  description: "",
  cta: "",
  ctaSecondary: "",
  imageUrl: null,
};

const FIELD_META: {
  key: keyof Omit<AboutHeroFields, "imageUrl">;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    key: "badge",
    label: "Badge",
    placeholder: "e.g. Tentang Kami",
  },
  {
    key: "headline",
    label: "Headline",
    placeholder: "e.g. Partner Digital Terpercaya untuk",
  },
  {
    key: "headlineAccent",
    label: "Headline Accent",
    placeholder: "e.g. Pertumbuhan Bisnis Anda",
  },
  {
    key: "description",
    label: "Description",
    placeholder: "e.g. GRA TECH SOLUTION adalah agensi solusi digital...",
    multiline: true,
  },
  {
    key: "cta",
    label: "Primary Button Text",
    placeholder: "e.g. Hubungi Kami",
  },
  {
    key: "ctaSecondary",
    label: "Secondary Button Text",
    placeholder: "e.g. Lihat Layanan",
  },
];

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminAboutHeroPage() {
  const [locale, setLocale] = useState<Locale>("id");
  const [form, setForm] = useState<AboutHeroFields>(EMPTY);
  const [saved, setSaved] = useState<Record<string, AboutHeroFields>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about-hero");
      const data = await res.json();
      setSaved(data);
      if (data[locale]) {
        setForm({
          badge: data[locale].badge ?? "",
          headline: data[locale].headline ?? "",
          headlineAccent: data[locale].headlineAccent ?? "",
          description: data[locale].description ?? "",
          cta: data[locale].cta ?? "",
          ctaSecondary: data[locale].ctaSecondary ?? "",
          imageUrl: data[locale].imageUrl ?? null,
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
      setForm({
        badge: saved[l].badge ?? "",
        headline: saved[l].headline ?? "",
        headlineAccent: saved[l].headlineAccent ?? "",
        description: saved[l].description ?? "",
        cta: saved[l].cta ?? "",
        ctaSecondary: saved[l].ctaSecondary ?? "",
        imageUrl: saved[l].imageUrl ?? null,
      });
    } else {
      setForm(EMPTY);
    }
    setStatus("idle");
  };

  // ── Save ──

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/about-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...form }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }
      setStatus("success");
      setStatusMsg("Saved! Auto-translating to the other language...");
      setTimeout(() => fetchData(), 3000);
    } catch (err) {
      setStatus("error");
      setStatusMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Image upload ──

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: url }));
      setStatus("success");
      setStatusMsg("Image uploaded successfully!");
    } catch {
      setStatus("error");
      setStatusMsg("Failed to upload image. You can also enter the URL manually.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onChange = (key: keyof Omit<AboutHeroFields, "imageUrl">, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  };

  const hasContent = form.badge || form.headline;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Hero Tentang</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage the About page hero section. Stats are managed in Why Us section.
          </p>
        </div>

        {/* Locale tabs */}
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

      {/* Form */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#6D28D9]" />
        </div>
      ) : (
        <>
          {/* Text fields */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-[#F1F5F9] bg-white p-6"
          >
            <div className="space-y-5">
              {FIELD_META.map(({ key, label, placeholder, multiline }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      rows={3}
                      value={form[key]}
                      onChange={(e) => onChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => onChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image section */}
          <motion.div
            variants={fadeUp}
            className="mt-6 rounded-xl border border-[#F1F5F9] bg-white p-6"
          >
            <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">Hero Image</h2>

            {/* Image URL input */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-[#64748B]">
                Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.imageUrl ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      imageUrl: e.target.value || null,
                    }))
                  }
                  placeholder="/assets/background/image.png"
                  className="flex-1 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
                />
                {form.imageUrl && (
                  <button
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: null }))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#94A3B8] hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Upload button */}
            <div className="mb-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9] disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            {/* Preview */}
            {form.imageUrl && (
              <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-lg border border-[#F1F5F9] bg-[#F8FAFC]">
                <Image
                  src={form.imageUrl}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            )}
          </motion.div>

          {/* Status message */}
          {status !== "idle" && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {statusMsg}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSave}
              disabled={saving || !hasContent}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save & Translate"}
            </button>

            {hasContent && (
              <a
                href="/id/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]"
              >
                <Eye className="h-4 w-4" />
                Preview Site
              </a>
            )}
          </div>
        </>
      )}

      {/* Info card */}
      <motion.div
        variants={fadeUp}
        className="mt-6 rounded-xl border border-[#F1F5F9] bg-white p-5"
      >
        <h3 className="text-xs font-semibold text-[#0F172A]">Info</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
          Statistics on the About page are managed from the{" "}
          <a href="/admin/why-us" className="text-[#6D28D9] hover:underline">
            Why Us
          </a>{" "}
          section. Saving content here will auto-translate it to the other
          language. You can also enter the image URL manually if you have already
          uploaded it to your public folder.
        </p>
      </motion.div>
    </motion.div>
  );
}
