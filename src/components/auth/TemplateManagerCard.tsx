import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

type TemplateManagerCardProps = {
  currentTemplateName?: string | null;
};

const TemplateManagerCard = ({ currentTemplateName }: TemplateManagerCardProps) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="glass-strong rounded-3xl p-6 glow-border">
      <h3 className="font-heading text-xl font-semibold text-foreground">{isAr ? 'القالب' : 'Template'}</h3>
      <p className="text-sm text-muted-foreground mt-1">{isAr ? 'القالب الحالي وإجراء التبديل السريع.' : 'Current template and quick switch action.'}</p>
      <div className="mt-4 glass rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2">{isAr ? 'اسم القالب الحالي' : 'Current template name'}</p>
        <p className="font-medium">{currentTemplateName || (isAr ? 'لم يتم الاختيار بعد' : 'Not selected yet')}</p>
      </div>
      <Link
        to="/templates"
        className="mt-4 inline-flex items-center justify-center w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm"
      >
        {isAr ? 'تغيير القالب' : 'Change template'}
      </Link>
    </div>
  );
};

export default TemplateManagerCard;

