import type { LocalizedString } from "@/types/package.types";
import type {
  SubscriptionMeSummaryResponse,
  SubscriptionPackageSummary,
} from "@/types/subscription.types";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const asLocalized = (v: unknown): LocalizedString => {
  if (isRecord(v) && ("ar" in v || "en" in v)) {
    return {
      ar: typeof v.ar === "string" ? v.ar : "",
      en: typeof v.en === "string" ? v.en : "",
    };
  }
  if (typeof v === "string") {
    return { ar: v, en: v };
  }
  return { ar: "", en: "" };
};

const asLocalizedList = (v: unknown): LocalizedString[] => {
  if (!Array.isArray(v)) return [];
  return v.map((item) => asLocalized(item));
};

const normalizePackage = (raw: unknown): SubscriptionPackageSummary | null => {
  if (!isRecord(raw)) return null;
  return {
    id: String(raw.id ?? raw._id ?? ""),
    name: asLocalized(raw.name),
    description: asLocalized(raw.description),
    priceEgp: Number(raw.priceEgp ?? 0),
    priceUsd: Number(raw.priceUsd ?? 0),
    features: asLocalizedList(raw.features),
    durationMonths: Number(raw.durationMonths ?? 0),
    ...(typeof raw.price === "number" ? { price: raw.price } : {}),
    ...(typeof raw.currency === "string" ? { currency: raw.currency } : {}),
  };
};

/** Maps GET /subscriptions/me/summary to a stable shape for the UI. */
export const normalizeSubscriptionSummary = (
  data: SubscriptionMeSummaryResponse,
): SubscriptionMeSummaryResponse => {
  if (!data.subscription?.package) return data;
  const pkg = normalizePackage(data.subscription.package);
  if (!pkg) return data;
  return {
    ...data,
    subscription: {
      ...data.subscription,
      package: pkg,
    },
  };
};
