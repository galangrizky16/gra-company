"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Code2, Cpu, Headphones, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Feature icons ───────────────────────────────────────────────────────────

const FEATURE_ICONS = [Users, Code2, Cpu, Headphones] as const;

const FEATURE_COLORS = [
  {
    bg: "bg-violet-50",
    text: "text-violet-600",
    ring: "ring-violet-100",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-100",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    bg: "bg-amber-50",
    text: "text-amber-600",
    ring: "ring-amber-100",
    gradient: "from-amber-500 to-orange-600",
  },
] as const;

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

export default function AboutUsSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, headline, headlineAccent, description, descriptionSecondary, features } =
    t.about.aboutUs;

  return (
    <section
      ref={ref}
      aria-labelledby="about-us-heading"
      className="relative overflow-hidden bg-[#FAFAFA] py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative blurs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-violet-100/40 to-purple-50/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-50/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left: Text content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#6D28D9]/10 bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-[11px]"
            >
              <Users className="h-3 w-3" />
              {badge}
            </motion.span>

            {/* Headline */}
            <motion.h2
              id="about-us-heading"
              variants={fadeUp}
              className="mt-5 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
            >
              {headline}{" "}
              <span className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] bg-clip-text text-transparent">
                {headlineAccent}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm leading-relaxed text-[#64748B] sm:text-[15px] lg:text-base"
            >
              {description}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm leading-relaxed text-[#64748B] sm:text-[15px] lg:text-base"
            >
              {descriptionSecondary}
            </motion.p>

            {/* Checklist highlights */}
            <motion.div variants={fadeUp} className="mt-8 space-y-3">
              {features.slice(0, 2).map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6D28D9]/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#6D28D9]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{feat.title}</p>
                    <p className="text-xs text-[#64748B]">{feat.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Feature cards grid ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {features.map((feat, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              const color = FEATURE_COLORS[i % FEATURE_COLORS.length];

              return (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative"
                >
                  <div
                    className={`relative flex h-full flex-col rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/5 sm:p-6`}
                  >
                    {/* Top accent line */}
                    <div
                      className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${color.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    {/* Icon */}
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} ring-1 ${color.ring} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-5 w-5 ${color.text}`} />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-sm font-bold text-[#0F172A] transition-colors duration-300 group-hover:text-[#6D28D9] sm:text-base">
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className="flex-1 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                      {feat.description}
                    </p>

                    {/* Bottom accent */}
                    <div
                      className={`mt-4 h-0.5 w-8 rounded-full bg-gradient-to-r ${color.gradient} opacity-30 transition-all duration-300 group-hover:w-14 group-hover:opacity-100`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
