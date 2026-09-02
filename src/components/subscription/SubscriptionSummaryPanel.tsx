import { Link } from "react-router-dom";
import { Loader2, CreditCard, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDisplayCurrency } from "@/hooks/useDisplayCurrency";
import { useSubscriptionSummary } from "@/hooks/useSubscriptionSummary";
import { displayLocalized } from "@/lib/displayLocalized";
import {
  formatDurationMonths,
  formatSubscriptionPackagePrice,
} from "@/lib/packageDisplay";
import { toLatinDigits } from "@/lib/latinDigits";
import { primaryButtonCompactClass } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";

type Lang = "ar" | "en";

type SubscriptionSummaryPanelProps = {
  className?: string;
  compact?: boolean;
};

const formatSummaryDate = (iso: string, _lang: Lang) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return toLatinDigits(iso);
  return toLatinDigits(
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  );
};

const formatDays = (n: number) => toLatinDigits(String(n));

const isFreePlanStatus = (status: string) =>
  status === "FREE_TRIAL" || status === "FREE";

const subscriptionStatusLabel = (
  status: unknown,
  lang: Lang,
  t: (key: string) => string,
) => {
  const code =
    typeof status === "string"
      ? status
      : displayLocalized(status, lang).toUpperCase();
  if (!code) return "";
  const key = `subscription.status.${code}`;
  const label = t(key);
  return label === key ? code : label;
};

/**
 * Dashboard / profile: current plan, trial, or inactive state from GET /subscriptions/me/summary.
 */
const SubscriptionSummaryPanel = ({
  className,
  compact = false,
}: SubscriptionSummaryPanelProps) => {
  const { t, lang } = useLanguage();
  const { displayCurrency } = useDisplayCurrency();
  const { data, isLoading, isError } = useSubscriptionSummary();

  const rootClass = (extra: string) =>
    cn(
      compact ? "glass-strong rounded-3xl p-4 h-auto" : "mb-8 rounded-2xl p-5",
      extra,
      className,
    );

  const iconClass = compact ? "h-5 w-5" : "h-6 w-6";
  const titleClass = compact
    ? "font-heading text-base font-semibold"
    : "font-heading text-lg font-semibold";
  const packageTitleClass = compact
    ? "mt-0.5 font-heading text-lg font-bold"
    : "mt-1 font-heading text-xl font-bold";
  const detailClass = compact
    ? "mt-1 text-xs text-muted-foreground"
    : "mt-2 text-sm text-muted-foreground";
  const detailClassTight = compact
    ? "mt-0.5 text-xs text-muted-foreground"
    : "mt-1 text-sm text-muted-foreground";

  if (isLoading) {
    return (
      <div
        className={rootClass(
          "flex items-center gap-2 border border-border bg-card/50 text-sm text-muted-foreground",
        )}
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
        {t("subscription.summary.loading")}
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  if (isFreePlanStatus(data.subscriptionStatus)) {
    const sub = data.subscription;
    return (
      <div
        className={rootClass(
          "border border-sky-500/40 bg-sky-500/10 dark:bg-sky-950/20",
        )}
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <Sparkles
              className={cn("mt-0.5 shrink-0 text-sky-600 dark:text-sky-400", iconClass)}
            />
            <div className="min-w-0">
              <p className={cn(titleClass, "text-foreground")}>
                {t("subscription.summary.trialTitle")}
              </p>
              {sub ? (
                <>
                  <p className={detailClass}>
                    {t("subscription.summary.trialEnds")}{" "}
                    <span className="font-medium text-foreground">
                      {formatSummaryDate(sub.endDate, lang)}
                    </span>
                  </p>
                  <p className={detailClassTight}>
                    {t("subscription.summary.daysLeft")}{" "}
                    <span className="font-medium text-foreground">
                      {formatDays(sub.remainingDays)}
                    </span>
                  </p>
                </>
              ) : (
                <p className={detailClass}>
                  {subscriptionStatusLabel(data.subscriptionStatus, lang, t)}
                </p>
              )}
            </div>
          </div>
          <Link
            to="/pricing"
            className={cn(
              primaryButtonCompactClass,
              "shrink-0 text-center sm:min-w-[9rem]",
            )}
          >
            {t("subscription.summary.subscribeNow")}
          </Link>
        </div>
      </div>
    );
  }

  if (data.hasActiveSubscription && data.subscription?.package) {
    const sub = data.subscription;
    const pkg = sub.package;
    const planTitle = displayLocalized(pkg.name, lang);
    const planDescription = displayLocalized(pkg.description, lang);

    return (
      <div
        className={rootClass(
          "border border-primary/35 bg-primary/5 shadow-sm dark:bg-primary/10",
        )}
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 items-start gap-3">
            <CreditCard
              className={cn("mt-0.5 shrink-0 text-primary", iconClass)}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
                {t("subscription.summary.activeBadge")}
              </p>
              <h2 className={cn(packageTitleClass, "text-foreground")}>
                {planTitle}
              </h2>
              {planDescription ? (
                <p className={detailClassTight}>{planDescription}</p>
              ) : null}
              <p className={detailClassTight}>
                {t("subscription.summary.status")}:{" "}
                <span className="font-medium text-foreground">
                  {subscriptionStatusLabel(data.subscriptionStatus, lang, t)}
                </span>
              </p>
              <p
                className={
                  compact ? "mt-1 text-xs text-foreground" : "mt-2 text-sm text-foreground"
                }
              >
                {formatSubscriptionPackagePrice(pkg, lang, displayCurrency)} ·{" "}
                {formatDurationMonths(pkg.durationMonths, lang)}
              </p>
              <p className={detailClass}>
                {t("subscription.summary.endsAt")}{" "}
                <span className="font-medium text-foreground">
                  {formatSummaryDate(sub.endDate, lang)}
                </span>
              </p>
              <p className={detailClassTight}>
                {t("subscription.summary.daysLeft")}{" "}
                <span className="font-medium text-foreground">
                  {formatDays(sub.remainingDays)}
                </span>
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="shrink-0 self-start rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60"
          >
            {t("subscription.summary.viewPlans")}
          </Link>
        </div>
      </div>
    );
  }

  if (
    !data.hasActiveSubscription &&
    (data.subscriptionStatus === "EXPIRED" ||
      data.subscriptionStatus === "CANCELLED")
  ) {
    const msgKey =
      data.subscriptionStatus === "CANCELLED"
        ? "subscription.summary.inactive.CANCELLED"
        : "subscription.summary.inactive.EXPIRED";
    return (
      <div
        className={rootClass(
          "border border-border bg-muted/30 text-sm text-muted-foreground",
        )}
      >
        <p className={compact ? "text-xs" : undefined}>{t(msgKey)}</p>
        <Link
          to="/pricing"
          className="mt-2 inline-block text-xs font-medium text-primary hover:underline sm:text-sm"
        >
          {t("subscription.summary.viewPlans")}
        </Link>
      </div>
    );
  }

  return null;
};

export default SubscriptionSummaryPanel;
