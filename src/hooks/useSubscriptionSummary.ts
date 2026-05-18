import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { subscriptionsService } from "@/services/subscriptions.service";
import { useAuthStore } from "@/store/auth.store";

/** Fetches GET /subscriptions/me/summary and syncs `user.subscriptionStatus` when it differs from the API. */
export const useSubscriptionSummary = () => {
  const token = useAuthStore((s) => s.token);

  const query = useQuery({
    queryKey: ["subscription-summary"],
    queryFn: () => subscriptionsService.getMeSummary(),
    enabled: Boolean(token),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const data = query.data;
    if (!data) return;
    const u = useAuthStore.getState().user;
    if (!u) return;
    if (u.subscriptionStatus !== data.subscriptionStatus) {
      useAuthStore.getState().setAuth({
        user: { ...u, subscriptionStatus: data.subscriptionStatus },
      });
    }
  }, [query.data]);

  return query;
};
