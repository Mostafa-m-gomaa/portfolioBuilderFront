import { parseApiError } from '@/api/axios';

/** True when login failed because the account email is not verified yet. */
export const isEmailNotVerifiedLoginError = (error: unknown): boolean => {
  const msg = parseApiError(error, '').toLowerCase();
  if (!msg) return false;
  const needles = [
    'verify your account',
    'verify your email',
    'please verify',
    'email not verified',
    'not verified',
    'unverified',
    'must verify',
    'verification required',
    'account first',
    // Arabic API messages (optional)
    'تحقق من',
    'تأكيد البريد',
    'تفعيل الحساب',
    'التحقق من البريد',
    'لم يتم التحقق',
  ];
  return needles.some((n) => msg.includes(n));
};
