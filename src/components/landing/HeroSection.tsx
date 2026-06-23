import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { TemplatePreviewImage } from '@/components/templates/TemplatePreviewImage';
import { prettyTemplateName, showcaseTemplates, templatePreviewUrl } from '@/lib/templateCatalogView';

const HeroSection = () => {
  const { lang, t } = useLanguage();
  const heroTemplates = showcaseTemplates.slice(0, 10);
  const marqueeItems = [...heroTemplates, ...heroTemplates];
  const bullets = [t('hero.bullet1'), t('hero.bullet2'), t('hero.bullet3')];

  return (
    <section className="relative isolate overflow-hidden bg-[#050814] pt-28 pb-14 lg:pt-32 lg:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_92%,rgba(139,92,246,0.35),transparent_30%),radial-gradient(circle_at_85%_72%,rgba(88,28,135,0.35),transparent_34%),linear-gradient(180deg,#070b18_0%,#050814_58%,#070717_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-violet-500/20 via-violet-500/5 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070b18]/90 px-6 py-14 shadow-2xl shadow-violet-950/30 backdrop-blur sm:rounded-[2.5rem] sm:px-10 lg:px-12 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_80%,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_72%_35%,rgba(109,40,217,0.28),transparent_32%)]" />
          <div
            className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
            aria-hidden="true"
          />
          <div className="absolute -bottom-24 left-0 h-64 w-96 rounded-full bg-violet-500/25 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-4xl text-start"
            >
              <div className="inline-flex items-center rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-100 shadow-lg shadow-violet-950/20 backdrop-blur">
                {t('hero.badge')}
              </div>

              <h1 className="text-balance mt-7 max-w-5xl font-heading text-5xl font-bold leading-[1.05] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                {t('hero.title')}{' '}
                <span className="text-white/82">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                {t('hero.subtitle')}
              </p>

              <div className="mt-7 grid gap-3 text-sm text-white/82 sm:grid-cols-3">
                {bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/7 text-violet-200 ring-1 ring-white/10">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/30"
                >
                  {t('hero.cta1')}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/templates"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {t('hero.cta2')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="mt-14"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-200">
                  {t('templateShowcase.kicker')}
                </p>
                <Link to="/templates" className="text-sm font-semibold text-white/45 transition hover:text-violet-200">
                  {t('hero.cta2')}
                </Link>
              </div>

              <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] py-4 shadow-2xl shadow-black/20 backdrop-blur">
                <div
                  className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 rounded-s-3xl bg-gradient-to-r from-[#070b18] via-[#070b18]/80 to-transparent sm:w-28"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 rounded-e-3xl bg-gradient-to-l from-[#070b18] via-[#070b18]/80 to-transparent sm:w-28"
                  aria-hidden="true"
                />

                <div className="overflow-hidden" dir="ltr">
                  <div className="flex w-max animate-marquee gap-4 px-4 motion-reduce:animate-none sm:gap-5 hover:[animation-play-state:paused]">
                    {marqueeItems.map((template, index) => (
                      <a
                        key={`${template.templateName}-${index}`}
                        href={templatePreviewUrl(template.templateName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-52 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.055] shadow-lg shadow-black/20 ring-1 ring-white/[0.03] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.075] hover:shadow-xl hover:shadow-violet-950/25 sm:w-60"
                      >
                        <TemplatePreviewImage
                          src={template.image}
                          alt={prettyTemplateName(template.templateName, lang)}
                          className="h-32 w-full sm:h-36"
                        />
                        <div className="border-t border-white/10 bg-black/10 px-4 py-3 text-center">
                          <h3 className="truncate font-heading text-sm font-semibold tracking-[-0.01em] text-white transition group-hover:text-violet-200">
                            {prettyTemplateName(template.templateName, lang)}
                          </h3>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
