import type { Package } from "@/types/package.types";
import { convertPackagePriceToDisplayCurrency } from "@/lib/pricingDisplayCurrencies";
import { toLatinDigits } from "@/lib/latinDigits";

type Lang = "ar" | "en";

/** Western digits (0–9) regardless of UI language */
const formatLatinNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  toLatinDigits(
    value.toLocaleString("en-US", { numberingSystem: "latn", ...options }),
  );

export const formatPackagePrice = (
  price: number,
  currency: string,
  _lang: Lang,
) => {
  const code = (currency || "SAR").toUpperCase();
  try {
    // Always use a Latin locale so digits stay 0–9 (ar-SA can still render Eastern numerals in some engines).
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

/** Formats API price converted into the visitor’s chosen display currency when supported. */
export const formatConvertedPackagePrice = (
  price: number,
  packageCurrency: string,
  displayCurrencyCode: string,
  lang: Lang,
) => {
  const from = (packageCurrency || "SAR").toUpperCase();
  const to = displayCurrencyCode.toUpperCase();
  const converted = convertPackagePriceToDisplayCurrency(price, from, to);
  if (converted == null) {
    return formatPackagePrice(price, packageCurrency, lang);
  }
  return formatPackagePrice(converted, to, lang);
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
