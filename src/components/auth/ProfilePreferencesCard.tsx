import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

const CURRENCY_OPTIONS = [
  'USD',
  'EUR',
  'GBP',
  'SAR',
  'AED',
  'EGP',
  'KWD',
  'QAR',
] as const;

type ProfilePreferencesCardProps = {
  currentCurrency?: string | null;
  currentAllowWhatsapp?: boolean;
  currentWhatsApp?: string | null;
  currentWhatsapp?: string | null;
};

const isValidWhatsappLink = (value: string) => {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    return host === 'wa.me' || host === 'www.wa.me' || host.endsWith('whatsapp.com');
  } catch {
    return false;
  }
};

const ProfilePreferencesCard = ({
  currentCurrency,
  currentAllowWhatsapp = false,
  currentWhatsApp,
  currentWhatsapp,
}: ProfilePreferencesCardProps) => {
  const { updateProfileMutation } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const defaultCurrency = useMemo(
    () => (currentCurrency && CURRENCY_OPTIONS.includes(currentCurrency as (typeof CURRENCY_OPTIONS)[number]) ? currentCurrency : 'USD'),
    [currentCurrency],
  );

  const [currency, setCurrency] = useState(defaultCurrency);
  const [allowWhatsapp, setAllowWhatsapp] = useState(Boolean(currentAllowWhatsapp));
  const [whatsApp, setWhatsApp] = useState(currentWhatsApp || currentWhatsapp || '');
  const [validationError, setValidationError] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    const trimmedWhatsApp = whatsApp.trim();
    if (allowWhatsapp) {
      if (!trimmedWhatsApp) {
        setValidationError(isAr ? 'يرجى إضافة رابط واتساب.' : 'Please add your WhatsApp link.');
        return;
      }
      if (!isValidWhatsappLink(trimmedWhatsApp)) {
        setValidationError(isAr ? 'يرجى إدخال رابط واتساب صحيح.' : 'Please enter a valid WhatsApp URL.');
        return;
      }
    }

    try {
      await updateProfileMutation.mutateAsync({
        currency,
        allowWhatsapp,
        whatsapp: allowWhatsapp ? trimmedWhatsApp : '',
      });
    } catch {
      // Error handled inside mutation.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">{isAr ? 'تفضيلات الملف الشخصي' : 'Profile Preferences'}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        {isAr ? 'اختر عملة العرض وتحكم في ظهور واتساب.' : 'Choose your display currency and control WhatsApp visibility.'}
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-muted-foreground">{isAr ? 'عملة العرض' : 'Display currency'}</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="glass rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{isAr ? 'تفعيل زر واتساب العائم' : 'Allow WhatsApp Floating Button'}</p>
            <p className="text-xs text-muted-foreground">{isAr ? 'فعّل هذا الخيار لإظهار رابط واتساب قابل للنقر.' : 'Enable this to share a clickable WhatsApp link.'}</p>
          </div>
          <Switch checked={allowWhatsapp} onCheckedChange={setAllowWhatsapp} />
        </div>

        {allowWhatsapp && (
          <div>
            <label className="block text-sm mb-2 text-muted-foreground">{isAr ? 'رابط واتساب' : 'WhatsApp link'}</label>
            <input
              value={whatsApp}
              onChange={(e) => setWhatsApp(e.target.value)}
              placeholder="https://wa.me/201234567890"
              className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
            />
          </div>
        )}

        {validationError && <p className="text-xs text-destructive">{validationError}</p>}

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
        >
          {updateProfileMutation.isPending ? (isAr ? 'جار الحفظ...' : 'Saving...') : isAr ? 'حفظ التفضيلات' : 'Save preferences'}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfilePreferencesCard;
