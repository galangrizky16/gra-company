"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { WhyUsData, AboutHeroData } from "@/lib/fetchers";

const WHATSAPP_URL =
  "https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Anda";

// ─── Animated counter ────────────────────────────────────────────────────────

function Counter({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  const match = value.match(/^(\d+)(.*)$/);
  const num = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const id = setInterval(() => {
      current += step;
      if (current >= num) {
        setCount(num);
        clearInterval(id);
      } else {
        setCount(current);
      }
    }, 30);
    return () => clearInterval(id);
  }, [inView, num]);

  return <>{count}{suffix}</>;
}

// ─── Animations ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// ─── Component ──────────────────────────────────────────────────────────────

type Props = {
  whyUsData: { id: WhyUsData | null; en: WhyUsData | null };
  aboutHeroData: { id: AboutHeroData | null; en: AboutHeroData | null };
};

export default function AboutHeroSection({ whyUsData, aboutHeroData }: Props) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // ── Client-side auto-fetch ──
  const [liveHero, setLiveHero] = useState<AboutHeroData | null>(
    aboutHeroData[locale] ?? aboutHeroData.id
  );
  const [liveStats, setLiveStats] = useState<{ value: string; label: string }[]>(
    () => {
      const s = whyUsData[locale]?.stats ?? whyUsData.id?.stats;
      return s?.length ? s : [];
    }
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchLatest() {
      try {
        const [heroRes, statsRes] = await Promise.all([
          fetch(`/api/content/about-hero?locale=${locale}`, { cache: "no-store" }),
          fetch(`/api/content/why-us?locale=${locale}`, { cache: "no-store" }),
        ]);

        if (cancelled) return;

        const heroJson = await heroRes.json();
        const statsJson = await statsRes.json();

        if (heroJson && !heroJson.error) setLiveHero(heroJson);
        else setLiveHero(null);

        if (statsJson?.stats?.length) setLiveStats(statsJson.stats);
        else setLiveStats([]);
      } catch {
        // keep server-rendered data on error
      }
    }

    fetchLatest();
    return () => { cancelled = true; };
  }, [locale]);

  const heroData = liveHero;
  const stats = liveStats;

  // If no data in database, render nothing
  if (!heroData) return null;

  return (
    <section ref={ref} className="relative bg-white">
      {/* ── Hero area ── */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-12">
        {/* Breadcrumb */}
        <motion.nav
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-10 flex items-center gap-1.5 text-sm text-[#94A3B8]"
        >
          <Link
            href={`/${locale}`}
            className="transition-colors hover:text-[#6D28D9]"
          >
            {t.nav.home}
          </Link>
          <span className="text-[#CBD5E1]">/</span>
          <span className="font-medium text-[#0F172A]">{t.nav.about}</span>
        </motion.nav>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <span className="inline-block rounded-full bg-[#F5F3FF] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#6D28D9]">
                {heroData.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-5 text-3xl font-bold leading-snug text-[#0F172A] sm:text-4xl lg:text-[44px] lg:leading-[1.15]"
            >
              {heroData.headline}{" "}
              <span className="text-[#6D28D9]">{heroData.headlineAccent}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#64748B] sm:text-base"
            >
              {heroData.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5B21B6]"
              >
                <MessageCircle className="h-4 w-4" />
                {heroData.cta}
              </a>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-6 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#6D28D9] hover:text-[#6D28D9]"
              >
                {heroData.ctaSecondary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right — image */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F8FAFC]">
              <Image
                src={heroData.imageUrl || "/assets/background/image.png"}
                alt="GRA Tech Solution team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Light overlay for consistency */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/30 to-transparent" />
            </div>

            {/* Small accent card floating bottom-left */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-5 -left-3 rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 shadow-lg sm:-left-6"
              >
                <p className="text-2xl font-bold text-[#0F172A]">{stats[0].value}</p>
                <p className="text-xs text-[#64748B]">{stats[0].label}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      {stats.length > 0 && (
        <div className="border-t border-[#F1F5F9] bg-[#FAFAFA]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#F1F5F9] sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="px-4 py-8 text-center sm:px-6 sm:py-10"
              >
                <p className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                  <Counter value={stat.value} inView={inView} />
                </p>
                <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
