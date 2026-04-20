"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2,
  Database,
  Bot,
  Wrench,
  Cpu,
  Globe,
  FileCode2,
  Paintbrush,
  Terminal,
  Cloud,
  MessageCircle,
  Send,
  Timer,
  GitBranch,
  Monitor,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  react: Globe,
  nextjs: Monitor,
  typescript: FileCode2,
  tailwind: Paintbrush,
  nodejs: Terminal,
  prisma: Database,
  postgresql: Database,
  api: Cpu,
  whatsapp: MessageCircle,
  telegram: Send,
  bot: Bot,
  cron: Timer,
  git: GitBranch,
  vercel: Cloud,
  vscode: Code2,
  figma: Paintbrush,
};

// ─── Category colors ─────────────────────────────────────────────────────────

const CAT_COLORS = [
  {
    border: "border-violet-100",
    badge: "bg-violet-50 text-violet-600",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    ring: "ring-violet-100",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    border: "border-blue-100",
    badge: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    ring: "ring-blue-100",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    border: "border-emerald-100",
    badge: "bg-emerald-50 text-emerald-600",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    ring: "ring-emerald-100",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    border: "border-amber-100",
    badge: "bg-amber-50 text-amber-600",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    ring: "ring-amber-100",
    gradient: "from-amber-500 to-orange-600",
  },
] as const;

const CAT_ICONS = [Code2, Database, Bot, Wrench] as const;

// ─── Animations ──────────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AboutTechStackSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, headline, headlineAccent, subtitle, categories } =
    t.about.techStack;

  return (
    <section
      ref={ref}
      aria-labelledby="techstack-heading"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-violet-50/50 via-purple-50/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[#6D28D9]/10 bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-[11px]"
          >
            <Code2 className="h-3 w-3" />
            {badge}
          </motion.span>

          <motion.h2
            id="techstack-heading"
            variants={fadeUp}
            className="mt-5 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
          >
            {headline}{" "}
            <span className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] bg-clip-text text-transparent">
              {headlineAccent}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* ── Category grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {categories.map((cat, ci) => {
            const color = CAT_COLORS[ci % CAT_COLORS.length];
            const CatIcon = CAT_ICONS[ci % CAT_ICONS.length];

            return (
              <motion.div
                key={ci}
                variants={scaleIn}
                className="group relative"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border ${color.border} bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 sm:p-6`}
                >
                  {/* Top accent */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Category header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${color.iconBg} ring-1 ${color.ring}`}
                    >
                      <CatIcon className={`h-4 w-4 ${color.iconText}`} />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] sm:text-base">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Tech items */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {cat.items.map((item, ii) => {
                      const Icon = ICON_MAP[item.icon] ?? Cpu;

                      return (
                        <div
                          key={ii}
                          className="flex items-center gap-2.5 rounded-xl border border-[#F1F5F9] bg-[#FAFAFA] px-3 py-2.5 transition-all duration-200 hover:border-[#6D28D9]/15 hover:bg-[#F5F3FF]/50"
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${color.iconText}`}
                          />
                          <span className="text-xs font-medium text-[#334155] sm:text-sm">
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
