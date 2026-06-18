import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useSubdomainAvailability } from '@/hooks/useAuth';
import { sanitizeSubdomainPart } from '@/lib/customDomain';
import { useLanguage } from '@/contexts/LanguageContext';

const sanitizeSubdomain = sanitizeSubdomainPart;

type SubdomainManagerCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  currentSubdomain?: string | null;
  onSuccess?: () => void;
};

const SubdomainManagerCard = ({
  title,
  description,
  buttonLabel,
  currentSubdomain,
  onSuccess,
}: SubdomainManagerCardProps) => {
  const { updateSubdomainMutation } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [subdomain, setSubdomain] = useState(currentSubdomain || '');
  const cleanSubdomain = useMemo(() => sanitizeSubdomain(subdomain), [subdomain]);
  const cleanCurrentSubdomain = useMemo(() => sanitizeSubdomain(currentSubdomain || ''), [currentSubdomain]);
  const availability = useSubdomainAvailability(cleanSubdomain);

  const isChecking = availability.isFetching;
  const isAvailable = availability.data?.available === true;
  const isCurrentSubdomain = cleanSubdomain.length >= 3 && cleanSubdomain === cleanCurrentSubdomain;
  const hasChanged = cleanSubdomain !== cleanCurrentSubdomain;
  const canUpdate = cleanSubdomain.length >= 3 && isAvailable && hasChanged;

  const availabilityText =
    cleanSubdomain.length === 0
      ? isAr
        ? 'اكتب الدومين الفرعي للتحقق من التوفر.'
        : 'Type your subdomain to check availability.'
      : cleanSubdomain.length < 3
        ? isAr
          ? 'الحد الأدنى 3 أحرف.'
          : 'Minimum 3 characters.'
        : isCurrentSubdomain
          ? isAr
            ? 'هذا هو الدومين الفرعي الحالي.'
            : 'This is your current subdomain.'
          : isChecking
            ? isAr
              ? 'جار التحقق من التوفر...'
              : 'Checking availability...'
            : isAvailable
              ? isAr
                ? 'متاح. يمكنك استخدام هذا الدومين الفرعي.'
                : 'Available. You can use this subdomain.'
              : isAr
                ? 'غير متاح. جرّب اسما آخر.'
                : 'Unavailable. Try another one.';

  const availabilityClassName =
    cleanSubdomain.length < 3 || isChecking
      ? 'text-muted-foreground'
      : isCurrentSubdomain
        ? 'text-emerald-500'
        : isAvailable
          ? 'text-emerald-500'
          : 'text-destructive';

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canUpdate) return;
    try {
      await updateSubdomainMutation.mutateAsync({ subdomain: cleanSubdomain });
      onSuccess?.();
    } catch {
      // Error handled in mutation hook.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-muted-foreground">{isAr ? 'الدومين الفرعي' : 'Subdomain'}</label>
          <div className={`glass rounded-xl px-3 py-2 flex ${isAr ? 'flex-row-reverse' : 'flex-row'} items-center gap-1`}>
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(sanitizeSubdomain(e.target.value))}
              placeholder={isAr ? 'اسمك' : 'yourname'}
              className="bg-transparent flex-1 text-sm focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">{isAr ? 'getsirty.com' : 'getsirty.com'}</span>
          </div>
          <p className={`text-xs mt-2 ${availabilityClassName}`}>{availabilityText}</p>
          {currentSubdomain && (
            <p className="text-xs mt-1 text-muted-foreground">{isAr ? 'الحالي:' : 'Current:'} {currentSubdomain}</p>
          )}
        </div>

        {canUpdate && (
          <button
            disabled={updateSubdomainMutation.isPending}
            className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
          >
            {updateSubdomainMutation.isPending ? (isAr ? 'جار الحفظ...' : 'Saving...') : buttonLabel}
          </button>
        )}
      </form>
    </motion.div>
  );
};

export default SubdomainManagerCard;

