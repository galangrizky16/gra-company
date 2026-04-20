"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages,
  Plus,
  Trash2,
  Upload,
  GripVertical,
  X,
} from "lucide-react";
import { compressImage } from "@/lib/compress-image";

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = "id" | "en";

type SectionText = { badge: string; heading: string };

type ClientItem = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
  order: number;
  visible: boolean;
};

const EMPTY_SECTION: SectionText = { badge: "", heading: "" };

// ─── Animation ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminClientsPage() {
  // Section text state
  const [locale, setLocale] = useState<Locale>("id");
  const [section, setSection] = useState<SectionText>(EMPTY_SECTION);
  const [savedSections, setSavedSections] = useState<Record<string, SectionText>>({});
  const [savingSection, setSavingSection] = useState(false);

  // Clients state
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add client form
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Status
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  // ── Fetch data ──

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [secRes, cliRes] = await Promise.all([
        fetch("/api/admin/clients/section"),
        fetch("/api/admin/clients"),
      ]);
      const secData = await secRes.json();
      const cliData = await cliRes.json();

      setSavedSections(secData);
      if (secData[locale]) {
        setSection({ badge: secData[locale].badge ?? "", heading: secData[locale].heading ?? "" });
      } else {
        setSection(EMPTY_SECTION);
      }

      setClients(Array.isArray(cliData) ? cliData : []);
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
    if (savedSections[l]) {
      setSection({ badge: savedSections[l].badge ?? "", heading: savedSections[l].heading ?? "" });
    } else {
      setSection(EMPTY_SECTION);
    }
    setStatus("idle");
  };

  // ── Save section text ──

  const handleSaveSection = async () => {
    setSavingSection(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/clients/section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...section }),
      });
      if (!res.ok) throw new Error("Failed to save");
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

  // ── File select + compress ──

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setNewFile(compressed);
      setPreview(URL.createObjectURL(compressed));
    } catch {
      setNewFile(file);
      setPreview(URL.createObjectURL(file));
    } finally {
      setCompressing(false);
    }
  };

  // ── Add client ──

  const handleAddClient = async () => {
    if (!newName || !newFile) return;
    setAdding(true);
    try {
      const fd = new FormData();
      fd.append("name", newName);
      fd.append("website", newWebsite);
      fd.append("order", String(clients.length));
      fd.append("logo", newFile);

      const res = await fetch("/api/admin/clients", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Failed");

      // Reset form
      setNewName("");
      setNewWebsite("");
      setNewFile(null);
      setPreview(null);
      setShowAdd(false);
      if (fileRef.current) fileRef.current.value = "";

      await fetchAll();
      setStatus("success");
      setStatusMsg("Client added!");
    } catch {
      setStatus("error");
      setStatusMsg("Failed to add client");
    } finally {
      setAdding(false);
    }
  };

  // ── Delete client ──

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      setClients((prev) => prev.filter((c) => c.id !== id));
      setStatus("success");
      setStatusMsg("Client deleted");
    } catch {
      setStatus("error");
      setStatusMsg("Failed to delete client");
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
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Clients</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage client logos and section text.
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

      {/* ── Section Text ── */}
      <motion.div variants={fadeUp} className="mb-6 rounded-xl border border-[#F1F5F9] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#0F172A]">Section Text</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Badge</label>
            <input
              type="text"
              value={section.badge}
              onChange={(e) => setSection((s) => ({ ...s, badge: e.target.value }))}
              placeholder="e.g. Dipercaya oleh perusahaan"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Heading</label>
            <input
              type="text"
              value={section.heading}
              onChange={(e) => setSection((s) => ({ ...s, heading: e.target.value }))}
              placeholder="e.g. Klien Kami"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
            />
          </div>
        </div>
        <button
          onClick={handleSaveSection}
          disabled={savingSection || !section.badge || !section.heading}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {savingSection ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {savingSection ? "Saving..." : "Save & Translate"}
        </button>
      </motion.div>

      {/* ── Client Logos ── */}
      <motion.div variants={fadeUp} className="rounded-xl border border-[#F1F5F9] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0F172A]">
            Client Logos ({clients.length})
          </h2>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#6D28D9] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#5B21B6]"
          >
            {showAdd ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showAdd ? "Cancel" : "Add Client"}
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-4 rounded-lg border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Client Name *</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. PT Example"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Website (optional)</label>
                    <input
                      type="text"
                      value={newWebsite}
                      onChange={(e) => setNewWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/10"
                    />
                  </div>
                </div>

                {/* Logo upload */}
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold text-[#0F172A]">Logo *</label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]">
                      <Upload className="h-4 w-4" />
                      {compressing ? "Compressing..." : "Choose File"}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    {preview && (
                      <div className="relative h-10 w-24 overflow-hidden rounded border border-[#E5E7EB] bg-white p-1">
                        <Image src={preview} alt="Preview" fill className="object-contain" />
                      </div>
                    )}
                    {newFile && (
                      <span className="text-xs text-[#94A3B8]">
                        {(newFile.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#94A3B8]">
                    Images are auto-compressed to WebP format for fast loading.
                  </p>
                </div>

                <button
                  onClick={handleAddClient}
                  disabled={adding || !newName || !newFile}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {adding ? "Uploading..." : "Add Client"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Client list */}
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
              <GripVertical className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <p className="text-sm font-medium text-[#64748B]">No clients yet</p>
            <p className="mt-1 text-xs text-[#94A3B8]">Add your first client logo above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-4 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3 transition-colors hover:bg-white"
              >
                <div className="relative h-10 w-20 flex-shrink-0 overflow-hidden rounded bg-white p-1">
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#0F172A]">{client.name}</p>
                  {client.website && (
                    <p className="truncate text-xs text-[#94A3B8]">{client.website}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
