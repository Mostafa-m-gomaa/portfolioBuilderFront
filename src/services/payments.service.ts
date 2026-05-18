import { apiClient } from "@/api/axios";
import type {
  PaymentCheckoutRequest,
  PaymentCheckoutResponse,
} from "@/types/payment.types";

export const paymentsService = {
  async createCheckout(
    payload: PaymentCheckoutRequest,
  ): Promise<PaymentCheckoutResponse> {
    const response = await apiClient.post<PaymentCheckoutResponse>(
      "/payments/checkout",
      payload,
    );
    return response.data;
  },
};
