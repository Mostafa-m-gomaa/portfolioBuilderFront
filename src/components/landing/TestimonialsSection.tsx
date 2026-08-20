import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';
import { loadGsap, refreshScrollTriggerSoon } from '@/lib/cinematicScroll';

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();
  const cinematic = useCinematicScrollEnabled();
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonials =
    lang === 'ar'
      ? [
        {
          name: 'سارة أحمد',
          role: 'مصممة جرافيك',
          text: 'قدرت أرتب أعمالي وخدماتي في صفحة واحدة شكلها واضح للعملاء.',
          rating: 5,
        },
        {
          name: 'محمد علي',
          role: 'مطور ويب',
          text: 'القوالب اختصرت وقت كبير، والتعديل على المحتوى كان مباشر وسهل.',
          rating: 5,
        },
        {
          name: 'نور حسن',
          role: 'مصورة',
          text: 'الموقع ساعدني أعرض الصور بطريقة أنضف وأرسل الرابط بدل ملفات متفرقة.',
          rating: 5,
        },
      ]
      : [
        {
          name: 'Sarah Ahmed',
          role: 'Graphic Designer',
          text: 'I was able to organize my work and services in one clear page for clients.',
          rating: 5,
        },
        {
          name: 'Mohamed Ali',
          role: 'Web Developer',
          text: 'The templates saved a lot of time, and editing the content felt straightforward.',
          rating: 5,
        },
        {
          name: 'Nour Hassan',
          role: 'Photographer',
          text: 'The site helped me present photos more cleanly and send one link instead of scattered files.',
          rating: 5,
        },
      ];

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const header = root.querySelector('[data-testimonials-header]');
    const cards = root.querySelectorAll('[data-testimonial-card]');

    if (!cinematic) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(header, { opacity: 0, y: 36 });
        cards.forEach((card, i) => {
          gsap.set(card, { opacity: 0, x: i % 2 === 0 ? 64 : -64 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            once: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(header, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
        cards.forEach((card, i) => {
          tl.to(card, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.12 + i * 0.1);
        });
      }, root);

      refreshScrollTriggerSoon(ScrollTrigger);
    });

    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
  }, [cinematic, lang]);

  return (
    <div ref={sectionRef}>
      <LandingSection variant="accent" alternate>
        <div className="mx-auto max-w-6xl px-6">
          <div data-testimonials-header>
            <LandingSectionHeader
              kicker={t('testimonials.kicker')}
              title={t('testimonials.title')}
              subtitle={t('testimonials.subtitle')}
              className="max-w-2xl"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <div
                key={i}
                data-testimonial-card
                className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-sm text-foreground">"{item.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LandingSection>
    </div>
  );
};

export default TestimonialsSection;
