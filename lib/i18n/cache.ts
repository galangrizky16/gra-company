import type { Locale } from "./translations";

const STORAGE_PREFIX = "gra-t-";

// ─── In-memory cache (fast, session-scoped) ─────────────────────────────────

const memoryCache = new Map<string, string>();

function makeKey(locale: Locale, text: string): string {
  return `${locale}:${text}`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getCached(locale: Locale, text: string): string | null {
  const key = makeKey(locale, text);

  // 1. Check memory
  const mem = memoryCache.get(key);
  if (mem !== undefined) return mem;

  // 2. Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored !== null) {
      memoryCache.set(key, stored);
      return stored;
    }
  } catch {
    // SSR or storage unavailable
  }

  return null;
}

export function setCache(locale: Locale, text: string, translated: string) {
  const key = makeKey(locale, text);
  memoryCache.set(key, translated);

  try {
    localStorage.setItem(STORAGE_PREFIX + key, translated);
  } catch {
    // quota exceeded — memory cache still works
  }
}

export function clearCache() {
  memoryCache.clear();

  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
