"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages,
  Eye,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = "id" | "en";

type HeroFields = {
  badge: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const EMPTY: HeroFields = {
  badge: "",
  headline: "",
  subheadline: "",
  ctaPrimary: "",
  ctaSecondary: "",
};

const FIELD_META: {
  key: keyof HeroFields;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    key: "badge",
    label: "Badge",
    placeholder: "e.g. DIGITAL SOLUTION AGENCY",
  },
  {
    key: "headline",
    label: "Headline",
    placeholder: "e.g. Bangun Website & Otomasi Bisnis Anda",
  },
  {
    key: "subheadline",
    label: "Subheadline",
    placeholder: "e.g. Kami membantu bisnis dan pelajar tumbuh lebih cepat...",
    multiline: true,
  },
  {
    key: "ctaPrimary",
    label: "Primary Button Text",
    placeholder: "e.g. Chat WhatsApp",
  },
  {
    key: "ctaSecondary",
    label: "Secondary Button Text",
    placeholder: "e.g. Lihat Portofolio",
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

export default function AdminHeroPage() {
  const [locale, setLocale] = useState<Locale>("id");
  const [form, setForm] = useState<HeroFields>(EMPTY);
  const [saved, setSaved] = useState<Record<string, HeroFields>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  // ── Fetch both locales on mount ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      setSaved(data);
      if (data[locale]) {
        setForm({
          badge: data[locale].badge ?? "",
          headline: data[locale].headline ?? "",
          subheadline: data[locale].subheadline ?? "",
          ctaPrimary: data[locale].ctaPrimary ?? "",
          ctaSecondary: data[locale].ctaSecondary ?? "",
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

  // ── Switch locale tab ──
  const switchLocale = (l: Locale) => {
    setLocale(l);
    if (saved[l]) {
      setForm({
        badge: saved[l].badge ?? "",
        headline: saved[l].headline ?? "",
        subheadline: saved[l].subheadline ?? "",
        ctaPrimary: saved[l].ctaPrimary ?? "",
        ctaSecondary: saved[l].ctaSecondary ?? "",
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
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...form }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }
      setStatus("success");
      setStatusMsg(
        `Saved! The other language will be auto-translated shortly.`
      );
      // Refresh data after a short delay to pick up translations
      setTimeout(() => fetchData(), 3000);
    } catch (err) {
      setStatus("error");
      setStatusMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const onChange = (key: keyof HeroFields, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  };

  const hasContent = form.badge || form.headline;

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Hero Section</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage the hero section content. Saving will auto-translate to the other language.
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
        <motion.div variants={fadeUp} className="rounded-xl border border-[#F1F5F9] bg-white p-6">
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
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#64748B] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]"
              >
                <Eye className="h-4 w-4" />
                Preview Site
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Info card */}
      <motion.div variants={fadeUp} className="mt-6 rounded-xl border border-[#F1F5F9] bg-white p-5">
        <h3 className="text-xs font-semibold text-[#0F172A]">
          How auto-translate works
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
          When you save content for one language, the system automatically
          translates it to the other language using MyMemory API (free). The
          translation is cached in the database so it only runs once. You can
          manually edit the translated version by switching the language tab.
        </p>
      </motion.div>
    </motion.div>
  );
}
