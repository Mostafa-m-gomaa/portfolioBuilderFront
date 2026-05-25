import { isSupportedDisplayCurrency } from "@/lib/pricingDisplayCurrencies";
import { getStoredDisplayCurrency } from "@/lib/pricingDisplayCurrencyStorage";
import type { PaymentCheckoutCurrency } from "@/types/payment.types";

/** Coerce any hint to EGP | USD (never empty — required by POST /payments/checkout). */
export const normalizeCheckoutCurrency = (
  code: string | undefined | null,
): PaymentCheckoutCurrency => {
  const normalized = String(code ?? "").trim().toUpperCase();
  return normalized === "USD" ? "USD" : "EGP";
};

/**
 * Currency for POST /payments/checkout.
 * Uses the page’s selected display currency (same as shown prices), else localStorage.
 */
export const resolvePaymentCheckoutCurrency = (
  pageSelection?: string | null,
): PaymentCheckoutCurrency => {
  const fromPage = pageSelection?.trim();
  if (fromPage && isSupportedDisplayCurrency(fromPage)) {
    return normalizeCheckoutCurrency(fromPage);
  }
  return normalizeCheckoutCurrency(getStoredDisplayCurrency());
};

/** Amount is already in the checkout currency (from priceEgp / priceUsd). */
export const buildCheckoutCharge = (
  amount: number,
  pageSelection?: string | null,
) => {
  const currency = resolvePaymentCheckoutCurrency(pageSelection);
  const price = Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
  return { price, currency };
};
