import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useMyPortfolio } from '@/hooks/usePortfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  categoryLabel,
  groupedTemplates,
  prettyTemplateName,
  templatePreviewUrl,
} from '@/lib/templateCatalogView';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isAuthenticated, user, updateTemplateNameMutation } = useAuth();
  const { data: portfolio } = useMyPortfolio();
  const currentTemplateName = user?.templateName || String(portfolio?.templateName ?? '');
  const isAr = lang === 'ar';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold">{isAr ? 'اختر القالب' : 'Choose template'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAr ? 'القالب الحالي:' : 'Current template:'} {currentTemplateName || (isAr ? 'لم يتم الاختيار بعد' : 'Not selected yet')}
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="glass px-4 py-2 rounded-xl text-sm">
            {isAr ? 'رجوع' : 'Back'}
          </button>
        </div>

        <Tabs defaultValue={groupedTemplates[0]?.category} className="space-y-4">
          <TabsList className="h-auto flex w-full flex-wrap justify-start gap-2 rounded-2xl bg-transparent p-0">
            {groupedTemplates.map((group) => (
              <TabsTrigger
                key={group.category}
                value={group.category}
                className="glass rounded-xl px-4 py-2 text-sm data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
              >
                {categoryLabel(group.category, isAr)}
              </TabsTrigger>
            ))}
          </TabsList>

          {groupedTemplates.map((group) => (
            <TabsContent key={group.category} value={group.category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.templates.map((template) => {
                  const isActive = template.templateName === currentTemplateName;
                  return (
                    <article key={template.templateName} className="glass-strong rounded-2xl p-4 glow-border">
                      <img
                        src={template.image}
                        alt={template.templateName}
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <h2 className="font-semibold mt-3">{prettyTemplateName(template.templateName)}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isAr ? `قالب ${prettyTemplateName(template.templateName)} مناسب لفئة ${categoryLabel(group.category, isAr)}.` : template.desc}
                      </p>
                      <div className="mt-4 grid grid-cols-1 gap-2">
                        <a
                          href={templatePreviewUrl(template.templateName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full glass py-2.5 rounded-xl text-center text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {isAr ? 'عرض القالب' : 'View template'}
                        </a>
                        <button
                          onClick={() => updateTemplateNameMutation.mutate(template.templateName)}
                          disabled={updateTemplateNameMutation.isPending || isActive}
                          className="w-full gradient-bg py-2.5 rounded-xl text-primary-foreground text-sm font-semibold disabled:opacity-60"
                        >
                          {isActive
                            ? isAr
                              ? 'القالب مفعّل'
                              : 'Active template'
                            : isAr
                              ? 'تفعيل هذا القالب'
                              : 'Activate this template'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default TemplateSelector;

