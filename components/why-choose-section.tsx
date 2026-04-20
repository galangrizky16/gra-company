"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Heart, TrendingUp, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Feature config ─────────────────────────────────────────────────────────

const FEATURE_ICONS = [Target, Heart, TrendingUp] as const;

const FEATURE_STYLES = [
  {
    from: "from-violet-500",
    to: "to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    ring: "ring-violet-100",
    shadow: "hover:shadow-violet-500/15",
  },
  {
    from: "from-emerald-500",
    to: "to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
    shadow: "hover:shadow-emerald-500/15",
  },
  {
    from: "from-blue-500",
    to: "to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-100",
    shadow: "hover:shadow-blue-500/15",
  },
] as const;

// ─── Animation ───────────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function WhyChooseSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, heading, subtitle, features } = t.whyChoose;

  return (
    <section
      ref={ref}
      aria-labelledby="why-choose-heading"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative blurs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-violet-100/50 to-purple-100/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-gradient-to-br from-blue-100/50 to-cyan-100/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-50/30 to-teal-50/10 blur-3xl" />
      </div>

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
            className="inline-flex items-center gap-2 rounded-full border border-[#6D28D9]/10 bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-[11px]"
          >
            <Star className="h-3 w-3" />
            {badge}
          </motion.span>

          <motion.h2
            id="why-choose-heading"
            variants={fadeUp}
            className="mt-5 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
          >
            {heading}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base lg:text-lg"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* ── Feature cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {features.map((feat, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            const s = FEATURE_STYLES[i % FEATURE_STYLES.length];

            return (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative"
              >
                <div
                  className={`relative flex h-full flex-col rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm transition-shadow duration-300 ${s.shadow} hover:shadow-xl sm:p-8`}
                >
                  {/* Top accent */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${s.from} ${s.to} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Icon */}
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg} ring-1 ${s.ring} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${s.text}`} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-base font-bold text-[#0F172A] transition-colors duration-300 group-hover:text-[#6D28D9] sm:text-lg">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="flex-1 text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
                    {feat.description}
                  </p>

                  {/* Bottom line */}
                  <div
                    className={`mt-6 h-0.5 w-12 rounded-full bg-gradient-to-r ${s.from} ${s.to} opacity-40 transition-all duration-300 group-hover:w-20 group-hover:opacity-100`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
