import type { LocalizedString } from "@/types/package.types";

export type SubscriptionRecord = {
  _id: string;
  userId?: string;
  packageId?: string | null;
  status?: string;
  startedFreeTrial?: boolean;
  startDate?: string;
  endDate?: string;
  cancelledAt?: string | null;
  history?: Array<{ status?: string; date?: string }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

/** Populated package on GET /subscriptions/me/summary */
export type SubscriptionPackageSummary = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  priceEgp: number;
  priceUsd: number;
  features: LocalizedString[];
  durationMonths: number;
  /** Present only if the API includes the amount actually charged */
  price?: number;
  currency?: string;
};

export type SubscriptionDetailSummary = {
  id: string;
  status: string;
  startedFreeTrial: boolean;
  startDate: string;
  endDate: string;
  remainingDays: number;
  isExpired: boolean;
  package: SubscriptionPackageSummary;
};

/** GET /subscriptions/me/summary */
export type SubscriptionMeSummaryResponse = {
  subscriptionStatus: string;
  hasActiveSubscription: boolean;
  subscription: SubscriptionDetailSummary | null;
  now: string;
};
