"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import type { ClientLogo } from "@/lib/fetchers";

// ─── Fuzzy logo finder ───────────────────────────────────────────────────────

function findLogo(company: string, logos: ClientLogo[]): string | null {
  const q = company.toLowerCase();
  // exact
  const exact = logos.find((c) => c.name.toLowerCase() === q);
  if (exact) return exact.logoUrl;
  // partial (either direction)
  const partial = logos.find(
    (c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())
  );
  return partial?.logoUrl ?? null;
}

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

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  clientLogos: ClientLogo[];
};

export default function TestimonialsSection({ clientLogos }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { badge, heading, subtitle, reviews } = t.testimonials;
  const clients = clientLogos;

  // Auto-rotate
  const next = useCallback(() => {
    setActive((i) => (i + 1) % reviews.length);
  }, [reviews.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    autoRef.current = setInterval(next, 6000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [next]);

  const goTo = (i: number) => {
    setActive(i);
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 6000);
  };

  const review = reviews[active];
  const logoUrl = findLogo(review.company, clients);

  return (
    <section
      ref={ref}
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#6D28D9]/[0.03] blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[#6D28D9]/[0.03] blur-3xl" />
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
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-xs"
          >
            <span className="mr-1 inline-block h-px w-5 bg-[#6D28D9]" />
            {badge}
          </motion.span>

          <motion.h2
            id="testimonials-heading"
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

        {/* ── Testimonial card ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-12 max-w-4xl sm:mt-16"
        >
          <div className="relative">
            {/* Main card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#F1F5F9] bg-gradient-to-br from-white to-[#FAFAFE] p-6 shadow-lg shadow-[#6D28D9]/[0.04] sm:p-10 lg:p-12">
              {/* Quote icon */}
              <div className="absolute right-6 top-6 sm:right-10 sm:top-8">
                <Quote className="h-10 w-10 text-[#6D28D9]/10 sm:h-14 sm:w-14" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* Stars */}
                  <div className="mb-5 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5"
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <blockquote className="mb-8 text-base leading-relaxed text-[#334155] sm:text-lg sm:leading-relaxed lg:text-xl lg:leading-relaxed">
                    &ldquo;{review.review}&rdquo;
                  </blockquote>

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6D28D9] to-[#7C3AED] text-lg font-bold text-white shadow-md shadow-[#6D28D9]/20 sm:h-14 sm:w-14">
                      {review.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0F172A] sm:text-base">
                        {review.name}
                      </p>
                      <p className="text-xs text-[#64748B] sm:text-sm">
                        {review.role}
                      </p>
                    </div>

                    {/* Company logo from DB */}
                    {logoUrl ? (
                      <div className="relative hidden h-10 w-24 flex-shrink-0 sm:block lg:w-28">
                        <Image
                          src={logoUrl}
                          alt={review.company}
                          fill
                          className="object-contain object-right opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                          sizes="112px"
                        />
                      </div>
                    ) : (
                      <span className="hidden rounded-lg bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#94A3B8] sm:inline-block">
                        {review.company}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Navigation arrows ── */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 sm:-left-5">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#64748B] shadow-sm transition-all hover:border-[#6D28D9] hover:text-[#6D28D9] hover:shadow-md sm:h-11 sm:w-11"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 sm:-right-5">
              <button
                onClick={() => goTo((active + 1) % reviews.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#64748B] shadow-sm transition-all hover:border-[#6D28D9] hover:text-[#6D28D9] hover:shadow-md sm:h-11 sm:w-11"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── Dots + client selector ── */}
          <div className="mt-8 flex flex-col items-center gap-5">
            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-[#6D28D9]"
                      : "w-2 bg-[#E2E8F0] hover:bg-[#CBD5E1]"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            {/* Client mini-cards */}
            <div className="flex gap-3">
              {reviews.map((r, i) => {
                const isActive = i === active;
                const cLogo = findLogo(r.company, clients);

                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-300 sm:px-4 sm:py-3 ${
                      isActive
                        ? "border-[#6D28D9]/20 bg-[#F5F3FF] shadow-sm"
                        : "border-[#F1F5F9] bg-white hover:border-[#E5E7EB] hover:shadow-sm"
                    }`}
                  >
                    {/* Avatar or logo */}
                    {cLogo ? (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white sm:h-9 sm:w-9">
                        <Image
                          src={cLogo}
                          alt={r.company}
                          fill
                          className="object-contain p-0.5"
                          sizes="36px"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 ${
                          isActive
                            ? "bg-[#6D28D9] text-white"
                            : "bg-[#F1F5F9] text-[#94A3B8]"
                        }`}
                      >
                        {r.name.charAt(0)}
                      </div>
                    )}

                    <div className="hidden text-left sm:block">
                      <p
                        className={`text-xs font-semibold transition-colors ${
                          isActive ? "text-[#0F172A]" : "text-[#64748B]"
                        }`}
                      >
                        {r.name}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">{r.company}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
