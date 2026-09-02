import { COUNTRY_OPTIONS } from '@/constants/countries';

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const normalizeLocalPhoneDigits = (value: string) => {
  const raw = digitsOnly(value);
  return raw.replace(/^0+/, '');
};

export const parseWhatsAppUrlToPhone = (value: string | null | undefined) => {
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
    digits = digitsOnly(trimmed);
  }

  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);

  const candidates = [...COUNTRY_OPTIONS]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .filter((c) => digits.startsWith(c.dialCode));

  const matched = candidates[0];
  if (!matched) return null;

  return {
    countryIso2: matched.iso2,
    localNumber: digits.slice(matched.dialCode.length),
  };
};

export const buildWhatsAppLink = (dialCode: string, localNumber: string) =>
  `https://wa.me/${dialCode}${normalizeLocalPhoneDigits(localNumber)}`;

export const validateWhatsappNumber = (
  localNumber: string,
  isAr: boolean,
): string | null => {
  const normalized = normalizeLocalPhoneDigits(localNumber);
  if (!normalized) {
    return isAr ? 'يرجى إضافة رقم الواتساب.' : 'Please enter your WhatsApp number.';
  }
  if (normalized.length < 6 || normalized.length > 15) {
    return isAr ? 'يرجى إدخال رقم واتساب صحيح.' : 'Please enter a valid WhatsApp number.';
  }
  return null;
};
