import { toast } from "sonner";
import { parseApiError } from "@/api/axios";
import { paymentsService } from "@/services/payments.service";

export type StartPackageCheckoutOptions = {
  couponName?: string;
};

/**
 * Starts Paymob checkout for a package. On success, redirects the browser to `checkoutUrl`.
 * @returns true if redirect was triggered, false otherwise
 */
export async function startPackageCheckout(
  packageId: string,
  fallbackError = "Could not start payment",
  options?: StartPackageCheckoutOptions,
): Promise<boolean> {
  try {
    const data = await paymentsService.createCheckout({
      packageId,
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
