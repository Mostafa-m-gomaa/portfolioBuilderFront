import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { isEmailNotVerifiedLoginError } from '@/lib/authErrors';
import { getPostAuthEntryPath, isConfiguredSubdomain, needsSubscriptionOnboarding } from '@/lib/authRouting';
import { isUserEmailVerified, prepareEmailVerificationFlow } from '@/lib/authVerification';
import { startPackageCheckout } from '@/lib/startPackageCheckout';
import { portfolioService } from '@/services/portfolio.service';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUser } from '@/types/auth.types';
import anotherLogo from '@/assets/anotherLogo.png';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { isGoogleAuthConfigured } from '@/lib/googleAuth';
import { normalizeEmail } from '@/lib/emailValidation';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const {
    loginMutation,
    resendVerificationMutation,
    setPendingEmail,
    isAuthenticated,
    user,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const emailRef = useRef<EmailInputHandle>(null);

  const resolvePortfolioOnboardingRoute = async (subdomain?: string | null) => {
    if (!isConfiguredSubdomain(subdomain)) {
      navigate('/choose-subdomain');
      return;
    }
    try {
      try {
        await portfolioService.getMyPortfolio();
      } catch {
        await portfolioService.createPortfolio();
      }
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    }
  };

  const continueAfterAuth = async (authUser?: AuthUser | null) => {
    if (needsSubscriptionOnboarding(authUser)) {
      navigate('/select-subscription');
      return;
    }
    await resolvePortfolioOnboardingRoute(authUser?.subdomain);
  };

  const goToVerifyWithResend = async (targetEmail: string) => {
    const normalized = await prepareEmailVerificationFlow(targetEmail, {
      setPendingEmail,
      resendVerification: (email) => resendVerificationMutation.mutateAsync({ email }),
    });
    navigate('/verify-email', { state: { email: normalized } });
  };

  const handleUnverifiedLogin = async (targetEmail: string) => {
    await goToVerifyWithResend(targetEmail);
  };

  const tryRedirectToPendingCheckout = async (
    authUser: AuthUser | null | undefined,
  ): Promise<boolean> => {
    const pendingPkg =
      searchParams.get('packageId') ??
      (typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem('pending_checkout_package_id')
        : null);
    if (!pendingPkg || needsSubscriptionOnboarding(authUser)) return false;
    const navigated = await startPackageCheckout(
      pendingPkg,
      t('payment.checkoutError'),
    );
    if (navigated) sessionStorage.removeItem('pending_checkout_package_id');
    return navigated;
  };

  const { handleGoogleCredential, handleGoogleError, isPending: isGooglePending } =
    useGoogleSignIn({
      onAuthenticated: async (authUser) => {
        if (await tryRedirectToPendingCheckout(authUser)) return;
        await continueAfterAuth(authUser);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current?.validate()) return;
    const normalizedEmail = normalizeEmail(email);
    try {
      const result = await loginMutation.mutateAsync({ email: normalizedEmail, password });
      const authUser = result.user ?? useAuthStore.getState().user;
      if (result.token && authUser && !isUserEmailVerified(authUser)) {
        await handleUnverifiedLogin(normalizedEmail);
        return;
      }
      if (result.token) {
        if (await tryRedirectToPendingCheckout(authUser)) return;
        await continueAfterAuth(authUser);
      } else {
        await goToVerifyWithResend(normalizedEmail);
      }
    } catch (err) {
      if (isEmailNotVerifiedLoginError(err)) {
        await handleUnverifiedLogin(normalizedEmail);
        return;
      }
      // Other errors: toast handled in loginMutation onError.
    }
  };

  if (isAuthenticated) {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <div className="relative flex min-h-screen w-full max-w-full items-center justify-center overflow-x-clip px-6 pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="floating-orb start-0 top-0 h-48 w-48 bg-primary/20 sm:h-72 sm:w-72" />
          <div
            className="floating-orb end-0 bottom-0 h-40 w-40 bg-secondary/15 sm:h-56 sm:w-56"
            style={{ animation: 'float-delayed 10s ease-in-out infinite' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md relative z-10 glow-border"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <div className="rounded-full p-2 shadow-md dark:shadow-none dark:bg-transparent bg-gradient-to-br from-slate-800/80 to-slate-600/60">
                <img src={anotherLogo} alt={t('brand.logoAlt')} className="w-16 h-16 object-contain" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{t('auth.login')}</h1>
          </div>

          {isGoogleAuthConfigured() && (
            <>
              <GoogleSignInButton
                disabled={isGooglePending}
                onSuccess={handleGoogleCredential}
                onError={handleGoogleError}
              />

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{t('auth.or')}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.email')}</label>
              <EmailInput
                ref={emailRef}
                required
                value={email}
                onChange={setEmail}
                placeholder={t('auth.placeholderEmail')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.password')}</label>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.placeholderPassword')}
              />
            </div>
            <div className="text-end">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <button
              disabled={loginMutation.isPending}
              className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {loginMutation.isPending ? t('auth.loggingIn') : t('auth.login')}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link
              to={
                searchParams.get('packageId')
                  ? `/signup?packageId=${encodeURIComponent(searchParams.get('packageId')!)}`
                  : '/signup'
              }
              className="text-primary hover:underline font-medium"
            >
              {t('auth.signup')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
