import { toast } from "sonner";
import { fetchPackageById } from "@/api/packages";
import { parseApiError } from "@/api/axios";
import { getPackagePrice } from "@/lib/packageDisplay";
import {
  buildCheckoutCharge,
  normalizeCheckoutCurrency,
} from "@/lib/resolveCheckoutPrice";
import { isSupportedDisplayCurrency } from "@/lib/pricingDisplayCurrencies";
import { getStoredDisplayCurrency } from "@/lib/pricingDisplayCurrencyStorage";
import { paymentsService } from "@/services/payments.service";
import type { PaymentCheckoutCurrency } from "@/types/payment.types";

export type StartPackageCheckoutOptions = {
  couponName?: string;
  /** Price in the selected checkout currency (from priceEgp / priceUsd or coupon apply). */
  price?: number;
  checkoutCurrency?: PaymentCheckoutCurrency | string;
};

/**
 * Starts Paymob checkout. Sends `currency` and `price` from API priceEgp / priceUsd.
 */
export async function startPackageCheckout(
  packageId: string,
  fallbackError = "Could not start payment",
  options?: StartPackageCheckoutOptions,
): Promise<boolean> {
  try {
    const explicit = options?.checkoutCurrency?.trim();
    const checkoutCurrency: PaymentCheckoutCurrency =
      explicit && isSupportedDisplayCurrency(explicit)
        ? normalizeCheckoutCurrency(explicit)
        : normalizeCheckoutCurrency(getStoredDisplayCurrency());

    let price = options?.price;
    if (typeof price !== "number" || !Number.isFinite(price)) {
      const pkg = await fetchPackageById(packageId);
      price = getPackagePrice(pkg, checkoutCurrency).price;
    }

    const { price: chargePrice, currency } = buildCheckoutCharge(
      price,
      checkoutCurrency,
    );

    const data = await paymentsService.createCheckout({
      packageId: String(packageId).trim(),
      price: chargePrice,
      currency,
      ...(options?.couponName?.trim()
        ? { couponName: options.couponName.trim() }
        : {}),
    });

    if (data.checkoutUrl) {
      window.location.assign(data.checkoutUrl);
      return true;
    }

    toast.error(fallbackError);
    return false;
  } catch (error: unknown) {
    toast.error(parseApiError(error, fallbackError));
    return false;
  }
}
