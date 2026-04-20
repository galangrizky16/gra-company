"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Timeline dot colours per milestone ──────────────────────────────────────

const DOT_COLORS = [
  { ring: "ring-violet-200", bg: "bg-violet-600", glow: "shadow-violet-300/50" },
  { ring: "ring-blue-200", bg: "bg-blue-600", glow: "shadow-blue-300/50" },
  { ring: "ring-amber-200", bg: "bg-amber-600", glow: "shadow-amber-300/50" },
  { ring: "ring-emerald-200", bg: "bg-emerald-600", glow: "shadow-emerald-300/50" },
  { ring: "ring-purple-200", bg: "bg-purple-600", glow: "shadow-purple-300/50" },
] as const;

// ─── Animations ──────────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
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
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AboutJourneySection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, headline, headlineAccent, subtitle, milestones } = t.about.journey;

  return (
    <section
      ref={ref}
      aria-labelledby="journey-heading"
      className="relative overflow-hidden bg-[#FAFAFA] py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-violet-100/40 to-purple-50/10 blur-3xl" />
        <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-50/10 blur-3xl" />
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
            <MapPin className="h-3 w-3" />
            {badge}
          </motion.span>

          <motion.h2
            id="journey-heading"
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

        {/* ── Timeline ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative mx-auto max-w-4xl"
        >
          {/* Vertical line — desktop center, mobile left */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-transparent via-[#E2E8F0] to-transparent sm:left-1/2 sm:-translate-x-px" />

          {milestones.map((m, i) => {
            const isLeft = i % 2 === 0;
            const color = DOT_COLORS[i % DOT_COLORS.length];

            return (
              <motion.div
                key={i}
                variants={scaleIn}
                className={`relative mb-10 flex last:mb-0 sm:mb-14 ${
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* ── Dot ── */}
                <div className="absolute left-5 top-2 z-10 -translate-x-1/2 sm:left-1/2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ${color.ring} ${color.bg} shadow-lg ${color.glow}`}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* ── Card ── */}
                <div
                  className={`ml-14 w-full sm:ml-0 sm:w-[calc(50%-2rem)] ${
                    isLeft ? "sm:pr-4 sm:text-right" : "sm:pl-4 sm:text-left"
                  }`}
                >
                  <div className="group rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/5 sm:p-6">
                    {/* Year badge */}
                    <span
                      className={`inline-block rounded-full bg-gradient-to-r ${
                        i === milestones.length - 1
                          ? "from-[#6D28D9] to-[#7C3AED] text-white"
                          : "from-[#F5F3FF] to-[#EDE9FE] text-[#6D28D9]"
                      } px-4 py-1 text-xs font-bold tracking-wide`}
                    >
                      {m.year}
                    </span>

                    <h3 className="mt-3 text-base font-bold text-[#0F172A] transition-colors duration-300 group-hover:text-[#6D28D9] sm:text-lg">
                      {m.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                      {m.description}
                    </p>

                    {/* Bottom accent */}
                    <div
                      className={`mt-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] opacity-30 transition-all duration-300 group-hover:w-16 group-hover:opacity-100 ${
                        isLeft ? "sm:ml-auto" : ""
                      }`}
                    />
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
