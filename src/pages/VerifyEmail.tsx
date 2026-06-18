import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { getPostAuthEntryPath, needsSubscriptionOnboarding } from '@/lib/authRouting';
import { isUserEmailVerified } from '@/lib/authVerification';
import { startPackageCheckout } from '@/lib/startPackageCheckout';
import { useAuthStore } from '@/store/auth.store';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import { getEmailValidationError, normalizeEmail } from '@/lib/emailValidation';
import { subscriptionsService } from '@/services/subscriptions.service';

const RESEND_COOLDOWN_SECONDS = 30;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { pendingEmail, verifyEmailMutation, resendVerificationMutation, isAuthenticated, user } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const emailRef = useRef<EmailInputHandle>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

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
      let resolvedSubscriptionStatus: string | null | undefined = u?.subscriptionStatus;
      try {
        const summary = await queryClient.fetchQuery({
          queryKey: ['subscription-summary'],
          queryFn: () => subscriptionsService.getMeSummary(),
          staleTime: 30_000,
        });
        resolvedSubscriptionStatus = summary.subscriptionStatus;
      } catch {
        // If the summary is unavailable, fall back to the auth snapshot.
      }
      const resolvedUser = u
        ? {
            ...u,
            subscriptionStatus: resolvedSubscriptionStatus ?? u.subscriptionStatus ?? null,
          }
        : u;
      const pendingPkg =
        typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem('pending_checkout_package_id')
          : null;
      if (pendingPkg && resolvedUser && !needsSubscriptionOnboarding(resolvedUser)) {
        const navigated = await startPackageCheckout(
          pendingPkg,
          t('payment.checkoutError'),
        );
        if (navigated) {
          sessionStorage.removeItem('pending_checkout_package_id');
          return;
        }
      }
      navigate(getPostAuthEntryPath(resolvedUser));
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
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  };

  if (isAuthenticated && isUserEmailVerified(user)) {
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

          <div className="mt-4 flex items-center justify-between gap-4 text-sm">
            {resendCooldown > 0 ? (
              <p className="text-muted-foreground">
                {t('auth.verify.resendIn').replace('{seconds}', String(resendCooldown))}
              </p>
            ) : (
              <button
                type="button"
                onClick={onResend}
                disabled={resendVerificationMutation.isPending || !email}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {resendVerificationMutation.isPending ? t('auth.verify.resending') : t('auth.verify.resend')}
              </button>
            )}
            <Link to="/login" className="shrink-0 text-muted-foreground hover:text-foreground">
              {t('auth.verify.backLogin')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
