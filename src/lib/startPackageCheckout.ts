import { toast } from "sonner";
import { fetchPackageById } from "@/api/packages";
import { parseApiError } from "@/api/axios";
import { getPackagePrice } from "@/lib/packageDisplay";
import {
  buildCheckoutCharge,
  PAYMENT_CHECKOUT_CURRENCY,
} from "@/lib/resolveCheckoutPrice";
import { storePendingPurchase } from "@/lib/metaPixel";
import { clearPendingSubscriptionChoice } from "@/lib/authRouting";
import { paymentsService } from "@/services/payments.service";

export type StartPackageCheckoutOptions = {
  couponName?: string;
  /** Price in EGP (from priceEgp or coupon apply). */
  price?: number;
};

/**
 * Starts Paymob checkout. Always sends `currency: EGP` and `price` from priceEgp.
 */
export async function startPackageCheckout(
  packageId: string,
  fallbackError = "Could not start payment",
  options?: StartPackageCheckoutOptions,
): Promise<boolean> {
  try {
    clearPendingSubscriptionChoice();
    let price = options?.price;
    if (typeof price !== "number" || !Number.isFinite(price)) {
      const pkg = await fetchPackageById(packageId);
      price = getPackagePrice(pkg, PAYMENT_CHECKOUT_CURRENCY).price;
    }

    const { price: chargePrice, currency } = buildCheckoutCharge(price);

    const data = await paymentsService.createCheckout({
      packageId: String(packageId).trim(),
      price: chargePrice,
      currency,
      ...(options?.couponName?.trim()
        ? { couponName: options.couponName.trim() }
        : {}),
    });

    if (data.checkoutUrl) {
      storePendingPurchase(chargePrice, currency);
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
