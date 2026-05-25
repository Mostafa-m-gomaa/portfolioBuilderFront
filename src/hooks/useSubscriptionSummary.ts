import { useQuery } from "@tanstack/react-query";
import { normalizeSubscriptionSummary } from "@/lib/normalizeSubscriptionSummary";
import { applySubscriptionSummaryToAuth } from "@/lib/syncSubscriptionAuth";
import { subscriptionsService } from "@/services/subscriptions.service";
import { useAuthStore } from "@/store/auth.store";

/** Fetches GET /subscriptions/me/summary and syncs `user.subscriptionStatus` when it differs from the API. */
export const useSubscriptionSummary = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["subscription-summary"],
    queryFn: async () => {
      const raw = await subscriptionsService.getMeSummary();
      const data = normalizeSubscriptionSummary(raw);
      applySubscriptionSummaryToAuth(data);
      return data;
    },
    enabled: Boolean(token),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};
