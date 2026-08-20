import { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, LayoutTemplate, Rocket, Settings2 } from 'lucide-react';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';
import {
  enterFromX,
  loadGsap,
  pinSectionConfig,
  refreshScrollTriggerSoon,
  revertGsapContext,
} from '@/lib/cinematicScroll';

const FeaturesSection = () => {
  const { t, lang } = useLanguage();
  const cinematic = useCinematicScrollEnabled();
  const hostRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    { icon: LayoutTemplate, titleKey: 'features.1.title', descKey: 'features.1.desc' },
    { icon: Settings2, titleKey: 'features.2.title', descKey: 'features.2.desc' },
    { icon: Rocket, titleKey: 'features.3.title', descKey: 'features.3.desc' },
    { icon: BarChart3, titleKey: 'features.4.title', descKey: 'features.4.desc' },
  ];

  useLayoutEffect(() => {
    if (!cinematic) return;

    const host = hostRef.current;
    const root = sectionRef.current;
    if (!host || !root) return;

    const header = root.querySelector('[data-features-header]');
    const cards = root.querySelectorAll('[data-feature-card]');
    const fromX = enterFromX(lang);

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(header, { opacity: 0, y: 40 });
        gsap.set(cards, { opacity: 0, x: `${fromX}%` });

        const tl = gsap.timeline({
          scrollTrigger: pinSectionConfig(host, {
            end: `+=${Math.max(features.length, 1) * 55}%`,
          }),
        });

        tl.to(header, { opacity: 1, y: 0, ease: 'none', duration: 0.35 }, 0);

        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              opacity: 1,
              x: 0,
              ease: 'none',
              duration: 0.45,
            },
            0.35 + i * 0.45,
          );
        });

        tl.to({}, { duration: 0.25 });
      }, host);

      refreshScrollTriggerSoon(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      revertGsapContext(ctx);
    };
  }, [cinematic, lang, features.length]);

  return (
    <div ref={hostRef} className="relative">
      <LandingSection ref={sectionRef} variant="default" flush className="py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div data-features-header>
            <LandingSectionHeader
              kicker={t('features.kicker')}
              title={t('features.title')}
              subtitle={t('features.subtitle')}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={i}
                data-feature-card
                className="group cursor-default rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-2 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{t(feature.titleKey)}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </LandingSection>
    </div>
  );
};

export default FeaturesSection;
