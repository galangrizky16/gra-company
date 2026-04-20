"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const WHATSAPP_URL =
  "https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Anda";

// ─── SVG Wave ────────────────────────────────────────────────────────────────

function Wave() {
  return (
    <div className="relative -mb-1 w-full overflow-hidden leading-none">
      <svg
        className="relative block h-16 w-full sm:h-20 lg:h-28"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,60 C200,110 400,10 600,60 C800,110 1000,10 1200,60 C1320,90 1380,40 1440,55 L1440,120 L0,120 Z"
          fill="#111B2E"
        />
        <path
          d="M0,40 C180,100 360,0 540,50 C720,100 900,20 1080,60 C1200,85 1320,30 1440,50 L1440,120 L0,120 Z"
          fill="#0F172A"
        />
      </svg>
    </div>
  );
}

// ─── Social Icons ────────────────────────────────────────────────────────────

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.51V7.12a4.83 4.83 0 0 1-1-.43z" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Footer() {
  const { t, locale } = useI18n();
  const year = new Date().getFullYear();
  const p = `/${locale}`;

  const quickLinks = [
    { label: t.nav.home, href: p },
    { label: t.nav.about, href: `${p}/about` },
    { label: t.nav.ourWork, href: `${p}/portfolio` },
    { label: t.nav.careers, href: `${p}/careers` },
    { label: t.nav.blog, href: `${p}/blog` },
    { label: t.nav.contact, href: `${p}/contact` },
  ];

  const serviceLinks = [
    { label: t.services.websiteDevelopment.label, href: `${p}/services/website-development` },
    { label: t.services.whatsappAutomation.label, href: `${p}/services/whatsapp-automation` },
    { label: t.services.telegramBot.label, href: `${p}/services/telegram-bot` },
    { label: t.services.digitalProducts.label, href: `${p}/services/digital-products` },
  ];

  return (
    <>
      {/* Wave decoration */}
      <Wave />
    <footer className="relative bg-[#0F172A] pt-10 sm:pt-14 lg:pt-16">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={p} className="inline-block">
              <span className="text-2xl font-extrabold text-white">
                GRA<span className="text-[#6D28D9]">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#94A3B8]">
              {t.footer.description}
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-[#94A3B8] transition-all hover:bg-[#25D366]/20 hover:text-[#25D366]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-[#94A3B8] transition-all hover:bg-[#E1306C]/20 hover:text-[#E1306C]"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-[#94A3B8] transition-all hover:bg-white/10 hover:text-white"
                aria-label="TikTok"
              >
                <TiktokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.services}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.contactUs}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:hello@gratech.id"
                  className="flex items-center gap-2.5 text-sm text-[#94A3B8] transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#6D28D9]" />
                  hello@gratech.id
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-[#94A3B8] transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#6D28D9]" />
                  +62 812-3456-7890
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2.5 text-sm text-[#94A3B8]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#6D28D9]" />
                  {t.footer.address}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-12 border-t border-white/[0.06]" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-[#64748B]">
            &copy; {year} {t.footer.copyright}
          </p>
          <p className="flex items-center gap-1 text-xs text-[#64748B]">
            {t.footer.madeWith}
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            {t.footer.inIndonesia}
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
