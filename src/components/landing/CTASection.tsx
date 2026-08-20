import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import LandingSectionBackground from '@/components/landing/LandingSectionBackground';
import { primaryButtonDefaultClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';
import { loadGsap, refreshScrollTriggerSoon } from '@/lib/cinematicScroll';

const CTASection = () => {
  const { t, lang } = useLanguage();
  const cinematic = useCinematicScrollEnabled();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    if (!cinematic) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(card, { opacity: 0, scale: 0.9 });

        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }, section);

      refreshScrollTriggerSoon(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
  }, [cinematic, lang]);

  return (
    <section ref={sectionRef} className="relative isolate overflow-x-clip py-12 md:py-16">
      <LandingSectionBackground variant="accent" />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-2xl shadow-primary/25 will-change-transform md:p-16"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:48px_48px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-blob-float motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-white/10 blur-3xl animate-blob-float-delayed motion-reduce:animate-none"
            aria-hidden="true"
          />

          <div className="relative">
            <h2 className="font-heading text-3xl font-bold md:text-5xl">{t('cta.title')}</h2>
            <p className="mx-auto mb-8 mt-4 max-w-lg text-lg leading-8 text-primary-foreground/80">
              {t('cta.subtitle')}
            </p>
            <Link to="/signup" className={cn(primaryButtonDefaultClass, 'px-9 py-4 text-base')}>
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
