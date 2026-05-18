import { Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { needsSubscriptionOnboarding } from '@/lib/authRouting';
import { useSubscriptionSummary } from '@/hooks/useSubscriptionSummary';
import SubscriptionSummaryPanel from '@/components/subscription/SubscriptionSummaryPanel';
import { useAllSections, useMyPortfolio, usePortfolioActions, usePortfolioBootstrap } from '@/hooks/usePortfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import LanguageModeCard from '@/components/auth/LanguageModeCard';
import TemplateManagerCard from '@/components/auth/TemplateManagerCard';
import LogoManagerCard from '@/components/auth/LogoManagerCard';
import ProfilePreferencesCard from '@/components/auth/ProfilePreferencesCard';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, t } = useLanguage();
  const bootstrapMutation = usePortfolioBootstrap();
  const { data: portfolio, isLoading: portfolioLoading } = useMyPortfolio();
  const { data: sections, isLoading: sectionsLoading } = useAllSections();
  const { publishMutation, unpublishMutation, setSectionActiveMutation } = usePortfolioActions();
  const { data: subSummary, isFetched: subSumFetched } = useSubscriptionSummary();
  const isAr = lang === 'ar';

  useEffect(() => {
    if (isAuthenticated) {
      bootstrapMutation.mutate();
    }
    // mutate is intentionally omitted to avoid repeated requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (needsSubscriptionOnboarding(user)) {
    if (!subSumFetched) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-6 pt-32 pb-16 text-sm text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
            {t('subscription.summary.syncing')}
          </main>
        </div>
      );
    }
    if (!subSummary || subSummary.subscriptionStatus === 'NOT_DETECTED') {
      return <Navigate to="/select-subscription" replace />;
    }
  }

  const effectiveSubdomain = user?.subdomain || portfolio?.subdomain;
  if (!effectiveSubdomain || effectiveSubdomain.startsWith('temp-')) {
    return <Navigate to="/choose-subdomain" replace />;
  }

  if (!portfolioLoading && !portfolio?.languageMode) {
    return <Navigate to="/select-language-mode" replace />;
  }

  const sectionEntries = Array.isArray(sections)
    ? sections.map((section) => [String(section), { active: false }] as const)
    : Object.entries((sections ?? {}) as Record<string, unknown>).map(([key, value]) => [key, value] as const);

  const freeTrialExpired = subSumFetched && subSummary
    ? subSummary.subscriptionStatus === 'FREE_TRIAL_EXPIRED'
    : user?.subscriptionStatus === 'FREE_TRIAL_EXPIRED';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        {freeTrialExpired ? (
          <div
            role="alert"
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-500/45 bg-amber-500/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:bg-amber-950/25"
          >
            <div className="flex min-w-0 flex-1 gap-3">
              <AlertTriangle
                className="mt-0.5 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-500"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="font-heading font-semibold text-foreground">
                  {t('subscription.banner.freeTrialExpired.title')}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t('subscription.banner.freeTrialExpired.description')}
                </p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:min-w-[10rem]"
            >
              {t('subscription.banner.freeTrialExpired.cta')}
            </Link>
          </div>
        ) : null}
        <SubscriptionSummaryPanel />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">{isAr ? 'لوحة التحكم' : 'Portfolio Dashboard'}</h1>
            <p className="text-muted-foreground text-sm">
              {isAr ? 'مرحبا' : 'Welcome'} {user?.name || user?.email || (isAr ? 'منشئ المحتوى' : 'creator')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="gradient-bg px-4 py-2 rounded-xl text-primary-foreground text-sm disabled:opacity-70"
            >
              {publishMutation.isPending ? (isAr ? 'جار النشر...' : 'Publishing...') : isAr ? 'نشر' : 'Publish'}
            </button>
            <button
              onClick={() => unpublishMutation.mutate()}
              disabled={unpublishMutation.isPending}
              className="glass px-4 py-2 rounded-xl text-sm disabled:opacity-70"
            >
              {unpublishMutation.isPending ? (isAr ? 'جار إلغاء النشر...' : 'Unpublishing...') : isAr ? 'إلغاء النشر' : 'Unpublish'}
            </button>
            <button onClick={logout} className="glass px-4 py-2 rounded-xl text-sm">
              {isAr ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 mb-8">
          <p className="text-sm text-muted-foreground">{isAr ? 'الدومين الفرعي' : 'Subdomain'}</p>
          <p className="text-lg font-semibold">{user?.subdomain || portfolio?.subdomain || (isAr ? 'غير محدد بعد' : 'Not set yet')}</p>
          <a href={`https://${user?.subdomain || portfolio?.subdomain || ''}.getsirty.com`} target='_blank' rel='noopener noreferrer' className="text-xxs text-primary hover:underline">
            {isAr ? 'اذهب الي الويبسايت الخاص بك' : 'Go to your website'}
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            {isAr ? 'القالب:' : 'Template:'} {user?.templateName || String(portfolio?.templateName ?? (isAr ? 'لم يتم الاختيار بعد' : 'Not selected yet'))}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isAr ? 'الحالة:' : 'Status:'} {portfolio?.isPublished ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-4">
            <SubdomainManagerCard
              title={isAr ? 'تحديث الدومين الفرعي' : 'Update subdomain'}
              description={
                isAr
                  ? 'اكتب أي اسم وسنقوم بفحص التوفر أثناء الكتابة. يظهر زر الحفظ فقط عندما يكون الاسم متاحا.'
                  : 'Type any name and we will check availability as you write. Save is enabled only when available.'
              }
              buttonLabel={isAr ? 'تحديث الدومين الفرعي' : 'Update subdomain'}
              currentSubdomain={user?.subdomain || portfolio?.subdomain || ''}
            />
            <TemplateManagerCard currentTemplateName={user?.templateName || String(portfolio?.templateName ?? '')} />
            <LogoManagerCard currentLogo={user?.logo || null} />
          </div>
          <div className="space-y-4">
            <LanguageModeCard
              currentLanguageMode={portfolio?.languageMode || null}
              currentDefaultLanguage={portfolio?.defaultLanguage || null}
            />
            <ProfilePreferencesCard
              currentCurrency={user?.currency || null}
              currentAllowWhatsapp={user?.allowWhatsapp}
              currentWhatsApp={user?.WhatsApp || null}
              currentWhatsapp={user?.whatsapp || null}
            />
          </div>
        </div>

        <h2 className="font-heading text-2xl font-semibold mb-4">{isAr ? 'الأقسام' : 'Sections'}</h2>
        {(sectionsLoading || portfolioLoading) && (
          <div className="glass-strong rounded-2xl p-6 text-sm text-muted-foreground">{isAr ? 'جار تحميل لوحة التحكم...' : 'Loading dashboard...'}</div>
        )}
        {!sectionsLoading && sectionEntries.length === 0 && (
          <div className="glass-strong rounded-2xl p-6 text-sm text-muted-foreground">{isAr ? 'لا توجد أقسام متاحة من واجهة البرمجة بعد.' : 'No sections available from API yet.'}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionEntries.map(([section, value]) => {
            const sectionName = String(section);
            const active = Boolean(
              value &&
              typeof value === 'object' &&
              'active' in value &&
              typeof (value as { active?: unknown }).active === 'boolean' &&
              (value as { active: boolean }).active,
            );
            const isToggling =
              setSectionActiveMutation.isPending &&
              setSectionActiveMutation.variables?.sectionName === sectionName;

            return (
              <div key={sectionName} className="glass-strong rounded-2xl p-5 glow-border">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-semibold capitalize">{sectionName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{isAr ? 'تعديل محتوى القسم والعناصر' : 'Edit section content and items'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">{isToggling ? (isAr ? 'جار التحديث...' : 'Updating...') : active ? (isAr ? 'مفتوح' : 'Open') : (isAr ? 'مغلق' : 'Closed')}</span>
                    <Switch
                      checked={active}
                      disabled={isToggling}
                      onCheckedChange={(checked) => setSectionActiveMutation.mutate({ sectionName, active: checked })}
                      aria-label={`Toggle ${sectionName} active state`}
                    />
                  </div>
                </div>
                <Link
                  to={`/section/${sectionName}/editor`}
                  className="inline-block mt-4 text-sm text-primary hover:underline"
                >
                  {isAr ? 'فتح المحرر' : 'Open editor'}
                </Link>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

