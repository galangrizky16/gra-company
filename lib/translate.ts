/**
 * MyMemory Translation API — Free, no API key required.
 * https://mymemory.translated.net/doc/spec.php
 *
 * Limits: 5,000 chars/day (anonymous), 50,000/day (with email).
 * Set MYMEMORY_EMAIL in .env for higher limits.
 */

const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL ?? "";

type MyMemoryResponse = {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
};

/**
 * Translate a single string using MyMemory API.
 * langpair format: "en|id", "id|en"
 */
export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  if (!text.trim()) return text;

  const params = new URLSearchParams({
    q: text,
    langpair: `${source}|${target}`,
  });
  if (MYMEMORY_EMAIL) params.set("de", MYMEMORY_EMAIL);

  const res = await fetch(
    `https://api.mymemory.translated.net/get?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error(`MyMemory error (${res.status})`);
  }

  const data: MyMemoryResponse = await res.json();

  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory returned status ${data.responseStatus}`);
  }

  return data.responseData.translatedText;
}

/**
 * Translate multiple fields of an object.
 * Returns a new object with the same keys but translated values.
 */
export async function translateFields<T extends Record<string, string>>(
  fields: T,
  source: string,
  target: string
): Promise<T> {
  const entries = Object.entries(fields);
  const translated = await Promise.all(
    entries.map(async ([key, value]) => {
      const result = await translateText(value, source, target);
      return [key, result] as const;
    })
  );
  return Object.fromEntries(translated) as T;
}
