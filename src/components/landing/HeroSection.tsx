import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, PlayCircle } from 'lucide-react';
import anotherLogo from '@/assets/anotherLogo.png';
import { templateCatalog } from '@/constants/templateCatalog';

const HeroSection = () => {
  const { t } = useLanguage();
  const previewTemplates = templateCatalog.slice(0, 3);
  const mainPreview = previewTemplates[0];
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

            <h1 className="mt-7 max-w-3xl font-heading text-4xl font-bold leading-[1.4] tracking-tight text-foreground sm:text-5xl sm:leading-[1.35] lg:text-6xl lg:leading-[1.4] xl:text-7xl xl:leading-[1.4]">
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                <PlayCircle className="h-5 w-5" />
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
              <div className="rounded-[1.5rem] border border-border bg-background overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                    sirty.app/portfolio
                  </div>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-[1fr_0.72fr]">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    {mainPreview && (
                      <img
                        src={mainPreview.image}
                        alt=""
                        className="h-full min-h-[320px] w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                          <img src={anotherLogo} alt={t('brand.logoAlt')} className="h-8 w-8 object-contain" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{t('hero.previewTitle')}</p>
                          <p className="text-xs text-muted-foreground">{t('hero.previewSubtitle')}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2.5 rounded-full bg-primary/70" />
                        <div className="h-2.5 w-5/6 rounded-full bg-muted" />
                        <div className="h-2.5 w-2/3 rounded-full bg-muted" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {previewTemplates.slice(1).map((template) => (
                        <div key={template.templateName} className="overflow-hidden rounded-xl border border-border bg-card">
                          <img src={template.image} alt="" className="aspect-[4/3] w-full object-cover" />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                      <p className="text-sm font-semibold">{t('hero.mockCaption')}</p>
                      <p className="mt-2 text-xs opacity-80">{t('hero.trust')}</p>
                    </div>
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
