import {
  DISPLAY_CURRENCY_OPTIONS,
  isSupportedDisplayCurrency,
} from "@/lib/pricingDisplayCurrencies";

export const PRICING_DISPLAY_CURRENCY_STORAGE_KEY =
  "portfolio_pricing_display_currency";

export const PRICING_CURRENCY_SELECT_ID = "pricing-display-currency";

export const PRICING_DISPLAY_CURRENCY_CHANGE_EVENT =
  "portfolio_pricing_display_currency_change";

const defaultCode = DISPLAY_CURRENCY_OPTIONS[0]?.code ?? "EGP";

export const getStoredDisplayCurrency = (): string => {
  if (typeof window === "undefined") return defaultCode;
  try {
    const raw = window.localStorage.getItem(PRICING_DISPLAY_CURRENCY_STORAGE_KEY);
    if (raw && isSupportedDisplayCurrency(raw)) return raw.toUpperCase();
  } catch {
    /* ignore */
  }
  return defaultCode;
};

export const subscribeDisplayCurrency = (onChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key == null || e.key === PRICING_DISPLAY_CURRENCY_STORAGE_KEY) {
      onChange();
    }
  };
  const onLocal = () => onChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(PRICING_DISPLAY_CURRENCY_CHANGE_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PRICING_DISPLAY_CURRENCY_CHANGE_EVENT, onLocal);
  };
};

export const persistDisplayCurrency = (code: string): boolean => {
  if (typeof window === "undefined") return false;
  const next = code.trim().toUpperCase();
  if (!isSupportedDisplayCurrency(next)) return false;
  try {
    window.localStorage.setItem(PRICING_DISPLAY_CURRENCY_STORAGE_KEY, next);
    window.dispatchEvent(new Event(PRICING_DISPLAY_CURRENCY_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
};
