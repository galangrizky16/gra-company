"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { HeroData } from "@/lib/fetchers";

const WHATSAPP_URL =
  "https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Anda";

// ─── Animation variants ──────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  data: { id: HeroData | null; en: HeroData | null };
};

export default function HeroSection({ data }: Props) {
  const { locale } = useI18n();
  const hero = data[locale] ?? data.id;

  if (!hero) return null;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/background/image.png')" }}
      />

      {/* White overlay for readability */}
      <div className="absolute inset-0 bg-white/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl text-center lg:text-left"
        >
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full border border-[#E5E7EB] bg-white/60 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#6D28D9]"
          >
            {hero.badge}
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl"
          >
            {hero.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-base leading-relaxed text-[#64748B] sm:text-lg lg:max-w-xl"
          >
            {hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
          >
            {/* Primary CTA */}
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6D28D9]/20 transition-colors hover:bg-[#5B21B6] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              {hero.ctaPrimary}
            </motion.a>

            {/* Secondary CTA */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/work"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-7 py-3.5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9] sm:w-auto"
              >
                {hero.ctaSecondary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
