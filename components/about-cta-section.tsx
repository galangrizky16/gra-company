"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const WHATSAPP_URL =
  "https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Anda";

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function AboutCtaSection() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { headline, description, ctaPrimary, ctaSecondary } = t.about.aboutCta;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large centered glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-100/50 via-purple-50/30 to-blue-50/20 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#6D28D9 1px, transparent 1px), linear-gradient(90deg, #6D28D9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto max-w-4xl"
        >
          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#F1F5F9] bg-white shadow-xl shadow-violet-500/5">
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#3B82F6]" />

            {/* Decorative corner blurs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-violet-100/60 to-purple-50/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-50/20 blur-3xl" />

            <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-20 lg:py-20">
              {/* Sparkle icon */}
              <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#7C3AED] shadow-lg shadow-violet-500/25">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h2
                variants={fadeUp}
                className="text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
              >
                {headline}
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base lg:text-lg"
              >
                {description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  {ctaPrimary}
                </a>

                <Link
                  href={`/${locale}/our-work`}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-7 py-3.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all duration-300 hover:border-[#6D28D9] hover:text-[#6D28D9] hover:shadow-md"
                >
                  {ctaSecondary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Trust line */}
              <motion.p
                variants={fadeUp}
                className="mt-6 text-xs text-[#94A3B8]"
              >
                {locale === "id"
                  ? "Tanpa biaya \u2022 Tanpa komitmen \u2022 Respon cepat"
                  : "No cost \u2022 No commitment \u2022 Fast response"}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
