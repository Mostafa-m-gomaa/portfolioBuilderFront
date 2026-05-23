import { Link } from "react-router-dom";
import { Loader2, CreditCard, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscriptionSummary } from "@/hooks/useSubscriptionSummary";
import {
  formatDurationMonths,
  formatPackagePrice,
} from "@/lib/packageDisplay";
import { toLatinDigits } from "@/lib/latinDigits";

type Lang = "ar" | "en";

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

const subscriptionStatusLabel = (status: string, t: (key: string) => string) => {
  const key = `subscription.status.${status}`;
  const label = t(key);
  return label === key ? status : label;
};

/**
 * Dashboard / profile: current plan, trial, or inactive state from GET /subscriptions/me/summary.
 */
const SubscriptionSummaryPanel = () => {
  const { t, lang } = useLanguage();
  const { data, isLoading, isError } = useSubscriptionSummary();

  if (isLoading) {
    return (
      <div className="mb-8 flex items-center gap-2 rounded-2xl border border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
        {t("subscription.summary.loading")}
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  if (data.subscriptionStatus === "FREE_TRIAL" && data.subscription) {
    const sub = data.subscription;
    return (
      <div className="mb-8 rounded-2xl border border-sky-500/40 bg-sky-500/10 p-5 dark:bg-sky-950/20">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-sky-600 dark:text-sky-400" />
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              {t("subscription.summary.trialTitle")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("subscription.summary.trialEnds")}{" "}
              <span className="font-medium text-foreground">
                {formatSummaryDate(sub.endDate, lang)}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("subscription.summary.daysLeft")}{" "}
              <span className="font-medium text-foreground">
                {formatDays(sub.remainingDays)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data.hasActiveSubscription && data.subscription) {
    const sub = data.subscription;
    const pkg = sub.package;
    return (
      <div className="mb-8 rounded-2xl border border-primary/35 bg-primary/5 p-5 shadow-sm dark:bg-primary/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t("subscription.summary.activeBadge")}
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold text-foreground">
                {pkg.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("subscription.summary.status")}:{" "}
                <span className="font-medium text-foreground">
                  {subscriptionStatusLabel(data.subscriptionStatus, t)}
                </span>
              </p>
              <p className="mt-2 text-sm text-foreground">
                {formatPackagePrice(pkg.price, pkg.currency, lang)} ·{" "}
                {formatDurationMonths(pkg.durationMonths, lang)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("subscription.summary.endsAt")}{" "}
                <span className="font-medium text-foreground">
                  {formatSummaryDate(sub.endDate, lang)}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("subscription.summary.daysLeft")}{" "}
                <span className="font-medium text-foreground">
                  {formatDays(sub.remainingDays)}
                </span>
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="shrink-0 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60"
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
      <div className="mb-8 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>{t(msgKey)}</p>
        <Link
          to="/pricing"
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("subscription.summary.viewPlans")}
        </Link>
      </div>
    );
  }

  return null;
};

export default SubscriptionSummaryPanel;
