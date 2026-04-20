"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

// ─── Background images for each step ────────────────────────────────────────

const STEP_IMAGES = [
  "/assets/kerja/work1.png",
  "/assets/kerja/work2.png",
  "/assets/kerja/work3.png",
  "/assets/kerja/work4.png",
] as const;

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

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function HowWeWorkSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);

  const { badge, heading, subtitle, steps } = t.howWeWork;

  return (
    <section
      ref={ref}
      aria-labelledby="how-we-work-heading"
      className="relative overflow-hidden bg-[#FAFAFA] py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-12 sm:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-xs"
          >
            <span className="mr-1 inline-block h-px w-5 bg-[#6D28D9]" />
            {badge}
          </motion.span>

          <motion.h2
            id="how-we-work-heading"
            variants={fadeUp}
            className="mt-3 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
          >
            {heading}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl text-sm leading-relaxed text-[#64748B] sm:text-base"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* ── Main content: image + steps ── */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ── Left: Image ── */}
          <motion.div
            variants={slideIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative lg:col-span-7"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={STEP_IMAGES[active]}
                    alt={steps[active].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Active step info overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
                      {steps[active].title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80 sm:text-[15px]">
                      {steps[active].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Step cards ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-3 lg:col-span-5"
          >
            {steps.map((step, i) => {
              const isActive = i === active;

              return (
                <motion.button
                  key={i}
                  variants={slideRight}
                  onClick={() => setActive(i)}
                  className={`group relative w-full cursor-pointer rounded-xl border text-left transition-all duration-300 ${
                    isActive
                      ? "border-[#6D28D9]/20 bg-white shadow-lg shadow-[#6D28D9]/5"
                      : "border-transparent bg-white/60 hover:border-gray-200 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-3 bottom-3 w-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-b from-[#6D28D9] to-[#7C3AED] opacity-100"
                        : "bg-gray-200 opacity-0 group-hover:opacity-60"
                    }`}
                  />

                  <div className="flex items-start gap-4 p-4 sm:p-5">
                    {/* Step number */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-[#6D28D9] to-[#7C3AED] text-white shadow-md shadow-[#6D28D9]/25"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500"
                      }`}
                    >
                      {step.number}
                    </div>

                    {/* Text content */}
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-[15px] font-semibold transition-colors duration-300 sm:text-base ${
                          isActive ? "text-[#0F172A]" : "text-[#64748B] group-hover:text-[#334155]"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Description – only shown for active */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden text-[13px] leading-relaxed text-[#64748B] sm:text-sm"
                          >
                            <span className="mt-1.5 block">{step.description}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
