"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Globe,
  MessageCircle,
  Send,
  Package,
  Smartphone,
  ShoppingCart,
  Zap,
  Code,
  Database,
  Shield,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { ServicesData } from "@/lib/fetchers";

// ─── Icon + color maps ──────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  MessageCircle,
  Send,
  Package,
  Smartphone,
  ShoppingCart,
  Zap,
  Code,
  Database,
  Shield,
  Briefcase,
  Layers,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  violet: { bg: "bg-violet-50", text: "text-[#6D28D9]", border: "border-violet-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
};

const DEFAULT_COLOR = COLOR_MAP.violet;

// ─── Animation ───────────────────────────────────────────────────────────────

const container = {
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

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  data: { id: ServicesData | null; en: ServicesData | null };
};

export default function ServicesSection({ data: allData }: Props) {
  const { locale } = useI18n();
  const data = allData[locale] ?? allData.id;

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (!data) return <section ref={ref} />;

  return (
    <section
      ref={ref}
      aria-labelledby="services-heading"
      className="relative bg-[#F8FAFC] py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          {data.badge && (
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-full border border-[#E5E7EB] bg-white px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-[11px]"
            >
              {data.badge}
            </motion.span>
          )}

          <motion.h2
            id="services-heading"
            variants={fadeUp}
            className="mt-4 text-xl font-bold leading-tight text-[#0F172A] sm:text-2xl lg:text-3xl"
          >
            {data.heading}
          </motion.h2>

          {data.subheading && (
            <motion.p
              variants={fadeUp}
              className="mt-3 text-sm leading-relaxed text-[#64748B] sm:text-base"
            >
              {data.subheading}
            </motion.p>
          )}
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={`mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 ${
            data.services.length <= 4
              ? "lg:grid-cols-4"
              : data.services.length === 3
                ? "lg:grid-cols-3"
                : "lg:grid-cols-4"
          } lg:gap-6`}
        >
          {data.services.map((svc) => {
            const Icon = ICON_MAP[svc.icon] ?? Globe;
            const color = COLOR_MAP[svc.colorTheme] ?? DEFAULT_COLOR;

            return (
              <motion.div key={svc.id} variants={fadeUp}>
                <Link
                  href={`/services/${svc.slug}`}
                  className={`group flex h-full flex-col rounded-2xl border ${color.border} bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 sm:p-6`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.bg} ${color.text} transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-[#0F172A] group-hover:text-[#6D28D9] sm:text-base">
                    {svc.label}
                  </h3>

                  <p className="mt-2 flex-1 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                    {svc.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#6D28D9] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
