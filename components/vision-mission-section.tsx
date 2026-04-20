"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Eye,
  Rocket,
  Shield,
  Lightbulb,
  Handshake,
  Award,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Icon map for values ─────────────────────────────────────────────────────

const VALUE_ICONS: Record<string, React.ElementType> = {
  integrity: Shield,
  innovation: Lightbulb,
  collaboration: Handshake,
  excellence: Award,
};

const VALUE_COLORS = [
  {
    bg: "bg-violet-50",
    text: "text-violet-600",
    ring: "ring-violet-100",
    border: "border-violet-100",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    bg: "bg-amber-50",
    text: "text-amber-600",
    ring: "ring-amber-100",
    border: "border-amber-100",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-100",
    border: "border-blue-100",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
    border: "border-emerald-100",
    gradient: "from-emerald-500 to-teal-600",
  },
] as const;

// ─── Animations ──────────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
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

export default function VisionMissionSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, vision, mission, values } = t.about.visionMission;

  return (
    <section
      ref={ref}
      aria-labelledby="vision-mission-heading"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-50/60 via-purple-50/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-50/40 to-indigo-50/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
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
            <Sparkles className="h-3 w-3" />
            {badge}
          </motion.span>
        </motion.div>

        {/* ── Vision & Mission cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Vision Card */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-500/5"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6]" />

            <div className="p-6 sm:p-8">
              {/* Icon */}
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 ring-1 ring-violet-100">
                <Eye className="h-6 w-6 text-violet-600" />
              </div>

              {/* Title */}
              <h3
                id="vision-mission-heading"
                className="mb-3 text-xl font-extrabold text-[#0F172A] sm:text-2xl"
              >
                {vision.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
                {vision.description}
              </p>

              {/* Decorative gradient circle */}
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-100/40 to-purple-50/10 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/5"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA]" />

            <div className="p-6 sm:p-8">
              {/* Icon */}
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
                <Rocket className="h-6 w-6 text-blue-600" />
              </div>

              {/* Title */}
              <h3 className="mb-4 text-xl font-extrabold text-[#0F172A] sm:text-2xl">
                {mission.title}
              </h3>

              {/* Mission items */}
              <ul className="space-y-3">
                {mission.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <p className="text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Decorative gradient circle */}
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-50/10 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Values ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-12 sm:mt-16"
        >
          <motion.h3
            variants={fadeUp}
            className="mb-8 text-center text-lg font-extrabold text-[#0F172A] sm:text-xl lg:text-2xl"
          >
            {values.title}
          </motion.h3>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4">
            {values.items.map((val, i) => {
              const Icon = VALUE_ICONS[val.icon] ?? Shield;
              const color = VALUE_COLORS[i % VALUE_COLORS.length];

              return (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative"
                >
                  <div
                    className={`relative flex h-full flex-col items-center rounded-2xl border ${color.border} bg-white p-5 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 sm:p-6`}
                  >
                    {/* Icon circle */}
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${color.bg} ring-1 ${color.ring} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-6 w-6 ${color.text}`} />
                    </div>

                    {/* Title */}
                    <h4 className="mb-1.5 text-sm font-bold text-[#0F172A] sm:text-base">
                      {val.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-[#64748B] sm:text-sm">
                      {val.description}
                    </p>

                    {/* Bottom accent */}
                    <div
                      className={`mt-4 h-0.5 w-8 rounded-full bg-gradient-to-r ${color.gradient} opacity-30 transition-all duration-300 group-hover:w-14 group-hover:opacity-100`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
