import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
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
import PaymentMethodsNote from '@/components/pricing/PaymentMethodsNote';
import { useDisplayCurrency } from '@/hooks/useDisplayCurrency';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { primaryButtonClass, primaryButtonSmClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';
import { loadGsap, refreshScrollTriggerSoon } from '@/lib/cinematicScroll';

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
  const cinematic = useCinematicScrollEnabled();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    staleTime: 60_000,
  });

  const packages = data ? reorderTwelveMonthToCenter(data) : [];
  const errMsg = isError ? parseApiError(error, t('pricing.loadError')) : '';

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const header = root.querySelector('[data-pricing-header]');
    const cards = root.querySelectorAll('[data-pricing-card]');

    if (!cinematic || isPending || cards.length === 0) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(header, { opacity: 0, y: 36 });
        gsap.set(cards, { opacity: 0, y: 56 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: 'top 75%',
              once: true,
              invalidateOnRefresh: true,
            },
          })
          .to(header, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
          .to(cards, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' }, 0.15);
      }, root);

      refreshScrollTriggerSoon(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
  }, [cinematic, lang, isPending, isError, packages.length, showBenefitCards]);

  return (
    <div ref={sectionRef}>
      <LandingSection variant="warm">
        <div className="mx-auto max-w-6xl px-6">
          <div data-pricing-header>
            <LandingSectionHeader
              kicker={t('pricing.kicker')}
              title={t('pricing.title')}
              subtitle={t('pricing.subtitle')}
            >
              {!isPending && !isError && packages.length > 0 ? (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <DisplayCurrencySelect value={displayCurrency} onChange={setDisplayCurrency} />
                  <PaymentMethodsNote className="mt-4" />
                </div>
              ) : null}
            </LandingSectionHeader>
          </div>

          {showBenefitCards ? (
            <div className="mb-14">
              <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-8 text-muted-foreground sm:text-lg">
                {t('pricing.benefits.subtitle')}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefitCards.map((benefit) => (
                  <div
                    key={benefit.textKey}
                    data-pricing-card
                    className="flex items-start gap-4 rounded-xl border border-border/80 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <benefit.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="pt-1 text-sm font-semibold leading-7 text-foreground sm:text-base">
                      {t(benefit.textKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

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
                className={cn(primaryButtonSmClass, 'mt-6')}
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
              {packages.map((pkg) => {
                const isPopular = isTwelveMonthPopularPlan(pkg);
                return (
                  <div
                    key={pkg._id}
                    data-pricing-card
                    className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm transition hover:-translate-y-2 ${isPopular
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
                        className={`block w-full rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${isPopular
                            ? 'border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20'
                            : 'border-border bg-background text-foreground hover:bg-muted/60'
                          }`}
                      >
                        {t('package.details')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </LandingSection>
    </div>
  );
};

export default PricingPreview;
