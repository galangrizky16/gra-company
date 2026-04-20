"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { translations, type Locale, type Translations } from "./translations";

type I18nContextValue = {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale = "id",
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, _setLocale] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  // Sync state when initialLocale changes (e.g. navigating between /id and /en)
  useEffect(() => {
    _setLocale(initialLocale);
  }, [initialLocale]);

  // Update <html lang> attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      const newPath = pathname.replace(/^\/(id|en)/, `/${next}`);
      router.push(newPath);
    },
    [locale, pathname, router]
  );

  const toggleLocale = useCallback(() => {
    const next = locale === "id" ? "en" : "id";
    setLocale(next);
  }, [locale, setLocale]);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
