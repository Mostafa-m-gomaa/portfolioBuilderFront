import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, Tag, X } from "lucide-react";
import { TOKEN_STORAGE_KEY, parseApiError } from "@/api/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/store/auth.store";
import { startPackageCheckout } from "@/lib/startPackageCheckout";
import { normalizeCheckoutCurrency } from "@/lib/resolveCheckoutPrice";
import { couponsService } from "@/services/coupons.service";
import { formatPackagePrice } from "@/lib/packageDisplay";
import { cn } from "@/lib/utils";
import type { ApplyCouponResponse } from "@/types/coupon.types";

type Props = {
  packageId: string;
  /**
   * When true (and user is logged in), show promo field + POST /coupons/apply.
   * Keep false on marketing grids so cards stay compact.
   */
  couponEnabled?: boolean;
  /** Package list price in API currency — same value sent to POST /coupons/apply. */
  packagePrice?: number;
  packageCurrency?: string;
  /** EGP | USD — same as the currency `<select>` on the page. */
  selectedDisplayCurrency: string;
  /** Extra classes on the outer stack when coupon UI is shown (e.g. `flex-1`). */
  stackClassName?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Logged-in users: Paymob checkout. Optional promo (`couponEnabled` + price/currency) calls POST /coupons/apply first.
 * Guests: signup with packageId preserved for post-auth checkout.
 */
const SubscribePackageCta = ({
  packageId,
  couponEnabled = false,
  packagePrice,
  packageCurrency,
  selectedDisplayCurrency,
  stackClassName,
  className,
  children,
}: Props) => {
  const { t, lang } = useLanguage();
  const { token: storeToken, isAuthenticated } = useAuthStore(
    useShallow((s) => ({ token: s.token, isAuthenticated: s.isAuthenticated })),
  );
  const lsToken =
    typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_STORAGE_KEY)
      : null;
  const hasSession = Boolean(
    storeToken || isAuthenticated || (lsToken && lsToken.length > 0),
  );
  const [pending, setPending] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState<ApplyCouponResponse | null>(null);

  const showCoupon =
    couponEnabled &&
    hasSession &&
    typeof packagePrice === "number" &&
    packagePrice > 0;

  const applyMutation = useMutation({
    mutationFn: () =>
      couponsService.apply({
        couponName: couponInput.trim(),
        price: packagePrice!,
      }),
    onSuccess: (data) => {
      setApplied(data);
    },
  });

  if (!hasSession) {
    return (
      <Link
        to={`/signup?packageId=${encodeURIComponent(packageId)}`}
        className={className}
      >
        {children ?? t("pricing.cta")}
      </Link>
    );
  }

  const basisCurrency = (packageCurrency?.trim() || "EGP").toUpperCase();

  const checkoutButton = (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={async () => {
        setPending(true);
        try {
          const nameFromApply =
            applied &&
              typeof applied.coupon?.name === "string" &&
              applied.coupon.name
              ? applied.coupon.name
              : couponInput.trim();
          const basePrice =
            applied?.finalPrice ??
            (typeof packagePrice === "number" ? packagePrice : undefined);
          await startPackageCheckout(
            packageId,
            t("payment.checkoutError"),
            {
              checkoutCurrency: normalizeCheckoutCurrency(
                selectedDisplayCurrency,
              ),
              ...(typeof basePrice === "number" ? { price: basePrice } : {}),
              ...(applied
                ? { couponName: nameFromApply || couponInput.trim() }
                : {}),
            },
          );
        } finally {
          setPending(false);
        }
      }}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {t("payment.redirecting")}
        </span>
      ) : (
        (children ?? t("payment.subscribe"))
      )}
    </button>
  );

  if (!showCoupon) {
    return checkoutButton;
  }

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-3", stackClassName)}>
      <div className="rounded-xl border border-border bg-muted/20 p-3 text-start text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tag className="h-4 w-4 shrink-0" aria-hidden />
          <span className="font-medium text-foreground">
            {t("payment.coupon.sectionTitle")}
          </span>
        </div>
        {!applied ? (
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                applyMutation.reset();
              }}
              placeholder={t("payment.coupon.placeholder")}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              disabled={
                applyMutation.isPending || !couponInput.trim()
              }
              onClick={() => applyMutation.mutate()}
              className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 font-medium text-foreground hover:bg-muted/60 disabled:opacity-50"
            >
              {applyMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("payment.coupon.applying")}
                </span>
              ) : (
                t("payment.coupon.apply")
              )}
            </button>
          </div>
        ) : (
          <div className="mt-2 space-y-1 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-foreground">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t("payment.coupon.appliedBadge")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setApplied(null);
                  setCouponInput("");
                  applyMutation.reset();
                }}
                className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label={t("payment.coupon.remove")}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("payment.coupon.original")}:{" "}
              {formatPackagePrice(applied.originalPrice, basisCurrency, lang)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("payment.coupon.discount")}: −
              {formatPackagePrice(applied.discountAmount, basisCurrency, lang)}
            </p>
            <p className="text-sm font-semibold">
              {t("payment.coupon.final")}:{" "}
              {formatPackagePrice(applied.finalPrice, basisCurrency, lang)}
            </p>
          </div>
        )}
        {applyMutation.isError ? (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {parseApiError(
              applyMutation.error,
              t("payment.coupon.applyError"),
            )}
          </p>
        ) : null}
      </div>
      {checkoutButton}
    </div>
  );
};

export default SubscribePackageCta;
