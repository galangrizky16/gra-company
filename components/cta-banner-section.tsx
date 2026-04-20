"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { WhyUsData } from "@/lib/fetchers";

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  data: { id: WhyUsData | null; en: WhyUsData | null };
};

export default function CtaBannerSection({ data: allData }: Props) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const whyUsData = allData[locale] ?? allData.id;
  const { headline, description, cta } = t.ctaBanner;
  const stats = (whyUsData?.stats?.length ? whyUsData.stats : t.ctaBanner.stats).slice(0, 3);

  return (
    <section
      ref={ref}
      aria-label="Free consultation banner"
      className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1A2E4A] to-[#162540]"
    >
      {/* Subtle light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-[#2563EB]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid min-h-[480px] grid-cols-1 items-center lg:grid-cols-[1fr,auto]">
          {/* ── Left: Text content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative z-10 py-14 sm:py-20 lg:max-w-xl lg:py-24"
          >
            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-extrabold leading-[1.2] text-white sm:text-3xl lg:text-[2.5rem] lg:leading-[1.2]"
            >
              {headline.split(" ").map((word, i) => {
                const highlights = [
                  "digital",
                  "solusi",
                  "solution",
                  "bisnis",
                  "business",
                ];
                const isHighlight = highlights.some(
                  (h) => word.toLowerCase().replace(/[?,!]/g, "") === h
                );
                return (
                  <span key={i}>
                    {isHighlight ? (
                      <span className="text-[#60A5FA]">{word}</span>
                    ) : (
                      word
                    )}{" "}
                  </span>
                );
              })}
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-[15px] sm:leading-relaxed"
            >
              {description}
            </motion.p>

            {/* CTA button */}
            <motion.div variants={fadeUp} className="mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:bg-[#20BD5A] hover:shadow-xl sm:text-base"
              >
                <MessageCircle className="h-5 w-5" />
                {cta}
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex gap-8 border-t border-white/10 pt-8 sm:gap-12"
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Person image (desktop) ── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="absolute -top-4 bottom-0 right-0 hidden w-[48%] lg:block"
          >
            {/* ── Decorations behind person ── */}
            {/* Main glow circle (centered behind torso) */}
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-[55%] rounded-full bg-[#3B82F6]/[0.12] blur-[2px]" />
            {/* Outer ring */}
            <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-[55%] rounded-full border border-white/[0.07]" />
            {/* Inner ring */}
            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-[55%] rounded-full border border-dashed border-white/[0.05]" />
            {/* Smaller accent circles */}
            <div className="absolute left-[8%] top-[22%] h-16 w-16 rounded-full border border-white/[0.06]" />
            <div className="absolute bottom-[18%] right-[6%] h-20 w-20 rounded-full border border-white/[0.05]" />
            {/* Floating dots */}
            <div className="absolute left-[12%] top-[35%] h-2.5 w-2.5 rounded-full bg-[#60A5FA]/50" />
            <div className="absolute bottom-[35%] left-[6%] h-2 w-2 rounded-full bg-[#60A5FA]/30" />
            <div className="absolute right-[10%] top-[12%] h-2 w-2 rounded-full bg-white/25" />
            <div className="absolute bottom-[45%] right-[4%] h-1.5 w-1.5 rounded-full bg-[#93C5FD]/40" />
            {/* Plus accents */}
            <div className="absolute left-[18%] top-[18%] text-white/[0.08] text-lg font-light">+</div>
            <div className="absolute bottom-[28%] right-[14%] text-white/[0.06] text-sm font-light">+</div>

            {/* Person image */}
            <div className="relative z-10 h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos-human.png"
                alt="GRA Tech Solution Consultant"
                className="absolute bottom-0 right-0 h-[110%] w-auto max-w-none object-contain object-right-bottom"
              />
            </div>
          </motion.div>

          {/* ── Mobile: Person image ── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative lg:hidden"
          >
            <div className="relative mx-auto -mb-1 flex h-[340px] max-w-sm items-end justify-center">
              {/* Mobile glow */}
              <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/[0.1]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos-human.png"
                alt="GRA Tech Solution Consultant"
                className="relative z-10 h-full w-auto object-contain object-bottom"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
