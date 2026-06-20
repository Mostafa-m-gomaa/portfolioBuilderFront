import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useMyPortfolio } from '@/hooks/usePortfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  categoryLabel,
  groupedTemplates,
  prettyTemplateName,
  publicTemplateCardDescription,
  templateDescription,
  templatePreviewUrl,
} from '@/lib/templateCatalogView';
import { ArrowUpRight, Eye } from 'lucide-react';
import { TemplatePreviewImage } from '@/components/templates/TemplatePreviewImage';
import { toLatinDigits } from '@/lib/latinDigits';

const PublicTemplates = () => {
  const { lang, t } = useLanguage();
  const { isAuthenticated, user, updateTemplateNameMutation } = useAuth();
  const { data: portfolio } = useMyPortfolio(isAuthenticated);
  const currentTemplateName = user?.templateName || String(portfolio?.templateName ?? '');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="relative overflow-hidden border-b border-border pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34%)]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-3xl text-start">
              <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                {t('templates.library.badge')}
              </span>
              <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                {t('templates.library.title')}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {t('templates.library.subtitle')}
              </p>
              {isAuthenticated ? (
                <p className="mt-4 text-sm font-medium text-foreground">
                  {t('templates.choose.current')}{' '}
                  <span className="text-primary">
                    {currentTemplateName
                      ? prettyTemplateName(currentTemplateName, lang)
                      : t('templates.choose.notSelected')}
                  </span>
                </p>
              ) : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard?tab=template"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {t('dashboard.title')}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {t('templates.library.startSite')}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  {t('templates.library.askTemplate')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-7xl px-6">
          <Tabs defaultValue={groupedTemplates[0]?.category} className="space-y-8">
            <TabsList className="h-auto flex w-full flex-wrap justify-start gap-2 rounded-2xl bg-transparent p-0">
              {groupedTemplates.map((group) => (
                <TabsTrigger
                  key={group.category}
                  value={group.category}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {categoryLabel(group.category, lang)}
                </TabsTrigger>
              ))}
            </TabsList>

            {groupedTemplates.map((group) => (
              <TabsContent key={group.category} value={group.category} className="mt-0">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      {categoryLabel(group.category, lang)}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {toLatinDigits(String(group.templates.length))} {t('templates.library.countSuffix')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.templates.map((template) => {
                    const isActive = template.templateName === currentTemplateName;
                    return (
                    <article
                      key={template.templateName}
                      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5"
                    >
                      <TemplatePreviewImage
                        src={template.image}
                        alt={prettyTemplateName(template.templateName, lang)}
                        className="h-52 w-full"
                      />
                      <div className="p-5">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {prettyTemplateName(template.templateName, lang)}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {lang === 'ar'
                            ? publicTemplateCardDescription(group.category, lang, t)
                            : templateDescription(template, lang)}
                        </p>
                        <div className="mt-5 grid grid-cols-1 gap-2">
                          <a
                            href={templatePreviewUrl(template.templateName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
                          >
                            <Eye className="h-4 w-4" />
                            {t('templates.library.visit')}
                          </a>
                          {isAuthenticated ? (
                            <button
                              type="button"
                              onClick={() => updateTemplateNameMutation.mutate(template.templateName)}
                              disabled={updateTemplateNameMutation.isPending || isActive}
                              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isActive ? t('templates.choose.active') : t('templates.choose.activate')}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PublicTemplates;
