"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

// ─── Inline SVG brand logos ──────────────────────────────────────────────────

function DanaLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#108ee9" />
      <text x="20" y="26" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="16" fill="#fff">DANA</text>
    </svg>
  );
}

function OvoLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#4c3494" />
      <text x="20" y="26" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="15" fill="#fff">OVO</text>
    </svg>
  );
}

function GopayLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#00aed6" />
      <circle cx="20" cy="18" r="7" stroke="#fff" strokeWidth="2.5" fill="none" />
      <text x="20" y="36" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="6" fill="#fff">GOPAY</text>
    </svg>
  );
}

function ShopeepayLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#ee4d2d" />
      <text x="20" y="22" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="8" fill="#fff">Shopee</text>
      <text x="20" y="32" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7" fill="#ffffffcc">Pay</text>
    </svg>
  );
}

function LinkajaLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#e82529" />
      <text x="20" y="22" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="8" fill="#fff">Link</text>
      <text x="20" y="32" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7" fill="#ffffffcc">Aja</text>
    </svg>
  );
}

function BriLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#00529c" />
      <text x="20" y="26" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fill="#fff">BRI</text>
    </svg>
  );
}

function JagoLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#ffe300" />
      <text x="20" y="26" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="12" fill="#1a1a1a">JAGO</text>
    </svg>
  );
}

function QrisLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#e41e2c" />
      <rect x="10" y="10" width="8" height="8" rx="1" fill="#fff" />
      <rect x="22" y="10" width="8" height="8" rx="1" fill="#fff" />
      <rect x="10" y="22" width="8" height="8" rx="1" fill="#fff" />
      <rect x="24" y="24" width="4" height="4" rx="1" fill="#fff" />
    </svg>
  );
}

const BRANDS = [
  { name: "Dana", label: "E-Wallet", Logo: DanaLogo },
  { name: "OVO", label: "E-Wallet", Logo: OvoLogo },
  { name: "GoPay", label: "E-Wallet", Logo: GopayLogo },
  { name: "ShopeePay", label: "E-Wallet", Logo: ShopeepayLogo },
  { name: "LinkAja", label: "E-Wallet", Logo: LinkajaLogo },
  { name: "Bank BRI", label: "Bank", Logo: BriLogo },
  { name: "Bank Jago", label: "Bank", Logo: JagoLogo },
  { name: "QRIS", label: "QRIS", Logo: QrisLogo },
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

// ─── Marquee row ─────────────────────────────────────────────────────────────

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="group relative flex overflow-hidden py-2">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent sm:w-24" />

      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={`flex shrink-0 gap-4 ${
            reverse ? "animate-marquee-reverse" : "animate-marquee"
          } group-hover:[animation-play-state:paused]`}
        >
          {items.map((brand, i) => {
            const { Logo } = brand;
            return (
              <div
                key={`${copy}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/80 bg-white px-5 py-3.5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1"
              >
                <Logo size={40} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    {brand.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AboutPaymentSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { badge, headline, headlineAccent, subtitle } = t.about.payment;

  return (
    <section
      ref={ref}
      aria-labelledby="payment-heading"
      className="relative overflow-hidden bg-[#FAFAFA] py-16 sm:py-20 lg:py-28"
    >
      {/* ── Decorative ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-violet-100/30 to-purple-50/10 blur-3xl" />
        <div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-100/30 to-teal-50/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[#6D28D9]/10 bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D28D9] sm:text-[11px]"
          >
            <CreditCard className="h-3 w-3" />
            {badge}
          </motion.span>

          <motion.h2
            id="payment-heading"
            variants={fadeUp}
            className="mt-5 text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
          >
            {headline}{" "}
            <span className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] bg-clip-text text-transparent">
              {headlineAccent}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* ── Marquee rows ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          <MarqueeRow />
          <MarqueeRow reverse />
        </motion.div>
      </div>
    </section>
  );
}
