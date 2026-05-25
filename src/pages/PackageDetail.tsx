import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchPackageById } from "@/api/packages";
import { parseApiError } from "@/api/axios";
import {
  formatDurationMonths,
  formatPackageDisplayPrice,
  getPackagePrice,
  isTwelveMonthPopularPlan,
  packageDescription,
  packageFeatureText,
  packageName,
} from "@/lib/packageDisplay";
import SubscribePackageCta from "@/components/pricing/SubscribePackageCta";
import DisplayCurrencySelect from "@/components/pricing/DisplayCurrencySelect";
import { useDisplayCurrency } from "@/hooks/useDisplayCurrency";
import { Check, Loader2 } from "lucide-react";

const PackageDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { t, lang } = useLanguage();
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();

  const {
    data: pkg,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["packages", packageId],
    queryFn: () => fetchPackageById(packageId!),
    enabled: Boolean(packageId),
  });

  const errMsg = isError ? parseApiError(error, t("pricing.loadError")) : "";
  const listPrice = pkg ? getPackagePrice(pkg, displayCurrency) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-24">
        <Link
          to="/pricing"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("package.back")}
        </Link>

        {!packageId ? (
          <p className="mt-8 text-muted-foreground">{t("package.missingId")}</p>
        ) : isPending ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            <span>{t("pricing.loading")}</span>
          </div>
        ) : isError ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-foreground">{errMsg}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t("pricing.retry")}
            </button>
          </div>
        ) : pkg && listPrice ? (
          <article
            className={`relative mt-10 rounded-2xl border p-6 md:p-8 ${isTwelveMonthPopularPlan(pkg)
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                : "border-border bg-card shadow-sm"
              }`}
          >
            {isTwelveMonthPopularPlan(pkg) ? (
              <span className="absolute -top-3 start-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm md:start-8">
                {t("pricing.popular")}
              </span>
            ) : null}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                {packageName(pkg, lang)}
              </h1>
              <DisplayCurrencySelect
                value={displayCurrency}
                onChange={setDisplayCurrency}
                className="shrink-0 md:max-w-[260px]"
              />
            </div>
            <p className="mt-2 text-muted-foreground">
              {formatDurationMonths(pkg.durationMonths, lang)} ·{" "}
              {formatPackageDisplayPrice(pkg, displayCurrency, lang)}
            </p>
            {packageDescription(pkg, lang) ? (
              <p className="mt-6 text-lg leading-relaxed text-foreground/90">
                {packageDescription(pkg, lang)}
              </p>
            ) : null}
            <ul className="mt-8 space-y-3">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{packageFeatureText(f, lang)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <SubscribePackageCta
                packageId={pkg._id}
                couponEnabled
                packagePrice={listPrice.price}
                packageCurrency={listPrice.currency}
                selectedDisplayCurrency={displayCurrency}
                className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("pricing.cta")}
              </SubscribePackageCta>
              <Link
                to="/pricing"
                className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50"
              >
                {t("package.back")}
              </Link>
            </div>
          </article>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default PackageDetail;
