export type PaymentCheckoutCurrency = "EGP" | "USD";

/** Request body for POST /payments/checkout */
export type PaymentCheckoutRequest = {
  packageId: string;
  price: number;
  currency: PaymentCheckoutCurrency;
  couponName?: string;
};

/** Response from POST /payments/checkout (Paymob unified checkout). */
export type PaymentCheckoutResponse = {
  paymentOrderId?: string;
  specialReference?: string;
  checkoutUrl: string;
  clientSecret?: string;
};
