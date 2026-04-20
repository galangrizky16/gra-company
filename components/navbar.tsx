"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/context";
import type { Translations } from "@/lib/i18n/translations";

// ─── Data ────────────────────────────────────────────────────────────────────

function getNavLinks(t: Translations, locale: string) {
  const p = `/${locale}`;
  return [
    { label: t.nav.home, href: p },
    { label: t.nav.about, href: `${p}/about` },
    {
      label: t.nav.services,
      href: `${p}/services`,
      children: [
        {
          label: t.services.websiteDevelopment.label,
          href: `${p}/services/website-development`,
          description: t.services.websiteDevelopment.description,
        },
        {
          label: t.services.whatsappAutomation.label,
          href: `${p}/services/whatsapp-automation`,
          description: t.services.whatsappAutomation.description,
        },
        {
          label: t.services.telegramBot.label,
          href: `${p}/services/telegram-bot`,
          description: t.services.telegramBot.description,
        },
        {
          label: t.services.digitalProducts.label,
          href: `${p}/services/digital-products`,
          description: t.services.digitalProducts.description,
        },
      ],
    },
    { label: t.nav.ourWork, href: `${p}/work` },
    { label: t.nav.careers, href: `${p}/careers` },
    { label: t.nav.blog, href: `${p}/blog` },
    { label: t.nav.contact, href: `${p}/contact` },
  ];
}

type NavLink = ReturnType<typeof getNavLinks>[number];

const WHATSAPP_URL =
  "https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20layanan%20Anda";

// ─── Dropdown ────────────────────────────────────────────────────────────────

type DropdownItem = {
  label: string;
  href: string;
  description: string;
};

function ServicesDropdown({
  items,
  onNavigate,
}: {
  items: readonly DropdownItem[];
  onNavigate?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
    >
      <div className="w-[520px] rounded-xl border border-[#E5E7EB] bg-white/95 p-2 shadow-lg backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="group rounded-lg px-4 py-3 transition-colors hover:bg-[#F5F3FF]"
            >
              <span className="block text-sm font-medium text-[#0F172A] transition-colors group-hover:text-[#6D28D9]">
                {item.label}
              </span>
              <span className="mt-0.5 block text-xs text-[#64748B]">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Desktop Nav Link ────────────────────────────────────────────────────────

function DesktopNavItem({
  link,
  isActive,
}: {
  link: NavLink;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = "children" in link && link.children;

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  if (hasChildren) {
    return (
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
            isActive || open
              ? "text-[#6D28D9]"
              : "text-[#0F172A] hover:text-[#6D28D9]"
          }`}
        >
          {link.label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {isActive && (
          <motion.div
            layoutId="nav-underline"
            className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#6D28D9]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <AnimatePresence>
          {open && (
            <ServicesDropdown
              items={link.children}
              onNavigate={() => setOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={link.href}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? "text-[#6D28D9]" : "text-[#0F172A] hover:text-[#6D28D9]"
      }`}
    >
      {link.label}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#6D28D9]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

// ─── Mobile Menu ─────────────────────────────────────────────────────────────

function MobileMenu({
  isOpen,
  onClose,
  pathname,
  navLinks,
  ctaLabel,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navLinks: NavLink[];
  ctaLabel: string;
  locale: string;
}) {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
              <Link href={`/${locale}`} onClick={onClose} className="text-xl font-bold text-[#0F172A]">
                GRA<span className="text-[#6D28D9]">.</span>
              </Link>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-[#0F172A] transition-colors hover:bg-[#F1F5F9]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  const hasChildren = "children" in link && link.children;

                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.25 }}
                    >
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => setServicesOpen((v) => !v)}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                              isActive
                                ? "bg-[#F5F3FF] text-[#6D28D9]"
                                : "text-[#0F172A] hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
                            }`}
                          >
                            {link.label}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                servicesOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {servicesOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                {link.children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className="block rounded-lg py-2.5 pl-8 pr-4 text-sm text-[#475569] transition-colors hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                            isActive
                              ? "bg-[#F5F3FF] text-[#6D28D9]"
                              : "text-[#0F172A] hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* CTA */}
            <div className="border-t border-[#E5E7EB] px-6 py-5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#5B21B6]"
              >
                <MessageCircle className="h-4 w-4" />
                {ctaLabel}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = getNavLinks(t, locale);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0)",
          borderBottomColor: scrolled
            ? "rgba(229,231,235,1)"
            : "rgba(229,231,235,0)",
          boxShadow: scrolled
            ? "0 1px 3px 0 rgba(0,0,0,0.06)"
            : "0 0px 0px 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex-shrink-0 text-xl font-bold tracking-tight text-[#0F172A]"
          >
            GRA<span className="text-[#6D28D9]">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                ("children" in link &&
                  link.children?.some((c) => pathname === c.href));
              return (
                <DesktopNavItem
                  key={link.href}
                  link={link}
                  isActive={!!isActive}
                />
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <LanguageSwitcher />

            {/* CTA – desktop */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#5B21B6] lg:inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              {t.nav.cta}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F1F5F9] lg:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        navLinks={navLinks}
        ctaLabel={t.nav.cta}
        locale={locale}
      />

      {/* Spacer so content doesn't hide behind fixed header */}
      <div className="h-16" />
    </>
  );
}
