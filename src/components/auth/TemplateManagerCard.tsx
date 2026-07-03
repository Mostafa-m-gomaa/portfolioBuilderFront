import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { primaryButtonFullClass } from '@/lib/buttonStyles';

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
        to="/template-selector"
        className={cn(primaryButtonFullClass, 'mt-4')}
      >
        {isAr ? 'تغيير القالب' : 'Change template'}
      </Link>
    </div>
  );
};

export default TemplateManagerCard;

