import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { portfolioService } from '@/services/portfolio.service';
import type { AuthUser } from '@/types/auth.types';
import {
  getPostAuthEntryPath,
  isConfiguredSubdomain,
  needsSubscriptionOnboarding,
} from '@/lib/authRouting';
import anotherLogo from '@/assets/anotherLogo.png';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { isGoogleAuthConfigured } from '@/lib/googleAuth';
import { normalizeEmail } from '@/lib/emailValidation';
import { trackCompleteRegistration } from '@/lib/metaPixel';
import {
  ACCOUNT_TYPE_OPTIONS,
  type AccountTypeValue,
} from '@/constants/accountTypes';
import { COUNTRY_OPTIONS, sortCountriesForDisplay } from '@/constants/countries';

const SignUp = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const { registerMutation, isAuthenticated, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<AccountTypeValue>('freelancer');
  const [country, setCountry] = useState('EG');
  const [searchParams] = useSearchParams();
  const sortedCountries = useMemo(() => sortCountriesForDisplay(lang), [lang]);
  const emailRef = useRef<EmailInputHandle>(null);

  useEffect(() => {
    const id = searchParams.get('packageId');
    if (id) sessionStorage.setItem('pending_checkout_package_id', id);
  }, [searchParams]);

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

  const { handleGoogleCredential, handleGoogleError, isPending: isGooglePending } =
    useGoogleSignIn({
      onAuthenticated: async (authUser) => {
        trackCompleteRegistration();
        await continueAfterAuth(authUser);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current?.validate()) return;
    if (!country) return;
    const normalizedEmail = normalizeEmail(email);
    try {
      await registerMutation.mutateAsync({
        name,
        email: normalizedEmail,
        password,
        country,
        type,
      });
      trackCompleteRegistration();
      navigate('/verify-email', { state: { email: normalizedEmail } });
    } catch {
      // Error toast is handled in the mutation.
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
          <div className="floating-orb end-0 top-0 h-48 w-48 bg-secondary/20 sm:h-72 sm:w-72" />
          <div
            className="floating-orb start-0 bottom-0 h-40 w-40 bg-accent/15 sm:h-56 sm:w-56"
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
            <h1 className="font-heading text-2xl font-bold text-foreground">{t('auth.signup')}</h1>
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
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent shadow-sm dark:shadow-none dark:bg-transparent bg-card/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t('auth.country')}</label>
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
              >
                {sortedCountries.map((option) => (
                  <option key={option.iso2} value={option.iso2}>
                    {isAr ? option.nameAr : option.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.accountType')}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccountTypeValue)}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
              >
                {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {isAr ? opt.labelAr : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>
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
            <button
              disabled={registerMutation.isPending}
              className="w-full gradient-bg-full py-3 rounded-xl text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {registerMutation.isPending ? t('auth.creatingAccount') : t('auth.signup')}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">{t('auth.login')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
