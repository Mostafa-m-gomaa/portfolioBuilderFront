import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  Globe,
  Headphones,
  LayoutDashboard,
  LayoutTemplate,
  Loader2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPackages } from '@/api/packages';
import { parseApiError } from '@/api/axios';
import {
  formatDurationMonths,
  formatPackageDisplayPrice,
  packageDescription,
  packageFeatureText,
  packageName,
  reorderTwelveMonthToCenter,
  isTwelveMonthPopularPlan,
} from '@/lib/packageDisplay';
import SubscribePackageCta from '@/components/pricing/SubscribePackageCta';
import DisplayCurrencySelect from '@/components/pricing/DisplayCurrencySelect';
import { useDisplayCurrency } from '@/hooks/useDisplayCurrency';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { landingViewport, scaleUp, staggerContainer, staggerItem } from '@/lib/landingMotion';
import { primaryButtonClass, primaryButtonSmClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';

type PricingPreviewProps = {
  showBenefitCards?: boolean;
};

const benefitCards = [
  { icon: Sparkles, textKey: 'pricing.benefits.1' },
  { icon: LayoutDashboard, textKey: 'pricing.benefits.2' },
  { icon: Wand2, textKey: 'pricing.benefits.3' },
  { icon: Globe, textKey: 'pricing.benefits.4' },
  { icon: LayoutTemplate, textKey: 'pricing.benefits.5' },
  { icon: Headphones, textKey: 'pricing.benefits.6' },
] as const;

const PricingPreview = ({ showBenefitCards = false }: PricingPreviewProps) => {
  const { t, lang } = useLanguage();
  const { displayCurrency, setDisplayCurrency } = useDisplayCurrency();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    staleTime: 60_000,
  });

  const packages = data ? reorderTwelveMonthToCenter(data) : [];
  const errMsg = isError ? parseApiError(error, t('pricing.loadError')) : '';

  return (
    <LandingSection variant="warm">
      <div className="mx-auto max-w-6xl px-6">
        <LandingSectionHeader
          kicker={t('pricing.kicker')}
          title={t('pricing.title')}
          subtitle={t('pricing.subtitle')}
        >
          {!isPending && !isError && packages.length > 0 ? (
            <div className="mt-8 flex justify-center">
              <DisplayCurrencySelect value={displayCurrency} onChange={setDisplayCurrency} />
            </div>
          ) : null}
        </LandingSectionHeader>

        {showBenefitCards ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={staggerContainer}
            className="mb-14"
          >
            <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-8 text-muted-foreground sm:text-lg">
              {t('pricing.benefits.subtitle')}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefitCards.map((benefit) => (
                <motion.div
                  key={benefit.textKey}
                  variants={staggerItem}
                  className="flex items-start gap-4 rounded-xl border border-border/80 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="pt-1 text-sm font-semibold leading-7 text-foreground sm:text-base">
                    {t(benefit.textKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
            <span>{t('pricing.loading')}</span>
          </div>
        ) : isError ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={scaleUp}
            className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
          >
            <p className="text-foreground">{errMsg}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className={cn(primaryButtonSmClass, 'mt-6')}
            >
              {t('pricing.retry')}
            </button>
          </motion.div>
        ) : packages.length === 0 ? (
          <p className="py-16 text-center text-lg text-muted-foreground">{t('pricing.empty')}</p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={staggerContainer}
            className={
              packages.length === 3
                ? 'grid grid-cols-1 gap-6 md:grid-cols-3'
                : 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
            }
          >
            {packages.map((pkg) => {
              const isPopular = isTwelveMonthPopularPlan(pkg);
              return (
                <motion.div
                  key={pkg._id}
                  variants={staggerItem}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm ${
                    isPopular
                      ? 'border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/25 md:z-10 md:-my-1 md:py-7 xl:scale-[1.03]'
                      : 'border-border/80 bg-card/80 text-foreground shadow-sm'
                  }`}
                >
                  {isPopular ? (
                    <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                      {t('pricing.popular')}
                    </span>
                  ) : null}
                  <h3 className={`mb-2 font-heading text-xl font-semibold ${isPopular ? '' : 'text-foreground'}`}>
                    {packageName(pkg, lang)}
                  </h3>
                  <div className="mb-6">
                    <span className={`font-heading text-4xl font-bold ${isPopular ? '' : 'text-foreground'}`}>
                      {formatPackageDisplayPrice(pkg, displayCurrency, lang)}
                    </span>
                    <p className={`mt-2 text-sm ${isPopular ? 'opacity-90' : 'text-muted-foreground'}`}>
                      {t('pricing.subscriptionDuration')}
                      {formatDurationMonths(pkg.durationMonths, lang)}
                    </p>
                    {packageDescription(pkg, lang) ? (
                      <p
                        className={`mt-3 line-clamp-3 text-sm leading-relaxed ${isPopular ? 'opacity-90' : 'text-muted-foreground'}`}
                      >
                        {packageDescription(pkg, lang)}
                      </p>
                    ) : null}
                  </div>
                  <ul className="mb-4 flex-1 space-y-3">
                    {pkg.features.map((f, j) => (
                      <li
                        key={j}
                        className={`flex items-center gap-2 text-sm ${isPopular ? 'text-primary-foreground/95' : 'text-foreground'}`}
                      >
                        <Check
                          className={`h-4 w-4 shrink-0 ${isPopular ? 'text-primary-foreground' : 'text-primary'}`}
                        />
                        {packageFeatureText(f, lang)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex w-full min-w-0 flex-col gap-3">
                    <SubscribePackageCta
                      packageId={pkg._id}
                      couponEnabled
                      packagePrice={pkg.priceEgp}
                      className={cn(
                        'block w-full px-4 py-3 text-center',
                        isPopular
                          ? 'inline-flex items-center justify-center rounded-xl bg-background text-sm font-bold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-background/95'
                          : primaryButtonClass,
                      )}
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
          </motion.div>
        )}
      </div>
    </LandingSection>
  );
};

export default PricingPreview;
