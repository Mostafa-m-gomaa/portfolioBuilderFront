import type { Lang } from "@/contexts/LanguageContext";

const isLocalizedRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Turns API `{ ar, en }` (or nested shapes) into a plain string safe for React children.
 */
export const displayLocalized = (value: unknown, lang: Lang): string => {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (!isLocalizedRecord(value)) return "";

  for (const key of [lang, "en", "ar"] as const) {
    const part = value[key];
    if (typeof part === "string" && part.trim()) return part.trim();
    if (isLocalizedRecord(part)) {
      const nested = displayLocalized(part, lang);
      if (nested) return nested;
    }
  }
  return "";
};
