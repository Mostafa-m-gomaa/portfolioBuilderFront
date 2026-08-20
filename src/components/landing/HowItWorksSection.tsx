import { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import PlatformVideoSection from '@/components/shared/PlatformVideoSection';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';
import {
  loadGsap,
  pinSectionConfig,
  refreshScrollTriggerSoon,
  revertGsapContext,
} from '@/lib/cinematicScroll';

const HowItWorksSection = () => {
  const { t, lang } = useLanguage();
  const cinematic = useCinematicScrollEnabled();
  const hostRef = useRef<HTMLDivElement>(null);
  const stepsRootRef = useRef<HTMLElement>(null);

  const steps = [
    { num: '01', titleKey: 'how.1.title', descKey: 'how.1.desc' },
    { num: '02', titleKey: 'how.2.title', descKey: 'how.2.desc' },
    { num: '03', titleKey: 'how.3.title', descKey: 'how.3.desc' },
  ];

  useLayoutEffect(() => {
    if (!cinematic) return;

    const host = hostRef.current;
    const root = stepsRootRef.current;
    if (!host || !root) return;

    const header = root.querySelector('[data-how-header]');
    const cards = root.querySelectorAll('[data-how-step]');

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(header, { opacity: 0, y: 36 });
        gsap.set(cards, { opacity: 0, y: 60, scale: 0.92 });

        const tl = gsap.timeline({
          scrollTrigger: pinSectionConfig(host, { end: '+=110%' }),
        });

        tl.to(header, { opacity: 1, y: 0, ease: 'none', duration: 0.3 }, 0);
        cards.forEach((card, i) => {
          tl.to(card, { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 0.4 }, 0.3 + i * 0.35);
        });
        tl.to({}, { duration: 0.2 });
      }, host);

      refreshScrollTriggerSoon(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      revertGsapContext(ctx);
    };
  }, [cinematic, lang]);

  return (
    <>
      <div ref={hostRef} className="relative">
        <LandingSection ref={stepsRootRef} variant="cool" alternate flush className="py-10 md:py-12">
          <div className="mx-auto max-w-5xl px-6">
            <div data-how-header>
              <LandingSectionHeader
                kicker={t('how.kicker')}
                title={t('how.title')}
                subtitle={t('how.subtitle')}
                className="max-w-2xl"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={i} data-how-step className="relative text-start">
                  <div className="h-full rounded-2xl border border-border/80 bg-card/80 p-7 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-secondary/5">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-primary">{step.num}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">{t(step.titleKey)}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{t(step.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            <PlatformVideoSection className="mt-20" />
          </div>
        </LandingSection>
      </div>
    </>
  );
};

export default HowItWorksSection;
