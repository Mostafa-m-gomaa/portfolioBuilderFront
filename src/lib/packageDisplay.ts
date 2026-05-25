import type { Lang } from "@/contexts/LanguageContext";
import type { LocalizedString, Package } from "@/types/package.types";
import type { PaymentCheckoutCurrency } from "@/types/payment.types";
import { displayLocalized } from "@/lib/displayLocalized";
import { toLatinDigits } from "@/lib/latinDigits";

/** Western digits (0–9) regardless of UI language */
const formatLatinNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  toLatinDigits(
    value.toLocaleString("en-US", { numberingSystem: "latn", ...options }),
  );

/** Always returns a string safe to render in React (never `{ ar, en }`). */
export const toDisplayText = (value: unknown, lang: Lang): string =>
  displayLocalized(value, lang);

export const pickLocalized = (
  value: LocalizedString | string | unknown,
  lang: Lang,
): string => displayLocalized(value, lang);

export const packageName = (pkg: Pick<Package, "name">, lang: Lang) =>
  pickLocalized(pkg.name, lang);

export const packageDescription = (pkg: Pick<Package, "description">, lang: Lang) =>
  pickLocalized(pkg.description, lang);

export const packageFeatureText = (feature: LocalizedString, lang: Lang) =>
  pickLocalized(feature, lang);

/** Price and currency from API fields (no conversion). */
export const getPackagePrice = (
  pkg: Pick<Package, "priceEgp" | "priceUsd">,
  displayCurrency: string,
): { price: number; currency: PaymentCheckoutCurrency } => {
  const code = displayCurrency.trim().toUpperCase();
  if (code === "USD") {
    return { price: pkg.priceUsd, currency: "USD" };
  }
  return { price: pkg.priceEgp, currency: "EGP" };
};

export const formatPackagePrice = (
  price: number,
  currency: string,
  _lang: Lang,
) => {
  const code = (currency || "EGP").toUpperCase();
  try {
    return toLatinDigits(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2,
      }).format(price),
    );
  } catch {
    return toLatinDigits(
      `${formatLatinNumber(price, { maximumFractionDigits: 2 })} ${code}`,
    );
  }
};

/** Formats package price for the visitor’s chosen display currency. */
export const formatPackageDisplayPrice = (
  pkg: Pick<Package, "priceEgp" | "priceUsd">,
  displayCurrencyCode: string,
  lang: Lang,
) => {
  const { price, currency } = getPackagePrice(pkg, displayCurrencyCode);
  return formatPackagePrice(price, currency, lang);
};

const coerceCurrencyCode = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return value.trim().toUpperCase();
  }
  return null;
};

/** Subscription summary: charged amount if API sends it, else priceEgp / priceUsd. */
export const formatSubscriptionPackagePrice = (
  pkg: Pick<Package, "priceEgp" | "priceUsd"> & {
    price?: number;
    currency?: unknown;
  },
  lang: Lang,
  displayCurrency = "EGP",
) => {
  const chargedCurrency = coerceCurrencyCode(pkg.currency);
  if (typeof pkg.price === "number" && chargedCurrency) {
    return formatPackagePrice(pkg.price, chargedCurrency, lang);
  }
  const { price, currency } = getPackagePrice(pkg, displayCurrency);
  return formatPackagePrice(price, currency, lang);
};

export const formatDurationMonths = (months: number, lang: Lang) => {
  const n = formatLatinNumber(months, { maximumFractionDigits: 0 });
  if (lang === "ar") {
    if (months === 1) return "شهر واحد";
    if (months === 2) return "شهران";
    return toLatinDigits(`${n} أشهر`);
  }
  return toLatinDigits(`${n} month${months === 1 ? "" : "s"}`);
};

export const sortPackagesByOrder = (list: Package[]) =>
  [...list].sort((a, b) => a.sortOrder - b.sortOrder);

/** Yearly plan (12 months) — highlighted layout in pricing UI */
export const isTwelveMonthPopularPlan = (pkg: Package) =>
  pkg.durationMonths === 12;

/**
 * After sortOrder, moves the 12‑month package to the middle of the list so it
 * sits in the center column when shown in a 3‑column row.
 */
export const reorderTwelveMonthToCenter = (list: Package[]): Package[] => {
  const base = sortPackagesByOrder(list);
  const popIdx = base.findIndex(isTwelveMonthPopularPlan);
  if (popIdx < 0) return base;

  const popular = base[popIdx]!;
  const others = base.filter((_, i) => i !== popIdx);
  const n = others.length;
  const insertAt = Math.floor(n / 2);
  const result = [...others];
  result.splice(insertAt, 0, popular);
  return result;
};
