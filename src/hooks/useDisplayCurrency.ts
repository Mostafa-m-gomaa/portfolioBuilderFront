import { useCallback, useState } from "react";
import {
  DISPLAY_CURRENCY_OPTIONS,
  isSupportedDisplayCurrency,
} from "@/lib/pricingDisplayCurrencies";

const STORAGE_KEY = "portfolio_pricing_display_currency";

const defaultCode = DISPLAY_CURRENCY_OPTIONS[0]?.code ?? "EGP";

const readStored = (): string => {
  if (typeof window === "undefined") return defaultCode;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && isSupportedDisplayCurrency(raw)) return raw.toUpperCase();
  } catch {
    /* ignore */
  }
  return defaultCode;
};

/** Shared display currency for package list + detail (persisted). */
export const useDisplayCurrency = () => {
  const [displayCurrency, setDisplayCurrencyState] = useState(() => readStored());

  const setDisplayCurrency = useCallback((code: string) => {
    const next = code.toUpperCase();
    if (!isSupportedDisplayCurrency(next)) return;
    setDisplayCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { displayCurrency, setDisplayCurrency };
};
