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

type CountryOption = {
  iso2: string;
  dialCode: string; // digits only, no +
  nameAr: string;
  nameEn: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { iso2: 'EG', dialCode: '20', nameAr: 'مصر', nameEn: 'Egypt' },
  { iso2: 'SA', dialCode: '966', nameAr: 'السعودية', nameEn: 'Saudi Arabia' },
  { iso2: 'AE', dialCode: '971', nameAr: 'الإمارات', nameEn: 'United Arab Emirates' },
  { iso2: 'KW', dialCode: '965', nameAr: 'الكويت', nameEn: 'Kuwait' },
  { iso2: 'QA', dialCode: '974', nameAr: 'قطر', nameEn: 'Qatar' },
  { iso2: 'BH', dialCode: '973', nameAr: 'البحرين', nameEn: 'Bahrain' },
  { iso2: 'OM', dialCode: '968', nameAr: 'عُمان', nameEn: 'Oman' },
  { iso2: 'JO', dialCode: '962', nameAr: 'الأردن', nameEn: 'Jordan' },
  { iso2: 'LB', dialCode: '961', nameAr: 'لبنان', nameEn: 'Lebanon' },
  { iso2: 'IQ', dialCode: '964', nameAr: 'العراق', nameEn: 'Iraq' },
  { iso2: 'MA', dialCode: '212', nameAr: 'المغرب', nameEn: 'Morocco' },
  { iso2: 'DZ', dialCode: '213', nameAr: 'الجزائر', nameEn: 'Algeria' },
  { iso2: 'TN', dialCode: '216', nameAr: 'تونس', nameEn: 'Tunisia' },
  { iso2: 'LY', dialCode: '218', nameAr: 'ليبيا', nameEn: 'Libya' },
  { iso2: 'SD', dialCode: '249', nameAr: 'السودان', nameEn: 'Sudan' },
  { iso2: 'US', dialCode: '1', nameAr: 'الولايات المتحدة', nameEn: 'United States' },
  { iso2: 'CA', dialCode: '1', nameAr: 'كندا', nameEn: 'Canada' },
  { iso2: 'GB', dialCode: '44', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom' },
  { iso2: 'DE', dialCode: '49', nameAr: 'ألمانيا', nameEn: 'Germany' },
  { iso2: 'FR', dialCode: '33', nameAr: 'فرنسا', nameEn: 'France' },
  { iso2: 'TR', dialCode: '90', nameAr: 'تركيا', nameEn: 'Turkey' },
  { iso2: 'IN', dialCode: '91', nameAr: 'الهند', nameEn: 'India' },
  { iso2: 'PK', dialCode: '92', nameAr: 'باكستان', nameEn: 'Pakistan' },
];

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

  const existingWhatsappValue = useMemo(
    () => (currentWhatsApp || currentWhatsapp || '').trim(),
    [currentWhatsApp, currentWhatsapp],
  );
  const parsedWhatsapp = useMemo(
    () => parseWhatsAppUrlToPhone(existingWhatsappValue),
    [existingWhatsappValue],
  );

  const [currency, setCurrency] = useState(defaultCurrency);
  const [allowWhatsapp, setAllowWhatsapp] = useState(Boolean(currentAllowWhatsapp));
  const [whatsappCountry, setWhatsappCountry] = useState<string>(parsedWhatsapp?.countryIso2 || 'EG');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(parsedWhatsapp?.localNumber || '');
  const [validationError, setValidationError] = useState('');

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
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.iso2} value={country.iso2}>
                  {isAr ? country.nameAr : country.nameEn} (+{country.dialCode})
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
          className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
        >
          {updateProfileMutation.isPending ? (isAr ? 'جار الحفظ...' : 'Saving...') : isAr ? 'حفظ التفضيلات' : 'Save preferences'}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfilePreferencesCard;
