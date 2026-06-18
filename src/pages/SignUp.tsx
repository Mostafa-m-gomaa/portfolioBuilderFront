import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { portfolioService } from '@/services/portfolio.service';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUser } from '@/types/auth.types';
import {
  getPostAuthEntryPath,
  isConfiguredSubdomain,
  needsSubscriptionOnboarding,
} from '@/lib/authRouting';
import anotherLogo from '@/assets/anotherLogo.png';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
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
  const { registerMutation, googleAuthMutation, isAuthenticated, user } = useAuth();
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

  const handleGoogleAuth = async () => {
    const idToken = window.prompt('Paste Google ID token');
    if (!idToken) return;
    try {
      const result = await googleAuthMutation.mutateAsync({
        idToken,
        type,
        ...(country ? { country } : {}),
      });
      const authUser = result.user ?? useAuthStore.getState().user;
      trackCompleteRegistration();
      await continueAfterAuth(authUser);
    } catch {
      // Error toast handled in mutation hook.
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

          {/* <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleAuthMutation.isPending}
            className="w-full glass rounded-xl py-3 text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-foreground/5 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            {googleAuthMutation.isPending ? 'Connecting...' : t('auth.google')}
          </button> */}
          {/* 
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('auth.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div> */}

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
