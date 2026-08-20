import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header, HeroParallax } from '@/components/ui/hero-parallax';
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import {
  prettyTemplateName,
  showcaseTemplates,
  templatePreviewUrl,
  templateThumbnailUrl,
} from '@/lib/templateCatalogView';

const TemplateShowcaseSection = () => {
  const { lang, t } = useLanguage();
  const isMobile = useIsMobileViewport();
  const thumbWidth = isMobile ? 480 : 800;

  const products = useMemo(
    () =>
      showcaseTemplates.slice(0, 15).map((template) => ({
        title: prettyTemplateName(template.templateName, lang),
        link: templatePreviewUrl(template.templateName),
        thumbnail: templateThumbnailUrl(template.image, thumbWidth),
      })),
    [lang, thumbWidth],
  );

  return (
    <section className="relative overflow-hidden border-y border-border bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_55%)]"
        aria-hidden
      />
      <HeroParallax
        products={products}
        header={
          <Header
            title={
              <>
                <span className="block text-sm font-bold uppercase tracking-[0.2em] text-primary md:text-base">
                  {t('templateShowcase.kicker')}
                </span>
                <span className="mt-3 block">{t('templateShowcase.title')}</span>
              </>
            }
            subtitle={t('templateShowcase.subtitle')}
          />
        }
      />
    </section>
  );
};

export default TemplateShowcaseSection;
