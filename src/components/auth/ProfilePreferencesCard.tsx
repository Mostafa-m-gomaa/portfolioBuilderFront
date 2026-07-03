import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { COUNTRY_OPTIONS, sortCountriesForDisplay } from '@/constants/countries';
import {
  defaultProfileCurrency,
  isProfileCurrencyCode,
  PROFILE_CURRENCY_OPTIONS,
  type ProfileCurrencyCode,
} from '@/constants/profileCurrencies';
import { primaryButtonFullClass } from '@/lib/buttonStyles';

type ProfilePreferencesCardProps = {
  currentCountry?: string | null;
  currentCurrency?: string | null;
  currentAllowWhatsapp?: boolean;
  currentWhatsApp?: string | null;
  currentWhatsapp?: string | null;
};

const digitsOnly = (value: string) => value.replace(/\D/g, '');

const normalizeLocalPhoneDigits = (value: string) => {
  const raw = digitsOnly(value);
  return raw.replace(/^0+/, '');
};

const parseWhatsAppUrlToPhone = (value: string | null | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  let digits = '';
  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    if (host.includes('whatsapp.com')) {
      const phoneParam = url.searchParams.get('phone');
      if (phoneParam) digits = digitsOnly(phoneParam);
    }
    if (!digits && (host === 'wa.me' || host === 'www.wa.me')) {
      digits = digitsOnly(url.pathname);
    }
  } catch {
    // Not a URL, fallback to extracting digits.
    digits = digitsOnly(trimmed);
  }

  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);

  const candidates = [...COUNTRY_OPTIONS]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .filter((c) => digits.startsWith(c.dialCode));

  const matched = candidates[0];
  if (!matched) return null;

  const local = digits.slice(matched.dialCode.length);
  return {
    countryIso2: matched.iso2,
    localNumber: local,
  };
};

const ProfilePreferencesCard = ({
  currentCountry,
  currentCurrency,
  currentAllowWhatsapp = false,
  currentWhatsApp,
  currentWhatsapp,
}: ProfilePreferencesCardProps) => {
  const { updateProfileMutation } = useAuth();
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  const defaultCurrency = useMemo(
    () =>
      currentCurrency && isProfileCurrencyCode(currentCurrency)
        ? currentCurrency
        : defaultProfileCurrency(),
    [currentCurrency],
  );

  const existingWhatsappValue = useMemo(
    () => (currentWhatsApp || currentWhatsapp || '').trim(),
    [currentWhatsApp, currentWhatsapp],
  );
  const parsedWhatsapp = useMemo(
    () => parseWhatsAppUrlToPhone(existingWhatsappValue),
    [existingWhatsappValue],
  );

  const [country, setCountry] = useState(() => {
    const code = String(currentCountry ?? '').toUpperCase();
    return COUNTRY_OPTIONS.some((c) => c.iso2 === code) ? code : 'EG';
  });
  const [currency, setCurrency] = useState<ProfileCurrencyCode>(defaultCurrency);
  const [allowWhatsapp, setAllowWhatsapp] = useState(Boolean(currentAllowWhatsapp));
  const [whatsappCountry, setWhatsappCountry] = useState<string>(parsedWhatsapp?.countryIso2 || 'EG');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(parsedWhatsapp?.localNumber || '');
  const [validationError, setValidationError] = useState('');

  const sortedCountries = useMemo(() => sortCountriesForDisplay(lang), [lang]);

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.iso2 === whatsappCountry) || COUNTRY_OPTIONS[0],
    [whatsappCountry],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    const normalizedNumber = normalizeLocalPhoneDigits(whatsappNumber);
    if (allowWhatsapp) {
      if (!whatsappCountry) {
        setValidationError(isAr ? 'يرجى اختيار الدولة.' : 'Please select a country.');
        return;
      }
      if (!normalizedNumber) {
        setValidationError(isAr ? 'يرجى إضافة رقم الموبايل.' : 'Please enter your phone number.');
        return;
      }
      if (normalizedNumber.length < 6 || normalizedNumber.length > 15) {
        setValidationError(isAr ? 'يرجى إدخال رقم موبايل صحيح.' : 'Please enter a valid phone number.');
        return;
      }
    }

    const whatsappLink = allowWhatsapp
      ? `https://wa.me/${selectedCountry.dialCode}${normalizedNumber}`
      : '';

    try {
      await updateProfileMutation.mutateAsync({
        country,
        currency,
        allowWhatsapp,
        whatsapp: whatsappLink,
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
          <label className="block text-sm mb-2 text-muted-foreground">{t('auth.country')}</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
          >
            {sortedCountries.map((option) => (
              <option key={option.iso2} value={option.iso2}>
                {isAr ? option.nameAr : option.nameEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2 text-muted-foreground">{isAr ? 'عملة العرض' : 'Display currency'}</label>
          <select
            value={currency}
            onChange={(e) => {
              const next = e.target.value;
              if (isProfileCurrencyCode(next)) setCurrency(next);
            }}
            className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
          >
            {PROFILE_CURRENCY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="glass rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{isAr ? 'تفعيل زر واتساب العائم' : 'Allow WhatsApp Floating Button'}</p>
            <p className="text-xs text-muted-foreground">{isAr ? 'فعّل هذا الخيار لإظهار زر واتساب يفتح محادثة مباشرة.' : 'Enable this to show a WhatsApp button that opens a chat.'}</p>
          </div>
          <Switch checked={allowWhatsapp} onCheckedChange={setAllowWhatsapp} />
        </div>

        {allowWhatsapp && (
          <div>
            <label className="block text-sm mb-2 text-muted-foreground">{isAr ? 'الدولة' : 'Country'}</label>
            <select
              value={whatsappCountry}
              onChange={(e) => setWhatsappCountry(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
            >
              {sortedCountries.map((option) => (
                <option key={option.iso2} value={option.iso2}>
                  {isAr ? option.nameAr : option.nameEn} (+{option.dialCode})
                </option>
              ))}
            </select>

            <label className="block text-sm mb-2 text-muted-foreground mt-3">{isAr ? 'رقم الموبايل' : 'Phone number'}</label>
            <input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder={isAr ? 'مثال: 01234567890' : 'e.g. 01234567890'}
              inputMode="tel"
              className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
            />
          </div>
        )}

        {validationError && <p className="text-xs text-destructive">{validationError}</p>}

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className={primaryButtonFullClass}
        >
          {updateProfileMutation.isPending ? (isAr ? 'جار الحفظ...' : 'Saving...') : isAr ? 'حفظ التفضيلات' : 'Save preferences'}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfilePreferencesCard;
