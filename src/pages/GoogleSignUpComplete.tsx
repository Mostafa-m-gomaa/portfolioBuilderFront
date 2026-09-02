import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth, useSubdomainAvailability } from "@/hooks/useAuth";
import type { GoogleSignUpState } from "@/hooks/useGoogleSignIn";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPostAuthEntryPath, markPendingSiteContent, getPostSubdomainOnboardingPath } from "@/lib/authRouting";
import { sanitizeSubdomainPart } from "@/lib/customDomain";
import { useAuthStore } from "@/store/auth.store";
import ColorBendsBackground from "@/components/ColorBendsBackground";
import {
  ACCOUNT_TYPE_OPTIONS,
  type AccountTypeValue,
} from "@/constants/accountTypes";
import { sortCountriesForDisplay } from "@/constants/countries";
import { trackCompleteRegistration } from "@/lib/metaPixel";
import { primaryButton } from "@/lib/buttonStyles";

const GoogleSignUpComplete = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const signupState = location.state as GoogleSignUpState | null;
  const { googleAuthMutation, isAuthenticated, user } = useAuth();
  const [type, setType] = useState<AccountTypeValue>("freelancer");
  const [country, setCountry] = useState("EG");
  const [subdomain, setSubdomain] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const sortedCountries = useMemo(() => sortCountriesForDisplay(lang), [lang]);
  const cleanSubdomain = useMemo(
    () => sanitizeSubdomainPart(subdomain),
    [subdomain],
  );
  const availability = useSubdomainAvailability(cleanSubdomain);
  const isCheckingSubdomain = availability.isFetching;
  const isSubdomainAvailable = availability.data?.available === true;
  const canSubmit =
    cleanSubdomain.length >= 3 && isSubdomainAvailable && !isCheckingSubdomain;

  if (!signupState?.idToken) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  const availabilityText =
    cleanSubdomain.length === 0
      ? t("auth.googleSignup.subdomainHint")
      : cleanSubdomain.length < 3
        ? t("auth.googleSignup.subdomainMin")
        : isCheckingSubdomain
          ? t("auth.googleSignup.subdomainChecking")
          : isSubdomainAvailable
            ? t("auth.googleSignup.subdomainAvailable")
            : t("auth.googleSignup.subdomainUnavailable");

  const availabilityClassName =
    cleanSubdomain.length < 3 || isCheckingSubdomain
      ? "text-muted-foreground"
      : isSubdomainAvailable
        ? "text-emerald-500"
        : "text-destructive";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      const result = await googleAuthMutation.mutateAsync({
        idToken: signupState.idToken,
        type,
        subdomain: cleanSubdomain,
        ...(country ? { country } : {}),
      });
      const authUser = result.user ?? useAuthStore.getState().user;
      trackCompleteRegistration();
      markPendingSiteContent();
      navigate(getPostSubdomainOnboardingPath(authUser));
    } catch {
      // Error toast handled in mutation hook.
    }
  };

  const showGoogleAvatar = Boolean(signupState.picture) && !avatarFailed;

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
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#EEF0FF] shadow-md ring-1 ring-[#1D24CA]/20 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-600/60">
                {showGoogleAvatar ? (
                  <img
                    src={signupState.picture}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setAvatarFailed(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary" aria-hidden />
                )}
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t("auth.googleSignup.title")}
            </h1>
            {signupState.name && (
              <p className="text-sm text-muted-foreground mt-2">
                {signupState.name}
              </p>
            )}
            {signupState.email && (
              <p className="text-sm text-muted-foreground">{signupState.email}</p>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("auth.country")}
              </label>
              <select
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
                {t("auth.accountType")}
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
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("auth.googleSignup.subdomain")}
              </label>
              <div
                className={`glass rounded-xl px-3 py-2 flex ${isAr ? "flex-row-reverse" : "flex-row"} items-center gap-1`}
              >
                <input
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(sanitizeSubdomainPart(e.target.value))
                  }
                  placeholder={isAr ? "اسمك" : "yourname"}
                  required
                  className="bg-transparent flex-1 text-sm focus:outline-none"
                />
                <span className="text-xs text-muted-foreground">getsirty.com</span>
              </div>
              <p className={`text-xs mt-2 ${availabilityClassName}`}>
                {availabilityText}
              </p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || googleAuthMutation.isPending}
              className={primaryButton('w-full')}
            >
              {googleAuthMutation.isPending
                ? t("auth.googleSignup.submitting")
                : t("auth.googleSignup.submit")}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t("auth.googleSignup.backToLogin")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GoogleSignUpComplete;
