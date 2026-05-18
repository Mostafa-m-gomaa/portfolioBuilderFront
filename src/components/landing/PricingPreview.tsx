import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPackages } from '@/api/packages';
import { parseApiError } from '@/api/axios';
import { formatDurationMonths, formatConvertedPackagePrice, reorderTwelveMonthToCenter, isTwelveMonthPopularPlan } from '@/lib/packageDisplay';
import SubscribePackageCta from '@/components/pricing/SubscribePackageCta';
import DisplayCurrencySelect from '@/components/pricing/DisplayCurrencySelect';
import { useDisplayCurrency } from '@/hooks/useDisplayCurrency';

const PricingPreview = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    staleTime: 60_000,
  });

  const packages = data ? reorderTwelveMonthToCenter(data) : [];
  const errMsg = isError ? parseApiError(error, t('pricing.loadError')) : '';

  return (
    <section className="relative py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{t('pricing.kicker')}</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">{t('pricing.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{t('pricing.subtitle')}</p>

          {!isPending && !isError && packages.length > 0 ? (
            <div className="mt-8 flex justify-center">
              <DisplayCurrencySelect value={displayCurrency} onChange={setDisplayCurrency} />
            </div>
          ) : null}
        </motion.div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
            <span>{t('pricing.loading')}</span>
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-foreground">{errMsg}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t('pricing.retry')}
            </button>
          </div>
        ) : packages.length === 0 ? (
          <p className="py-16 text-center text-lg text-muted-foreground">{t('pricing.empty')}</p>
        ) : (
          <div
            className={
              packages.length === 3
                ? 'grid grid-cols-1 gap-6 md:grid-cols-3'
                : 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
            }
          >
            {packages.map((pkg, i) => {
              const isPopular = isTwelveMonthPopularPlan(pkg);
              return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  isPopular
                    ? 'border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/25 md:z-10 md:-my-1 md:py-7 xl:scale-[1.03]'
                    : 'border-border bg-card text-foreground shadow-sm'
                }`}
              >
                {isPopular ? (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                    {t('pricing.popular')}
                  </span>
                ) : null}
                <h3 className={`mb-2 font-heading text-xl font-semibold ${isPopular ? '' : 'text-foreground'}`}>{pkg.name}</h3>
                <div className="mb-6">
                  <span className={`font-heading text-4xl font-bold ${isPopular ? '' : 'text-foreground'}`}>
                    {formatConvertedPackagePrice(pkg.price, pkg.currency, displayCurrency, lang)}
                  </span>
                  <p className={`mt-2 text-sm ${isPopular ? 'opacity-90' : 'text-muted-foreground'}`}>
                    {isAr ? 'مدة الاشتراك: ' : 'Subscription: '}
                    {formatDurationMonths(pkg.durationMonths, lang)}
                  </p>
                  {pkg.description ? (
                    <p className={`mt-3 text-sm leading-relaxed line-clamp-3 ${isPopular ? 'opacity-90' : 'text-muted-foreground'}`}>{pkg.description}</p>
                  ) : null}
                </div>
                <ul className="mb-4 flex-1 space-y-3">
                  {pkg.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${isPopular ? 'text-primary-foreground/95' : 'text-foreground'}`}>
                      <Check className={`h-4 w-4 shrink-0 ${isPopular ? 'text-primary-foreground' : 'text-primary'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex w-full min-w-0 flex-col gap-3">
                  <SubscribePackageCta
                    packageId={pkg._id}
                    couponEnabled
                    packagePrice={pkg.price}
                    packageCurrency={pkg.currency}
                    className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                      isPopular ? 'bg-background text-foreground' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {t('pricing.cta')}
                  </SubscribePackageCta>
                  <Link
                    to={`/pricing/${pkg._id}`}
                    className={`block w-full rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${
                      isPopular
                        ? 'border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20'
                        : 'border-border bg-background text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {t('package.details')}
                  </Link>
                </div>
              </motion.div>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPreview;
