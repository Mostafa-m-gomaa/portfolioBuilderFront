import { apiClient } from "@/api/axios";
import type {
  SubscriptionMeSummaryResponse,
  SubscriptionRecord,
} from "@/types/subscription.types";

export const subscriptionsService = {
  async getMeSummary(): Promise<SubscriptionMeSummaryResponse> {
    const response = await apiClient.get<SubscriptionMeSummaryResponse>(
      "/subscriptions/me/summary",
    );
    return response.data;
  },

  async startFreeTrial(): Promise<SubscriptionRecord> {
    const response = await apiClient.post<SubscriptionRecord>(
      "/subscriptions/free-trial",
      {},
    );
    return response.data;
  },
};
