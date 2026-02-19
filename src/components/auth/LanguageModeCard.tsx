import { motion } from 'framer-motion';
import { usePortfolioActions } from '@/hooks/usePortfolio';

type LanguageMode = 'ar' | 'en' | 'both';

type LanguageModeCardProps = {
  currentLanguageMode?: string | null;
  onSuccess?: () => void;
};

const LanguageModeCard = ({ currentLanguageMode, onSuccess }: LanguageModeCardProps) => {
  const { updateLanguageModeMutation } = usePortfolioActions();

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
    { value: 'en', title: 'English', desc: 'English only' },
    { value: 'ar', title: 'Arabic', desc: 'Arabic only' },
    { value: 'both', title: 'Both', desc: 'Arabic + English' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">Language mode</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Select how your portfolio content is shown.
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
        Current: {currentLanguageMode || 'Not selected yet'}
      </p>
    </motion.div>
  );
};

export default LanguageModeCard;

