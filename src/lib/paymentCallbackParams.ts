/** Paymob / gateway redirect: ?paymentStatus=SUCCESS|FAILED&... */
export const isPaymentSuccessStatus = (status: string | null | undefined) => {
  if (!status?.trim()) return false;
  const normalized = status.trim().toUpperCase();
  return (
    normalized === "SUCCESS" ||
    normalized === "SUCCESSFUL" ||
    normalized === "PAID" ||
    normalized === "COMPLETED"
  );
};

const PAYMENT_RESULT_PARAM_KEYS = [
  "merchantOrderId",
  "merchant_order_id",
  "orderId",
  "order_id",
  "payment_order_id",
  "transactionId",
  "orderReference",
  "specialReference",
  "special_reference",
  "amount",
  "currency",
  "cardBrand",
  "maskedCard",
  "mode",
] as const;

/** Keeps useful ids on the success/failure page URL (drops paymentStatus & sensitive tokens). */
export const buildPaymentResultSearch = (source: URLSearchParams) => {
  const next = new URLSearchParams();
  for (const key of PAYMENT_RESULT_PARAM_KEYS) {
    const value = source.get(key);
    if (value) next.set(key, value);
  }
  return next;
};

/**
 * When the gateway returns to `/?paymentStatus=...`, map to our result routes.
 * Returns null if `paymentStatus` is absent.
 */
export const getPaymentRedirectPath = (params: URLSearchParams): string | null => {
  const status = params.get("paymentStatus");
  if (!status) return null;

  const base = isPaymentSuccessStatus(status) ? "/payment/success" : "/payment/failure";
  const preserved = buildPaymentResultSearch(params);
  const qs = preserved.toString();
  return qs ? `${base}?${qs}` : base;
};

/** Common query keys from Paymob / backend redirects. */
export const getPaymentReferenceFromSearch = (params: URLSearchParams) =>
  params.get("merchantOrderId") ||
  params.get("merchant_order_id") ||
  params.get("orderId") ||
  params.get("order_id") ||
  params.get("transactionId") ||
  params.get("payment_order_id") ||
  params.get("orderReference") ||
  params.get("special_reference") ||
  params.get("specialReference") ||
  params.get("id") ||
  null;
