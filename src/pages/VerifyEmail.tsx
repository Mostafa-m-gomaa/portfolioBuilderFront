import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { getPostAuthEntryPath, needsSubscriptionOnboarding } from '@/lib/authRouting';
import { startPackageCheckout } from '@/lib/startPackageCheckout';
import { useAuthStore } from '@/store/auth.store';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import { getEmailValidationError, normalizeEmail } from '@/lib/emailValidation';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { pendingEmail, verifyEmailMutation, resendVerificationMutation, isAuthenticated, user } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [code, setCode] = useState('');
  const emailRef = useRef<EmailInputHandle>(null);

  const email = useMemo(() => {
    const raw =
      (location.state as { email?: string } | null)?.email || pendingEmail || emailInput;
    return raw ? normalizeEmail(raw) : '';
  }, [location.state, pendingEmail, emailInput]);

  const onVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingEmail && !emailRef.current?.validate()) return;
    const targetEmail = pendingEmail ? normalizeEmail(pendingEmail) : normalizeEmail(emailInput);
    try {
      await verifyEmailMutation.mutateAsync({ email: targetEmail, code });
      const u = useAuthStore.getState().user;
      const pendingPkg =
        typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem('pending_checkout_package_id')
          : null;
      if (pendingPkg && u && !needsSubscriptionOnboarding(u)) {
        const navigated = await startPackageCheckout(
          pendingPkg,
          t('payment.checkoutError'),
        );
        if (navigated) {
          sessionStorage.removeItem('pending_checkout_package_id');
          return;
        }
      }
      navigate(getPostAuthEntryPath(u));
    } catch {
      // Error toast handled in hook.
    }
  };

  const onResend = async () => {
    const targetEmail = email || normalizeEmail(emailInput);
    if (!targetEmail || getEmailValidationError(targetEmail, t)) {
      emailRef.current?.validate();
      return;
    }
    await resendVerificationMutation.mutateAsync({ email: targetEmail });
  };

  if (isAuthenticated) {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md glow-border"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">{t('auth.verify.title')}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t('auth.verify.subtitle')}</p>

          <form onSubmit={onVerify} className="space-y-4" noValidate>
            {!pendingEmail && (
              <EmailInput
                ref={emailRef}
                required
                value={emailInput}
                onChange={setEmailInput}
                placeholder={t('auth.placeholderEmail')}
              />
            )}
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('auth.verify.codePlaceholder')}
              className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            <button
              disabled={verifyEmailMutation.isPending}
              className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
            >
              {verifyEmailMutation.isPending ? t('auth.verify.submitting') : t('auth.verify.submit')}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={onResend}
              disabled={resendVerificationMutation.isPending || !email}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {resendVerificationMutation.isPending ? t('auth.verify.resending') : t('auth.verify.resend')}
            </button>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              {t('auth.verify.backLogin')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
