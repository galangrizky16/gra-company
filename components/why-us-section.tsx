"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { WhyUsData } from "@/lib/fetchers";

// ─── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.8, ease: "easeOut" as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  data: { id: WhyUsData | null; en: WhyUsData | null };
};

export default function WhyUsSection({ data: allData }: Props) {
  const { locale } = useI18n();
  const data = allData[locale] ?? allData.id;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  if (!data) return <section ref={sectionRef} />;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[50vh] items-center justify-center overflow-hidden sm:min-h-[60vh] lg:min-h-[80vh]"
    >
      {/* ── Video background ── */}
      {data.videoUrl && (
        <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={data.videoUrl} />
          </video>
        </motion.div>
      )}

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-12 text-center sm:py-16 lg:py-20">
        {/* Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm sm:px-5 sm:py-1.5 sm:text-[11px]">
            {data.badge}
          </span>
          <h2 className="mt-3 text-lg font-bold leading-tight text-white sm:mt-4 sm:text-2xl lg:text-4xl">
            {data.heading}
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 grid gap-3 sm:mt-14 sm:gap-6 lg:gap-12"
          style={{ gridTemplateColumns: `repeat(${Math.min(data.stats.length, 4)}, minmax(0, 1fr))` }}
        >
          {data.stats.map((stat, i) => (
            <motion.div
              key={`${stat.value}-${i}`}
              variants={itemVariants}
              className="group flex flex-col items-center"
            >
              <div className="mb-3 h-px w-8 bg-[#6D28D9] transition-all duration-500 group-hover:w-14 sm:mb-5 sm:w-12 sm:group-hover:w-20" />
              <span className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl">
                {stat.value}
              </span>
              <span className="mt-1 text-[11px] font-medium leading-tight text-white/70 sm:mt-2 sm:text-sm lg:text-base">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-8 sm:mt-14"
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0F172A] sm:px-8 sm:py-3.5 sm:text-sm"
          >
            {data.ctaText}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
