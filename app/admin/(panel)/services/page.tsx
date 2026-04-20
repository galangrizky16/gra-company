"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  GripVertical,
  Globe,
  MessageCircle,
  Send,
  Package,
  Smartphone,
  ShoppingCart,
  Zap,
  Code,
  Database,
  Shield,
  Briefcase,
  Layers,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = "id" | "en";

type SectionData = {
  badge: string;
  heading: string;
  subheading: string;
};

type ServiceItem = {
  id: string;
  slug: string;
  icon: string;
  colorTheme: string;
  label: string;
  description: string;
  order: number;
  visible: boolean;
};

// ─── Icon + color maps ──────────────────────────────────────────────────────

const ICON_OPTIONS = [
  { name: "Globe", Icon: Globe },
  { name: "MessageCircle", Icon: MessageCircle },
  { name: "Send", Icon: Send },
  { name: "Package", Icon: Package },
  { name: "Smartphone", Icon: Smartphone },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "Zap", Icon: Zap },
  { name: "Code", Icon: Code },
  { name: "Database", Icon: Database },
  { name: "Shield", Icon: Shield },
  { name: "Briefcase", Icon: Briefcase },
  { name: "Layers", Icon: Layers },
] as const;

const COLOR_OPTIONS = [
  "violet",
  "emerald",
  "blue",
  "amber",
  "rose",
  "cyan",
  "orange",
  "indigo",
] as const;

const COLOR_PREVIEW: Record<string, string> = {
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
};

function getIcon(name: string) {
  return ICON_OPTIONS.find((o) => o.name === name)?.Icon ?? Globe;
}

