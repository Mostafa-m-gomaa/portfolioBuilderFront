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

export type SubscriptionPackageSummary = {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationMonths: number;
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
