import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  getStoredDisplayCurrency,
  persistDisplayCurrency,
  subscribeDisplayCurrency,
} from "@/lib/pricingDisplayCurrencyStorage";
import { isSupportedDisplayCurrency } from "@/lib/pricingDisplayCurrencies";

export { getStoredDisplayCurrency } from "@/lib/pricingDisplayCurrencyStorage";

export const useDisplayCurrency = () => {
  const storedCurrency = useSyncExternalStore(
    subscribeDisplayCurrency,
    getStoredDisplayCurrency,
    () => "EGP",
  );
  const [displayCurrency, setDisplayCurrencyState] = useState(storedCurrency);

  useEffect(() => {
    setDisplayCurrencyState(storedCurrency);
  }, [storedCurrency]);

  const setDisplayCurrency = useCallback((code: string) => {
    const next = code.trim().toUpperCase();
    if (!isSupportedDisplayCurrency(next)) return;
    if (persistDisplayCurrency(next)) {
      setDisplayCurrencyState(next);
    }
  }, []);

  return { displayCurrency, setDisplayCurrency };
};
