import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { subscriptionsService } from "@/services/subscriptions.service";
import type { SubscriptionMeSummaryResponse } from "@/types/subscription.types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isSubscriptionActivated = (
  summary: SubscriptionMeSummaryResponse | null | undefined,
) => Boolean(summary?.hasActiveSubscription && summary.subscription);

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

const cacheSubscriptionSummary = (
  queryClient: QueryClient,
  summary: SubscriptionMeSummaryResponse,
) => {
  queryClient.setQueryData(["subscription-summary"], summary);
  applySubscriptionSummaryToAuth(summary);
};

/**
 * Paymob webhooks can lag behind the browser redirect — poll until the subscription
 * is active (or attempts exhausted) so the user does not need to log out/in.
 */
export const pollSubscriptionSummaryAfterPayment = async (
  queryClient: QueryClient,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<SubscriptionMeSummaryResponse | null> => {
  const maxAttempts = options?.maxAttempts ?? 10;
  const intervalMs = options?.intervalMs ?? 2000;

  let lastSummary: SubscriptionMeSummaryResponse | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const summary = await subscriptionsService.getMeSummary();
      lastSummary = summary;
      cacheSubscriptionSummary(queryClient, summary);

      if (isSubscriptionActivated(summary)) {
        return summary;
      }
    } catch {
      /* keep polling — gateway may return before webhook finishes */
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  return lastSummary;
};
