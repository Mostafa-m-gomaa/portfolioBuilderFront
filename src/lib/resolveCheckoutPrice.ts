import type { PaymentCheckoutCurrency } from "@/types/payment.types";

/** Checkout is always charged in EGP regardless of display currency. */
export const PAYMENT_CHECKOUT_CURRENCY: PaymentCheckoutCurrency = "EGP";

/** Coerce any hint to EGP | USD (display / formatting only). */
export const normalizeCheckoutCurrency = (
  code: string | undefined | null,
): PaymentCheckoutCurrency => {
  const normalized = String(code ?? "").trim().toUpperCase();
  return normalized === "USD" ? "USD" : "EGP";
};

/** Currency for POST /payments/checkout — always EGP. */
export const resolvePaymentCheckoutCurrency = (): PaymentCheckoutCurrency =>
  PAYMENT_CHECKOUT_CURRENCY;

/** Amount must be in EGP (from priceEgp or coupon apply on EGP price). */
export const buildCheckoutCharge = (amount: number) => {
  const currency = PAYMENT_CHECKOUT_CURRENCY;
  const price = Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0;
  return { price, currency };
};
