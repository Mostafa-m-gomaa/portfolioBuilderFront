/** Request body for POST /payments/checkout */
export type PaymentCheckoutRequest = {
  packageId: string;
  /** When set, server validates coupon and charges `finalPrice` from apply logic */
  couponName?: string;
};

/** Response from POST /payments/checkout (Paymob unified checkout). */
export type PaymentCheckoutResponse = {
  paymentOrderId?: string;
  specialReference?: string;
  checkoutUrl: string;
  clientSecret?: string;
};
