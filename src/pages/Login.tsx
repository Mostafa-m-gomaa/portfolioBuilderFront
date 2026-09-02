import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { isEmailNotVerifiedLoginError } from '@/lib/authErrors';
import { getPostAuthEntryPath } from '@/lib/authRouting';
import { isUserEmailVerified, prepareEmailVerificationFlow } from '@/lib/authVerification';
import { startPackageCheckout } from '@/lib/startPackageCheckout';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUser } from '@/types/auth.types';
import BrandLogo from '@/components/BrandLogo';
import ColorBendsBackground from '@/components/ColorBendsBackground';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { isGoogleAuthConfigured } from '@/lib/googleAuth';
import { normalizeEmail } from '@/lib/emailValidation';
import { primaryButton } from '@/lib/buttonStyles';

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

  const continueAfterAuth = async (authUser?: AuthUser | null) => {
    navigate(getPostAuthEntryPath(authUser));
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
    if (!pendingPkg) return false;
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
    <div className="relative min-h-screen overflow-x-clip">
      <ColorBendsBackground />
      <Navbar />
      <div className="relative z-10 flex min-h-screen w-full max-w-full items-center justify-center overflow-x-clip px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md relative z-10 glow-border"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <BrandLogo className="h-24 sm:h-28" />
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
              className={primaryButton('w-full')}
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