const EMPTY_SECTION: SectionData = { badge: "", heading: "", subheading: "" };

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminServicesPage() {
  const [locale, setLocale] = useState<Locale>("id");
  const [section, setSection] = useState<SectionData>(EMPTY_SECTION);
  const [savedSection, setSavedSection] = useState<Record<string, SectionData>>(
    {}
  );
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [savedServices, setSavedServices] = useState<
    Record<string, ServiceItem[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  // ── Add/edit form state ──
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: "",
    icon: "Globe",
    colorTheme: "violet",
    label: "",
    description: "",
  });

  // ── Fetch ──

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [secRes, svcRes] = await Promise.all([
        fetch("/api/admin/services/section"),
        fetch("/api/admin/services"),
      ]);
      const secData = await secRes.json();
      const svcData = await svcRes.json();

      setSavedSection(secData);
      setSavedServices(svcData);

      if (secData[locale]) {
        setSection({
          badge: secData[locale].badge ?? "",
          heading: secData[locale].heading ?? "",
          subheading: secData[locale].subheading ?? "",
        });
      } else {
        setSection(EMPTY_SECTION);
      }

      setServices(svcData[locale] ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Locale switch ──

  const switchLocale = (l: Locale) => {
    setLocale(l);
    if (savedSection[l]) {
      setSection({
        badge: savedSection[l].badge ?? "",
        heading: savedSection[l].heading ?? "",
        subheading: savedSection[l].subheading ?? "",
      });
    } else {
      setSection(EMPTY_SECTION);
    }
    setServices(savedServices[l] ?? []);
    setStatus("idle");
    setShowForm(false);
    setEditingId(null);
  };

  // ── Save section text ──

  const handleSaveSection = async () => {
    setSavingSection(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/services/section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...section }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setStatusMsg("Section text saved! Auto-translating...");
      setTimeout(() => fetchAll(), 3000);
    } catch {
      setStatus("error");
      setStatusMsg("Failed to save section text");
    } finally {
      setSavingSection(false);
    }
  };

  // ── Add / Edit service ──

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      slug: "",
      icon: "Globe",
      colorTheme: "violet",
      label: "",
      description: "",
    });
    setShowForm(true);
  };

  const openEditForm = (svc: ServiceItem) => {
    setEditingId(svc.id);
    setForm({
      slug: svc.slug,
      icon: svc.icon,
      colorTheme: svc.colorTheme,
      label: svc.label,
      description: svc.description,
    });
    setShowForm(true);
  };

  const handleSubmitService = async () => {
    setSavingService(true);
    setStatus("idle");
    try {
      if (editingId) {
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
        if (!res.ok) throw new Error();
        setStatus("success");
        setStatusMsg("Service updated! Auto-translating...");
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, ...form }),
        });
        if (!res.ok) throw new Error();
        setStatus("success");
        setStatusMsg("Service created! Auto-translating...");
      }
      setShowForm(false);
      setEditingId(null);
      setTimeout(() => fetchAll(), 2000);
    } catch {
      setStatus("error");
      setStatusMsg("Failed to save service");
    } finally {
      setSavingService(false);
    }
  };

  // ── Toggle visibility ──

  const toggleVisibility = async (svc: ServiceItem) => {
    try {
      await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: svc.id, visible: !svc.visible }),
      });
      await fetchAll();
    } catch {
      // ignore
    }
  };

  // ── Delete service ──

  const handleDelete = async (svc: ServiceItem) => {
    if (!confirm(`Delete "${svc.label}" and its translation?`)) return;
    try {
      await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: svc.id }),
      });
      setStatus("success");
      setStatusMsg("Service deleted");
      await fetchAll();
    } catch {
      setStatus("error");
      setStatusMsg("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#6D28D9]" />
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-[#0F172A]">Services</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage the services section on the homepage.
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section Text ── */}
      <motion.div
        variants={fadeUp}
        className="mb-6 rounded-xl border border-[#F1F5F9] bg-white p-6"
      >
        <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">
          Section Header
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
              Badge
            </label>
            <input
              type="text"
              value={section.badge}
              onChange={(e) =>
                setSection((s) => ({ ...s, badge: e.target.value }))
              }
              placeholder="e.g. Our Services"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
              Heading
            </label>
            <input
              type="text"
              value={section.heading}
              onChange={(e) =>
                setSection((s) => ({ ...s, heading: e.target.value }))
              }
              placeholder="e.g. Digital Solutions for Your Business"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
            Subheading
          </label>
          <textarea
            value={section.subheading}
            onChange={(e) =>
              setSection((s) => ({ ...s, subheading: e.target.value }))
            }
            placeholder="Short description..."
            rows={2}
            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
          />
        </div>
        <button
          onClick={handleSaveSection}
          disabled={savingSection || !section.badge || !section.heading}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5B21B6] disabled:opacity-50"
        >
          {savingSection ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {savingSection ? "Saving..." : "Save & Translate"}
        </button>
      </motion.div>

      {/* ── Services List ── */}
      <motion.div
        variants={fadeUp}
        className="mb-6 rounded-xl border border-[#F1F5F9] bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0F172A]">
            Services ({services.length})
          </h2>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-1 rounded-lg bg-[#6D28D9] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5B21B6]"
          >
            <Plus className="h-3 w-3" /> Add Service
          </button>
        </div>

        {services.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#94A3B8]">
            No services yet. Click &quot;Add Service&quot; to create one.
          </p>
        ) : (
          <div className="space-y-2">
            {services.map((svc) => {
              const SvcIcon = getIcon(svc.icon);
              return (
                <div
                  key={svc.id}
                  className={`flex items-center gap-3 rounded-lg border border-[#F1F5F9] p-3 transition-colors ${
                    !svc.visible ? "opacity-50" : ""
                  }`}
                >
                  <GripVertical className="h-4 w-4 flex-shrink-0 text-[#D1D5DB]" />
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${COLOR_PREVIEW[svc.colorTheme] ?? "bg-violet-500"} text-white`}
                  >
                    <SvcIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0F172A]">
                      {svc.label}
                    </p>
                    <p className="truncate text-xs text-[#94A3B8]">
                      /{svc.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleVisibility(svc)}
                      className="rounded-md p-1.5 text-[#94A3B8] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
                      title={svc.visible ? "Hide" : "Show"}
                    >
                      {svc.visible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditForm(svc)}
                      className="rounded-md p-1.5 text-[#94A3B8] hover:bg-[#F8F7FF] hover:text-[#6D28D9]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc)}
                      className="rounded-md p-1.5 text-[#94A3B8] hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Add / Edit Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-xl"
            >
              <h3 className="mb-4 text-base font-bold text-[#0F172A]">
                {editingId ? "Edit Service" : "Add Service"}
              </h3>

              <div className="space-y-4">
                {/* Slug */}
                {!editingId && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
                      Slug (URL path)
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-"),
                        }))
                      }
                      placeholder="e.g. website-development"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9]"
                    />
                  </div>
                )}

                {/* Label */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
                    Label
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, label: e.target.value }))
                    }
                    placeholder="e.g. Website Development"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Short description..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9]"
                  />
                </div>

                {/* Icon picker */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_OPTIONS.map(({ name, Icon }) => (
                      <button
                        key={name}
                        onClick={() => setForm((f) => ({ ...f, icon: name }))}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                          form.icon === name
                            ? "border-[#6D28D9] bg-[#F5F3FF] text-[#6D28D9]"
                            : "border-[#E5E7EB] text-[#94A3B8] hover:border-[#6D28D9] hover:text-[#6D28D9]"
                        }`}
                        title={name}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color theme picker */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">
                    Color Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setForm((f) => ({ ...f, colorTheme: c }))
                        }
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${COLOR_PREVIEW[c]} transition-all ${
                          form.colorTheme === c
                            ? "ring-2 ring-[#0F172A] ring-offset-2"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitService}
                  disabled={
                    savingService ||
                    !form.label ||
                    !form.description ||
                    (!editingId && !form.slug)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5B21B6] disabled:opacity-50"
                >
                  {savingService ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savingService
                    ? "Saving..."
                    : editingId
                      ? "Update & Translate"
                      : "Create & Translate"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
