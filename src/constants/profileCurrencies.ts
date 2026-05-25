/** Profile preference currency (saved on user) — separate from package pricing (EGP/USD). */
export const PROFILE_CURRENCY_OPTIONS = [
  "USD",
  "EUR",
  "GBP",
  "SAR",
  "AED",
  "EGP",
  "KWD",
  "QAR",
] as const;

export type ProfileCurrencyCode = (typeof PROFILE_CURRENCY_OPTIONS)[number];

export const isProfileCurrencyCode = (code: string): code is ProfileCurrencyCode =>
  (PROFILE_CURRENCY_OPTIONS as readonly string[]).includes(code);

export const defaultProfileCurrency = (): ProfileCurrencyCode => "USD";
