/**
 * Legacy display rates from the old static pricing UI: treat amounts as convertible
 * via an EGP pivot (multiply EGP by `fromEgpRate` to get that currency).
 */
export type DisplayCurrencyOption = {
  code: string;
  symbol: string;
  /** EGP → this currency: amountInThis = amountEgp * fromEgpRate */
  fromEgpRate: number;
  labelAr: string;
  labelEn: string;
};

export const DISPLAY_CURRENCY_OPTIONS: DisplayCurrencyOption[] = [
  { code: "EGP", symbol: "E£", fromEgpRate: 1, labelAr: "الجنيه المصري", labelEn: "Egyptian pound" },
  { code: "SAR", symbol: "ر.س", fromEgpRate: 0.075, labelAr: "الريال السعودي", labelEn: "Saudi riyal" },
  { code: "USD", symbol: "$", fromEgpRate: 0.021, labelAr: "الدولار الأمريكي", labelEn: "US dollar" },
  { code: "AED", symbol: "د.إ", fromEgpRate: 0.077, labelAr: "الدرهم الإماراتي", labelEn: "UAE dirham" },
  { code: "KWD", symbol: "د.ك", fromEgpRate: 0.0064, labelAr: "الدينار الكويتي", labelEn: "Kuwaiti dinar" },
  { code: "BHD", symbol: "د.ب", fromEgpRate: 0.0079, labelAr: "الدينار البحريني", labelEn: "Bahraini dinar" },
  { code: "JOD", symbol: "د.أ", fromEgpRate: 0.015, labelAr: "الدينار الأردني", labelEn: "Jordanian dinar" },
];

const RATE_BY_CODE: Record<string, number> = Object.fromEntries(
  DISPLAY_CURRENCY_OPTIONS.map((c) => [c.code, c.fromEgpRate]),
);

export const isSupportedDisplayCurrency = (code: string) =>
  Boolean(RATE_BY_CODE[code.toUpperCase()]);

/**
 * Convert `amount` expressed in `fromCurrency` into `toCurrency` using the EGP pivot.
 * Returns null if either currency is outside the supported display set.
 */
export const convertPackagePriceToDisplayCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number | null => {
  const from = (fromCurrency || "SAR").toUpperCase();
  const to = (toCurrency || "EGP").toUpperCase();
  const rFrom = RATE_BY_CODE[from];
  const rTo = RATE_BY_CODE[to];
  if (rFrom == null || rTo == null || !Number.isFinite(amount)) return null;
  const egp = amount / rFrom;
  return egp * rTo;
};
