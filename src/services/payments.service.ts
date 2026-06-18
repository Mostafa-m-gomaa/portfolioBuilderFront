import { apiClient } from "@/api/axios";
import type {
  PaymentCheckoutCurrency,
  PaymentCheckoutRequest,
  PaymentCheckoutResponse,
} from "@/types/payment.types";

/** Checkout is always EGP for express-validator on the API. */
export const toPaymentCheckoutCurrency = (): PaymentCheckoutCurrency => "EGP";

export const paymentsService = {
  async createCheckout(
    payload: PaymentCheckoutRequest,
  ): Promise<PaymentCheckoutResponse> {
    const price = Math.round(Number(payload.price) * 100) / 100;
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Invalid checkout price");
    }

    const body: PaymentCheckoutRequest = {
      packageId: String(payload.packageId ?? "").trim(),
      price,
      currency: toPaymentCheckoutCurrency(),
    };
    const coupon = payload.couponName?.trim();
    if (coupon) body.couponName = coupon;

    const response = await apiClient.post<PaymentCheckoutResponse>(
      "/payments/checkout",
      body,
    );
    return response.data;
  },
};
