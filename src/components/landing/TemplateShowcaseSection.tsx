import { useLanguage } from '@/contexts/LanguageContext';
import { TemplatePreviewImage } from '@/components/templates/TemplatePreviewImage';
import { prettyTemplateName, showcaseTemplates, templatePreviewUrl } from '@/lib/templateCatalogView';
import { motion } from 'framer-motion';

const TemplateShowcaseSection = () => {
  const { lang, t } = useLanguage();
  const marqueeItems = [...showcaseTemplates, ...showcaseTemplates];

  return (
    <section className="relative overflow-hidden border-y border-border bg-muted/20 py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {t('templateShowcase.kicker')}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">
            {t('templateShowcase.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t('templateShowcase.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-background via-background/80 to-transparent sm:w-28"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-background via-background/80 to-transparent sm:w-28"
          aria-hidden="true"
        />

        <div className="overflow-hidden" dir="ltr">
          <div className="flex w-max animate-marquee gap-5 motion-reduce:animate-none sm:gap-6 hover:[animation-play-state:paused]">
            {marqueeItems.map((template, index) => (
              <a
                key={`${template.templateName}-${index}`}
                href={templatePreviewUrl(template.templateName)}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-64 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-foreground/5 sm:w-72"
              >
                <TemplatePreviewImage
                  src={template.image}
                  alt={prettyTemplateName(template.templateName, lang)}
                  className="h-44 w-full sm:h-48"
                />
                <div className="border-t border-border px-4 py-3 text-center">
                  <h3 className="truncate font-heading text-sm font-semibold text-foreground transition group-hover:text-primary sm:text-base">
                    {prettyTemplateName(template.templateName, lang)}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcaseSection;
