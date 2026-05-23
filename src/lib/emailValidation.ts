import { VALID_EMAIL_TLDS } from '@/lib/emailValidTlds';

/** Practical email format check (not DNS/MX verification). */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

const getEmailDomain = (email: string) => {
  const at = email.lastIndexOf('@');
  if (at < 1 || at === email.length - 1) return null;
  return email.slice(at + 1);
};

/** Rightmost label must be a real ICANN TLD (rejects typos like .comm, .con). */
export const hasValidEmailTld = (email: string) => {
  const domain = getEmailDomain(email);
  if (!domain) return false;

  const labels = domain.split('.').filter(Boolean);
  if (labels.length < 2) return false;

  const tld = labels[labels.length - 1]!.toLowerCase();
  return VALID_EMAIL_TLDS.has(tld);
};

export const isValidEmail = (value: string) => {
  const email = normalizeEmail(value);
  if (!email || email.length > 254) return false;
  if (!EMAIL_REGEX.test(email)) return false;
  return hasValidEmailTld(email);
};

export const getEmailValidationError = (
  value: string,
  t: (key: string) => string,
): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return t('auth.emailRequired');
  if (!isValidEmail(trimmed)) return t('auth.emailInvalid');
  return null;
};
