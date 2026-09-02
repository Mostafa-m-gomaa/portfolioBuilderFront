import { useEffect, useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Eye, PencilLine } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ColorBendsBackground from '@/components/ColorBendsBackground';
import RedirectToEmailVerification from '@/components/RedirectToEmailVerification';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useMyPortfolio, usePortfolioBootstrap } from '@/hooks/usePortfolio';
import {
  clearPendingSiteReady,
  isConfiguredSubdomain,
  hasPendingSiteContent,
  SETUP_SITE_CONTENT_PATH,
} from '@/lib/authRouting';
import { isUserEmailVerified } from '@/lib/authVerification';
import { resolvePortfolioSiteContext } from '@/lib/portfolioSiteUrl';
import { primaryButtonMdClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const SiteReady = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const token = useAuthStore((state) => state.token);
  const bootstrapMutation = usePortfolioBootstrap();
  const { data: portfolio } = useMyPortfolio();

  useEffect(() => {
    clearPendingSiteReady();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      bootstrapMutation.mutate();
    }
    // mutate is intentionally omitted to avoid repeated requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const { siteUrl, siteEditorUrl } = useMemo(
    () => resolvePortfolioSiteContext(user, portfolio, token),
    [user?.subdomain, user?.domain, portfolio?.subdomain, portfolio?.domain, token],
  );

  const copySiteLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('onboarding.siteReady.copyLinkSuccess'));
    } catch {
      toast.error(t('onboarding.siteReady.copyLinkError'));
    }
  };

  const openExternalAndGoToDashboard = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    navigate('/dashboard', { replace: true });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email && !isUserEmailVerified(user)) {
    return <RedirectToEmailVerification email={user.email} />;
  }

  if (!isConfiguredSubdomain(user?.subdomain)) {
    return <Navigate to="/choose-subdomain" replace />;
  }

  if (hasPendingSiteContent()) {
    return <Navigate to={SETUP_SITE_CONTENT_PATH} replace />;
  }

  const displaySiteUrl = siteUrl ?? `https://${user?.subdomain}.getsirty.com`;
  const editUrl = siteEditorUrl ?? displaySiteUrl;

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <ColorBendsBackground />
      <Navbar />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong glow-border w-full max-w-xl rounded-3xl p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2
              className="h-9 w-9 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
          </div>

          <h1 className="font-heading text-2xl font-bold leading-snug text-foreground md:text-3xl">
            {t('onboarding.siteReady.title')}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base leading-7 text-muted-foreground">
            {t('onboarding.siteReady.subtitle')}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => openExternalAndGoToDashboard(displaySiteUrl)}
              className={cn(primaryButtonMdClass, 'group w-full max-w-sm')}
            >
              <Eye className="h-4 w-4 shrink-0" aria-hidden />
              {t('onboarding.siteReady.ctaViewSite')}
            </button>

            <p className="text-sm text-muted-foreground">{t('onboarding.siteReady.or')}</p>

            <button
              type="button"
              onClick={() => openExternalAndGoToDashboard(editUrl)}
              className={cn(primaryButtonMdClass, 'group w-full max-w-sm')}
            >
              <PencilLine className="h-4 w-4 shrink-0" aria-hidden />
              {t('onboarding.siteReady.ctaEditSite')}
            </button>

            <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:items-center">
              <a
                href={displaySiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 break-all rounded-xl border border-border bg-background/70 px-3 py-2.5 text-start text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {displaySiteUrl}
              </a>
              <button
                type="button"
                onClick={() => void copySiteLink(displaySiteUrl)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                <Copy className="h-4 w-4 shrink-0" aria-hidden />
                {t('onboarding.siteReady.copyLink')}
              </button>
            </div>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {t('onboarding.siteReady.shareHint')}
            </p>

            <Link
              to="/dashboard"
              className={cn(primaryButtonMdClass, 'mt-2 w-full max-w-sm')}
            >
              {t('onboarding.siteReady.ctaDashboard')}
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SiteReady;
