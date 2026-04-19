import { motion } from 'framer-motion';
import { usePortfolioActions } from '@/hooks/usePortfolio';
import { useLanguage } from '@/contexts/LanguageContext';

type LanguageMode = 'ar' | 'en' | 'both';

type LanguageModeCardProps = {
  currentLanguageMode?: string | null;
  currentDefaultLanguage?: string | null;
  onSuccess?: () => void;
};

const LanguageModeCard = ({ currentLanguageMode, currentDefaultLanguage, onSuccess }: LanguageModeCardProps) => {
  const { lang } = useLanguage();
  const { updateLanguageModeMutation, updateDefaultLanguageMutation } = usePortfolioActions();
  const isAr = lang === 'ar';

  const handleSelect = async (mode: LanguageMode) => {
    if (mode === currentLanguageMode) return;
    try {
      await updateLanguageModeMutation.mutateAsync(mode);
      onSuccess?.();
    } catch {
      // Errors are handled in mutation hook.
    }
  };

  const options: Array<{ value: LanguageMode; title: string; desc: string }> = [
    { value: 'en', title: isAr ? 'الإنجليزية' : 'English', desc: isAr ? 'الإنجليزية فقط' : 'English only' },
    { value: 'ar', title: isAr ? 'العربية' : 'Arabic', desc: isAr ? 'العربية فقط' : 'Arabic only' },
    { value: 'both', title: isAr ? 'الاثنان' : 'Both', desc: isAr ? 'العربية + الإنجليزية' : 'Arabic + English' },
  ];

  const handleDefaultSelect = async (language: 'ar' | 'en') => {
    if (currentLanguageMode !== 'both') return;
    if (currentDefaultLanguage === language) return;
    try {
      await updateDefaultLanguageMutation.mutateAsync(language);
      onSuccess?.();
    } catch {
      // Errors are handled in mutation hook.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">{isAr ? 'وضع اللغة' : 'Language mode'}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        {isAr ? 'اختر كيفية عرض محتوى البورتفوليو.' : 'Select how your portfolio content is shown.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = currentLanguageMode === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={updateLanguageModeMutation.isPending}
              className={`rounded-2xl px-3 py-3 text-start transition-colors disabled:opacity-60 ${
                isSelected
                  ? 'gradient-bg text-primary-foreground'
                  : 'glass text-foreground hover:bg-foreground/5'
              }`}
            >
              <p className="text-sm font-semibold">{option.title}</p>
              <p className={`text-xs mt-1 ${isSelected ? 'text-primary-foreground/85' : 'text-muted-foreground'}`}>
                {option.desc}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        {isAr ? 'الحالي:' : 'Current:'} {currentLanguageMode || (isAr ? 'لم يتم الاختيار بعد' : 'Not selected yet')}
      </p>
      {currentLanguageMode === 'both' && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">{isAr ? 'لغة العرض الافتراضية' : 'Default display language'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleDefaultSelect('ar')}
              disabled={updateDefaultLanguageMutation.isPending}
              className={`rounded-xl px-3 py-2 text-start transition-colors disabled:opacity-60 ${
                currentDefaultLanguage === 'ar'
                  ? 'gradient-bg text-primary-foreground'
                  : 'glass text-foreground hover:bg-foreground/5'
              }`}
            >
              {isAr ? 'العربية (ar)' : 'Arabic (ar)'}
            </button>
            <button
              onClick={() => handleDefaultSelect('en')}
              disabled={updateDefaultLanguageMutation.isPending}
              className={`rounded-xl px-3 py-2 text-start transition-colors disabled:opacity-60 ${
                currentDefaultLanguage === 'en'
                  ? 'gradient-bg text-primary-foreground'
                  : 'glass text-foreground hover:bg-foreground/5'
              }`}
            >
              {isAr ? 'الإنجليزية (en)' : 'English (en)'}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isAr ? 'الافتراضي الحالي:' : 'Current default:'} {currentDefaultLanguage || (isAr ? 'لم يتم الاختيار بعد' : 'Not selected yet')}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LanguageModeCard;

