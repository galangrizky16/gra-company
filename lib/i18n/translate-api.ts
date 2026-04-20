import { z } from "zod";
import type { Locale } from "./translations";
import { getCached, setCache } from "./cache";

// ─── Config ──────────────────────────────────────────────────────────────────

const LIBRE_TRANSLATE_URL = "https://libretranslate.com/translate";

// ─── Zod schema for LibreTranslate response ─────────────────────────────────

const TranslateResponseSchema = z.object({
  translatedText: z.string(),
});

// ─── In-flight deduplication ─────────────────────────────────────────────────

const inflight = new Map<string, Promise<string>>();

// ─── Core translate function ─────────────────────────────────────────────────

export async function translateText(
  text: string,
  target: Locale,
  source: "auto" | Locale = "auto",
  format: "text" | "html" = "text",
  signal?: AbortSignal
): Promise<string> {
  // No translation needed for source language
  if (target === "id" && source === "auto") return text;
  if (target === source) return text;

  // Empty string guard
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Check cache
  const cached = getCached(target, trimmed);
  if (cached !== null) return cached;

  // Deduplicate in-flight requests
  const flightKey = `${target}:${trimmed}`;
  const existing = inflight.get(flightKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(LIBRE_TRANSLATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: trimmed,
          source,
          target,
          format,
        }),
        signal,
      });

      if (!res.ok) {
        throw new Error(`LibreTranslate ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      const parsed = TranslateResponseSchema.parse(json);

      setCache(target, trimmed, parsed.translatedText);
      return parsed.translatedText;
    } catch (err) {
      // Abort is not an error — just return original
      if (err instanceof DOMException && err.name === "AbortError") {
        return text;
      }
      console.warn("[translate] failed, returning original text:", err);
      return text;
    } finally {
      inflight.delete(flightKey);
    }
  })();

  inflight.set(flightKey, promise);
  return promise;
}

// ─── Batch translate (for preloading) ────────────────────────────────────────

export async function translateBatch(
  texts: string[],
  target: Locale,
  source: "auto" | Locale = "auto"
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  await Promise.allSettled(
    texts.map(async (text) => {
      const translated = await translateText(text, target, source);
      results.set(text, translated);
    })
  );

  return results;
}
