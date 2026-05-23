import type { Lang } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";

const LANG_STORAGE_KEY = "sirty_ui_lang";

export function getAppLang(): Lang {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  }
  if (typeof document !== "undefined") {
    const doc = document.documentElement.lang;
    if (doc === "ar" || doc === "en") return doc;
  }
  return "ar";
}

export function setStoredAppLang(lang: Lang) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}

export function translate(lang: Lang, key: string): string {
  return translations[lang][key] ?? key;
}

export function tToast(key: string): string {
  return translate(getAppLang(), key);
}
