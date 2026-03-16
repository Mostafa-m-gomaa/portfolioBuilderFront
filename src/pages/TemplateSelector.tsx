import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useMyPortfolio } from '@/hooks/usePortfolio';
import { templateCatalog } from '@/constants/templateCatalog';

const prettyTemplateName = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const TemplateSelector = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateTemplateNameMutation } = useAuth();
  const { data: portfolio } = useMyPortfolio();
  const currentTemplateName = user?.templateName || String(portfolio?.templateName ?? '');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold">Choose template</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Current template: {currentTemplateName || 'Not selected yet'}
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="glass px-4 py-2 rounded-xl text-sm">
            Back
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templateCatalog.map((template) => {
            const isActive = template.templateName === currentTemplateName;
            return (
              <article key={template.templateName} className="glass-strong rounded-2xl p-4 glow-border">
                <img
                  src={template.image}
                  alt={template.templateName}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h2 className="font-semibold mt-3">{prettyTemplateName(template.templateName)}</h2>
                <p className="text-sm text-muted-foreground mt-1">{template.desc}</p>
                <button
                  onClick={() => updateTemplateNameMutation.mutate(template.templateName)}
                  disabled={updateTemplateNameMutation.isPending || isActive}
                  className="mt-4 w-full gradient-bg py-2.5 rounded-xl text-primary-foreground text-sm font-semibold disabled:opacity-60"
                >
                  {isActive ? 'Active template' : 'Activate this template'}
                </button>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default TemplateSelector;

