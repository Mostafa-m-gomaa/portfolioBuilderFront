import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { primaryButtonDefaultClass } from '@/lib/buttonStyles';
import { ArrowUpRight } from 'lucide-react';
import {
  loadGsap,
  pinSectionConfig,
  refreshScrollTriggerSoon,
  revertGsapContext,
} from '@/lib/cinematicScroll';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import ColorBendsBackground from '@/components/ColorBendsBackground';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobileViewport();
  const cinematic = useCinematicScrollEnabled();
  const useCssIntro = prefersReducedMotion || isMobile;
  const hostRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bullets = [t('hero.bullet1'), t('hero.bullet2'), t('hero.bullet3')];

  useEffect(() => {
    if (useCssIntro) return;

    const section = sectionRef.current;
    if (!section) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;

      const badge = section.querySelector('[data-hero="badge"]');
      const titleLines = section.querySelectorAll('[data-hero="title"] span');
      const subtitle = section.querySelector('[data-hero="subtitle"]');
      const bulletItems = section.querySelectorAll('[data-hero="bullets"] > *');
      const cta = section.querySelector('[data-hero="cta"]');
      const noCard = section.querySelector('[data-hero="no-card"]');
      const targets = [badge, ...Array.from(titleLines), subtitle, ...Array.from(bulletItems), cta, noCard].filter(Boolean);

      ctx = gsap.context(() => {
        gsap.set(targets, { opacity: 0, y: 28 });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (badge) tl.to(badge, { opacity: 1, y: 0, duration: 0.55 }, 0.1);
        if (titleLines.length) tl.to(titleLines, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, '-=0.2');
        if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');
        if (bulletItems.length) tl.to(bulletItems, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, '-=0.2');
        if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.5 }, '-=0.15');
        if (noCard) tl.to(noCard, { opacity: 1, y: 0, duration: 0.45 }, '-=0.25');
      }, section);
    });

    return () => {
      cancelled = true;
      revertGsapContext(ctx);
    };
  }, [useCssIntro, lang, theme]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const content = contentRef.current;
    if (!host || !content || !cinematic) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: pinSectionConfig(host, { end: '+=90%', scrub: 0.65 }),
          })
          .to(
            content,
            {
              scale: 0.72,
              opacity: 0,
              y: -80,
              filter: 'blur(6px)',
              ease: 'none',
            },
            0,
          );
      }, host);

      refreshScrollTriggerSoon(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      revertGsapContext(ctx);
    };
  }, [cinematic, lang, theme]);

  return (
    <div ref={hostRef} className="relative">
      <section
        ref={sectionRef}
        className={cn(
          'relative isolate min-h-[min(100vh,820px)] overflow-hidden pt-28 pb-16 lg:pb-20',
          useCssIntro && 'hero-fade-in',
        )}
      >
        <ColorBendsBackground />

        <div
          ref={contentRef}
          className="relative z-10 mx-auto max-w-7xl origin-center px-4 sm:px-6 will-change-transform"
        >
          <div className="mx-auto max-w-4xl text-center">
            <div
              data-hero="badge"
              className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-xl ${isLight
                ? 'border-[#1D24CA]/25 bg-white/70 text-[#1D24CA] shadow-sm shadow-[#1D24CA]/15'
                : 'border-white/10 bg-white/5 text-white/90'
                }`}
            >
              {t('hero.badge')}
            </div>

            <h1
              data-hero="title"
              className={`mt-8 font-heading text-4xl font-bold leading-[1.3] tracking-tight sm:mt-10 sm:text-6xl sm:leading-[1.25] lg:text-7xl lg:leading-[1.2] ${isLight ? 'text-foreground' : 'text-white'
                }`}
            >
              <span className="block">{t('hero.title')}</span>
              <span
                className={`mt-2 block sm:mt-3 ${isLight
                  ? 'bg-gradient-to-r from-[#1D24CA] via-[#3D45E0] to-[#1D24CA] bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-white via-[#B8BBF7] to-[#8B90F0] bg-clip-text text-transparent'
                  }`}
              >
                {t('hero.titleHighlight').trim()}
              </span>
            </h1>

            <p
              data-hero="subtitle"
              className={`mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg ${isLight ? 'text-muted-foreground' : 'text-white/75'
                }`}
            >
              {t('hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-8">
              <div className="order-1 flex flex-col items-center gap-3 sm:order-2">
                <div
                  data-hero="cta"
                  className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
                >
                  <Link to="/signup" className={primaryButtonDefaultClass}>
                    {t('hero.cta1')}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <p
                  data-hero="no-card"
                  className={`text-center text-sm font-semibold sm:text-base ${isLight ? 'text-[#1D24CA]' : 'text-white'
                    }`}
                >
                  {t('hero.noCard')}
                </p>
              </div>

              <div
                data-hero="bullets"
                className="order-2 mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:order-1 sm:gap-3"
              >
                {bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold backdrop-blur-md sm:min-w-[9.5rem] sm:px-5 sm:py-3 sm:text-base ${isLight
                      ? 'border-[#1D24CA]/20 bg-white/80 text-[#1D24CA] shadow-sm shadow-[#1D24CA]/10'
                      : 'border-white/15 bg-white/10 text-white'
                      }`}
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
