import { useAuthStore } from "@/store/auth.store";
import type { SubscriptionMeSummaryResponse } from "@/types/subscription.types";

/** Keeps `user.subscriptionStatus` in sync with GET /subscriptions/me/summary (e.g. after Paymob). */
export const applySubscriptionSummaryToAuth = (
  summary: SubscriptionMeSummaryResponse | null | undefined,
) => {
  if (!summary?.subscriptionStatus) return;
  const u = useAuthStore.getState().user;
  if (!u || u.subscriptionStatus === summary.subscriptionStatus) return;
  useAuthStore.getState().setAuth({
    user: { ...u, subscriptionStatus: summary.subscriptionStatus },
  });
};
