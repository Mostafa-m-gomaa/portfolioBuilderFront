/** Response from POST /coupons/apply */
export type ApplyCouponResponse = {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  coupon: Record<string, unknown> & { _id?: string; name?: string };
};
