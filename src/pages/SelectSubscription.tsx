import { useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchPackages } from "@/api/packages";
import { parseApiError } from "@/api/axios";
import {
  formatDurationMonths,
  formatPackageDisplayPrice,
  getPackagePrice,
  packageDescription,
  packageFeatureText,
  packageName,
  sortPackagesByOrder,
} from "@/lib/packageDisplay";
import { needsSubscriptionOnboarding, getPostAuthEntryPath } from "@/lib/authRouting";
import { useAuthStore } from "@/store/auth.store";
import { subscriptionsService } from "@/services/subscriptions.service";
import DisplayCurrencySelect from "@/components/pricing/DisplayCurrencySelect";
import SubscribePackageCta from "@/components/pricing/SubscribePackageCta";
import { useDisplayCurrency } from "@/hooks/useDisplayCurrency";
import { useSubscriptionSummary } from "@/hooks/useSubscriptionSummary";

const SelectSubscription = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAr = lang === "ar";
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();
  const { data: subSummary, isFetched: subSumFetched } = useSubscriptionSummary();

  const { data: packagesRaw, isPending, isError, error, refetch } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    staleTime: 60_000,
  });

  const packages = useMemo(
    () => (packagesRaw ? sortPackagesByOrder(packagesRaw) : []),
    [packagesRaw],
  );

  const mergedTrialFeatures = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of packages) {
      for (const f of p.features) {
        const s = packageFeatureText(f, lang).trim();
        if (s && !seen.has(s)) {
          seen.add(s);
          out.push(s);
        }
      }
    }
    return out.slice(0, 14);
  }, [packages, lang]);

  const freeTrialMutation = useMutation({
    mutationFn: () => subscriptionsService.startFreeTrial(),
    onSuccess: () => {
      const u = useAuthStore.getState().user;
      if (u) {
        setAuth({
          user: { ...u, subscriptionStatus: "FREE_TRIAL" },
        });
      }
      toast.success(t("subscription.freeTrial.success"));
      void queryClient.invalidateQueries({ queryKey: ["subscription-summary"] });
      navigate("/choose-subdomain");
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error(
          parseApiError(err, t("subscription.error.freeTrialAlreadyUsed")),
        );
        return;
      }
      toast.error(parseApiError(err, t("subscription.error.generic")));
    },
  });

  if (!needsSubscriptionOnboarding(user)) {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  if (user?.subscriptionStatus === "NOT_DETECTED" && !subSumFetched) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-6 pt-32 pb-24 text-sm text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
          {t("subscription.summary.syncing")}
        </main>
      </div>
    );
  }

  if (
    user?.subscriptionStatus === "NOT_DETECTED" &&
    subSummary &&
    subSummary.subscriptionStatus !== "NOT_DETECTED"
  ) {
    return (
      <Navigate
        to={getPostAuthEntryPath({
          ...user,
          subscriptionStatus: subSummary.subscriptionStatus,
        })}
        replace
      />
    );
  }

  const errMsg = isError ? parseApiError(error, t("pricing.loadError")) : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {t("subscription.kicker")}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("subscription.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subscription.subtitle")}
          </p>
          {!isPending && !isError && packages.length > 0 ? (
            <div className="mt-8 flex justify-center">
              <DisplayCurrencySelect
                value={displayCurrency}
                onChange={setDisplayCurrency}
              />
            </div>
          ) : null}
        </motion.div>

        {isPending ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
            <span>{t("pricing.loading")}</span>
          </div>
        ) : isError ? (
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-foreground">{errMsg}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t("pricing.retry")}
            </button>
          </div>
        ) : (
          <div className="mt-14">
            {packages.length === 0 ? (
              <p className="mb-6 text-center text-muted-foreground">
                {t("pricing.empty")}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <motion.div
                key="__free_trial__"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-primary/55 bg-gradient-to-b from-primary/20 via-primary/8 to-card p-6 shadow-lg shadow-primary/20 ring-1 ring-primary/15 dark:from-primary/25 dark:via-primary/10 dark:to-card dark:shadow-primary/30"
              >
                <div
                  className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-primary/25 blur-3xl dark:bg-primary/35"
                  aria-hidden
                />
                <div className="relative flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {t("subscription.freeTrial.badge")}
                  </span>
                </div>
                <h3 className="relative mt-2 font-heading text-lg font-semibold text-foreground">
                  {t("subscription.freeTrial.title")}
                </h3>
                <p className="relative mt-2 font-heading text-2xl font-bold text-primary">
                  {t("subscription.freeTrial.cardPrice")}
                </p>
                <p className="relative mt-1 text-sm text-muted-foreground">
                  {t("subscription.freeTrial.duration")}
                </p>
                <p className="relative mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {t("subscription.freeTrial.description")}
                </p>
                <ul className="relative mt-4 flex-1 space-y-2">
                  {(mergedTrialFeatures.length > 0
                    ? mergedTrialFeatures
                    : [
                      t("subscription.freeTrial.fallback1"),
                      t("subscription.freeTrial.fallback2"),
                      t("subscription.freeTrial.fallback3"),
                      t("subscription.freeTrial.fallback4"),
                    ]
                  )
                    .slice(0, 5)
                    .map((line, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-xs text-foreground"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {line}
                      </li>
                    ))}
                </ul>
                <div className="relative mt-6 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={freeTrialMutation.isPending}
                    onClick={() => freeTrialMutation.mutate()}
                    className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground shadow-md shadow-primary/30 transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {freeTrialMutation.isPending
                      ? t("subscription.freeTrial.pending")
                      : t("subscription.freeTrial.cta")}
                  </button>
                  <Link
                    to="/pricing"
                    className="block w-full rounded-xl border border-primary/35 bg-background/80 py-2.5 text-center text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-primary/10"
                  >
                    {t("nav.pricing")}
                  </Link>
                </div>
              </motion.div>
              {packages.map((pkg, i) => {
                const { price, currency } = getPackagePrice(pkg, displayCurrency);
                return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 1) * 0.06 }}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {packageName(pkg, lang)}
                  </h3>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground">
                    {formatPackageDisplayPrice(pkg, displayCurrency, lang)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('pricing.subscriptionDuration')}
                    {formatDurationMonths(pkg.durationMonths, lang)}
                  </p>
                  {packageDescription(pkg, lang) ? (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {packageDescription(pkg, lang)}
                    </p>
                  ) : null}
                  <ul className="mt-4 flex-1 space-y-2">
                    {pkg.features.slice(0, 5).map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-xs text-foreground"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {packageFeatureText(f, lang)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-2">
                    <SubscribePackageCta
                      packageId={pkg._id}
                      couponEnabled
                      packagePrice={price}
                      packageCurrency={currency}
                      selectedDisplayCurrency={displayCurrency}
                      className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      {t("pricing.cta")}
                    </SubscribePackageCta>
                    <Link
                      to={`/pricing/${pkg._id}`}
                      className="block w-full rounded-xl border border-border bg-background py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                    >
                      {t("subscription.paidPlans.viewDetails")}
                    </Link>
                  </div>
                </motion.div>
              );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectSubscription;
