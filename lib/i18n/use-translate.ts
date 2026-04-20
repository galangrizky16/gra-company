"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "./context";
import { translateText } from "./translate-api";
import { getCached } from "./cache";

type TranslateState = {
  text: string;
  isLoading: boolean;
  error: string | null;
};

/**
 * Translates a string based on the current locale.
 *
 * - If locale is "id" (base language), returns text instantly.
 * - If locale is "en", checks cache first → falls back to API.
 * - Includes debounce to avoid rapid-fire API calls.
 *
 * @param originalText - The original text in Indonesian (base language)
 * @param debounceMs  - Debounce delay in ms (default 150)
 */
export function useTranslate(
  originalText: string,
  debounceMs = 150
): TranslateState {
  const { locale } = useI18n();
  const [state, setState] = useState<TranslateState>(() => {
    // If base language or cached, resolve immediately
    if (locale === "id") return { text: originalText, isLoading: false, error: null };
    const cached = getCached(locale, originalText.trim());
    if (cached) return { text: cached, isLoading: false, error: null };
    return { text: originalText, isLoading: true, error: null };
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Base language — no translation needed
    if (locale === "id") {
      setState({ text: originalText, isLoading: false, error: null });
      return;
    }

    // Check cache synchronously
    const cached = getCached(locale, originalText.trim());
    if (cached) {
      setState({ text: cached, isLoading: false, error: null });
      return;
    }

    // Show original text while loading
    setState({ text: originalText, isLoading: true, error: null });

    // Debounce the API call
    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      translateText(originalText, locale, "auto", "text", controller.signal)
        .then((translated) => {
          if (!controller.signal.aborted) {
            setState({ text: translated, isLoading: false, error: null });
          }
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            setState({ text: originalText, isLoading: false, error: String(err) });
          }
        });
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [originalText, locale, debounceMs]);

  return state;
}

/**
 * Imperative translate function for one-off translations.
 * Returns the current locale's translate helper.
 */
export function useTranslateFn() {
  const { locale } = useI18n();

  return async (text: string): Promise<string> => {
    if (locale === "id") return text;
    return translateText(text, locale);
  };
}
