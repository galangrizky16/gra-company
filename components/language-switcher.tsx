"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/translations";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "id", label: "ID", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "en", label: "EN", flag: "\u{1F1EC}\u{1F1E7}" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="relative inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white p-0.5">
      {/* Animated background pill */}
      <motion.div
        className="absolute inset-y-0.5 z-0 w-[calc(50%-2px)] rounded-md bg-[#6D28D9]"
        animate={{
          left: locale === "id" ? "2px" : "calc(50% + 0px)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {LANGUAGES.map(({ code, label, flag }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={`relative z-10 inline-flex h-full items-center gap-1 rounded-md px-2.5 text-xs font-semibold transition-colors duration-200 ${
              active ? "text-white" : "text-gray-700 hover:text-[#6D28D9]"
            }`}
            aria-label={`Switch to ${label}`}
          >
            <span className="text-sm leading-none">{flag}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
