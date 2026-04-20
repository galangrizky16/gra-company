"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import type { ClientsData } from "@/lib/fetchers";

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  data: { id: ClientsData | null; en: ClientsData | null };
};

export default function ClientsCarousel({ data: allData }: Props) {
  const { locale } = useI18n();
  const data = allData[locale] ?? allData.id;

  if (!data || data.clients.length === 0) return null;

  // Duplicate for seamless marquee loop
  const logos = [...data.clients, ...data.clients];

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16">
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">
          {data.badge}
        </span>
        <h2 className="mt-2 text-xl font-bold text-[#0F172A] sm:text-2xl">
          {data.heading}
        </h2>
      </div>

      {/* Marquee container */}
      <div className="group relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

        {/* Scrolling track */}
        <div className="flex w-max animate-marquee items-center gap-12 px-6 group-hover:[animation-play-state:paused] sm:gap-16">
          {logos.map((logo, i) => (
            <div
              key={`${logo.id}-${i}`}
              className="flex-shrink-0 transition-all duration-300 grayscale hover:scale-105 hover:grayscale-0"
            >
              <Image
                src={logo.logoUrl}
                alt={logo.name}
                width={160}
                height={48}
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
