"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Clock, Bell } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Animations ──────────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Placeholder cards ──────────────────────────────────────────────────────

const placeholders = [
  { icon: FileText, color: "bg-[#6D28D9]/10 text-[#6D28D9]" },
  { icon: Clock, color: "bg-[#2563EB]/10 text-[#2563EB]" },
  { icon: Bell, color: "bg-[#059669]/10 text-[#059669]" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function BlogSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, heading, subtitle, comingSoon, comingSoonDesc } = t.blog;

  return (
    <section
      ref={ref}
      aria-labelledby="blog-heading"
      className="relative overflow-hidden bg-[#F8FAFC] py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-xs"
          >
            <span className="mr-1 inline-block h-px w-5 bg-[#6D28D9]" />
            {badge}
          </motion.span>

          <motion.h2
            id="blog-heading"
            variants={fadeUp}
            className="mt-3 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
          >
            {heading}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* ── Placeholder cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-3"
        >
          {placeholders.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
              >
                {/* Shimmer line */}
                <div className="mb-5 h-3 w-20 rounded-full bg-[#F1F5F9]" />

                {/* Icon placeholder */}
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title placeholder */}
                <div className="mb-3 h-5 w-3/4 rounded-md bg-[#F1F5F9]" />

                {/* Description placeholders */}
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-[#F1F5F9]" />
                  <div className="h-3 w-5/6 rounded bg-[#F1F5F9]" />
                  <div className="h-3 w-2/3 rounded bg-[#F1F5F9]" />
                </div>

                {/* Bottom bar placeholder */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-3 w-16 rounded bg-[#F1F5F9]" />
                  <div className="h-3 w-px bg-[#E2E8F0]" />
                  <div className="h-3 w-20 rounded bg-[#F1F5F9]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Coming Soon overlay ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto -mt-32 flex max-w-5xl flex-col items-center justify-center rounded-2xl bg-white/80 pb-10 pt-36 backdrop-blur-sm sm:-mt-36 sm:pt-40"
        >
          {/* Animated pulse ring */}
          <div className="relative mb-5">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#6D28D9]/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#6D28D9]/10">
              <Clock className="h-7 w-7 text-[#6D28D9]" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#0F172A] sm:text-2xl">
            {comingSoon}
          </h3>
          <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-[#64748B] sm:text-base">
            {comingSoonDesc}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
