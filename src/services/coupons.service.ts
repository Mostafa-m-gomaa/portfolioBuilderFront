import { apiClient } from "@/api/axios";
import type { ApplyCouponResponse } from "@/types/coupon.types";

export const couponsService = {
  async apply(payload: {
    couponName: string;
    price: number;
  }): Promise<ApplyCouponResponse> {
    const response = await apiClient.post<ApplyCouponResponse>(
      "/coupons/apply",
      payload,
    );
    return response.data;
  },
};
