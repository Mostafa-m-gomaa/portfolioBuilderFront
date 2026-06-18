import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, PlayCircle } from 'lucide-react';
import YouTubeEmbed from '@/components/shared/YouTubeEmbed';
import { PLATFORM_VIDEO_EMBED_URL } from '@/constants/platformVideo';

const HeroSection = () => {
  const { t } = useLanguage();
  const stats = [
    { value: t('hero.stat1.value'), label: t('hero.stat1.label') },
    { value: t('hero.stat2.value'), label: t('hero.stat2.label') },
    { value: t('hero.stat3.value'), label: t('hero.stat3.label') },
  ];
  const bullets = [t('hero.bullet1'), t('hero.bullet2'), t('hero.bullet3')];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.35)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl min-w-0 px-6">
        <div className="grid min-w-0 items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-start"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {t('hero.badge')}
            </div>

            <h1 className="mt-7 max-w-3xl font-heading text-4xl font-bold leading-[1.4] tracking-tight text-foreground sm:text-5xl sm:leading-[1.35] lg:text-6xl lg:leading-[1.4] xl:text-7xl xl:leading-[1.2]">
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                {t('hero.cta1')}
                <ArrowUpRight className="h-5 w-5" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-base font-bold text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
              >
                {t('hero.cta2')}
              </Link>

            </div>

            <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm rtl:divide-x-reverse">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 text-center sm:p-5">
                  <div className="font-heading text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.16 }}
            className="relative min-w-0"
          >
            <div className="absolute inset-0 rounded-[2.25rem] bg-primary/10 blur-3xl sm:-inset-4" aria-hidden="true" />
            <div className="relative rounded-[2rem] border border-border bg-card p-3 shadow-2xl shadow-foreground/10">
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {t('video.kicker')}
                  </div>
                </div>

                <div className="p-4">
                  <YouTubeEmbed
                    src={PLATFORM_VIDEO_EMBED_URL}
                    title={t('video.title')}
                    className="rounded-xl shadow-md"
                  />
                  <div className="mt-4 rounded-2xl bg-primary p-5 text-primary-foreground">
                    <p className="text-sm font-semibold">{t('video.title')}</p>
                    <p className="mt-2 text-xs opacity-80">{t('video.subtitle')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
