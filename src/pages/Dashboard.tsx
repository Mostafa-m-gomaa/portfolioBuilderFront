import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { AlertTriangle, ExternalLink, Globe, Image, LayoutGrid, LayoutTemplate, Link2, Loader2, Settings2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { useSubscriptionSummary } from '@/hooks/useSubscriptionSummary';
import SubscriptionSummaryPanelSafe from '@/components/subscription/SubscriptionSummaryPanelSafe';
import { useAllSections, useMyPortfolio, usePortfolioActions, usePortfolioBootstrap } from '@/hooks/usePortfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { primaryButton, primaryButtonCompactClass, primaryButtonDefaultClass, primaryButtonMdClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import DomainManagerCard from '@/components/auth/DomainManagerCard';
import CustomDomainDnsGuide from '@/components/auth/CustomDomainDnsGuide';
import LanguageModeCard from '@/components/auth/LanguageModeCard';
import TemplateManagerCard from '@/components/auth/TemplateManagerCard';
import LogoManagerCard from '@/components/auth/LogoManagerCard';
import ProfilePreferencesCard from '@/components/auth/ProfilePreferencesCard';
import { resolvePortfolioDisplayLang } from '@/lib/portfolioDisplayLang';
import { prettyTemplateName, sectionLabel } from '@/lib/templateCatalogView';
import { resolvePortfolioSiteContext } from '@/lib/portfolioSiteUrl';
import { resolveCustomDomainEnabled } from '@/lib/authMeSync';
import { useDashboardTour } from '@/hooks/useDashboardTour';

const DASHBOARD_TABS = ['sections', 'domain', 'add-domain', 'logo', 'template', 'settings'] as const;
type DashboardTab = (typeof DASHBOARD_TABS)[number];

const isDashboardTab = (value: string | null): value is DashboardTab =>
  value !== null && (DASHBOARD_TABS as readonly string[]).includes(value);

const normalizeDashboardTab = (value: string | null): string | null =>
  value === 'site' ? 'domain' : value;

const Dashboard = () => {
  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const { isAuthenticated, logout } = useAuth();
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = normalizeDashboardTab(searchParams.get('tab'));
  const activeTab: DashboardTab = isDashboardTab(tabParam) ? tabParam : 'settings';
  const bootstrapMutation = usePortfolioBootstrap();
  const { data: portfolio, isLoading: portfolioLoading } = useMyPortfolio();
  const { data: sections, isLoading: sectionsLoading } = useAllSections();
  const { publishMutation, unpublishMutation, setSectionActiveMutation } = usePortfolioActions();
  const {
    data: subSummary,
    isFetched: subSumFetched,
    isLoading: subSummaryLoading,
    isError: subSummaryError,
  } = useSubscriptionSummary();

  const sectionDisplayLang = useMemo(
    () => resolvePortfolioDisplayLang(portfolio, lang),
    [portfolio, lang],
  );

  useEffect(() => {
    if (isAuthenticated) {
      bootstrapMutation.mutate();
    }
    // mutate is intentionally omitted to avoid repeated requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const usesCustomDomain = resolveCustomDomainEnabled(authUser, portfolio);

  const { siteUrl, siteEditorUrl } = useMemo(
    () => resolvePortfolioSiteContext(authUser, portfolio, token),
    [
      authUser?.subdomain,
      authUser?.domain,
      portfolio?.subdomain,
      portfolio?.domain,
      token,
    ],
  );

  useEffect(() => {
    if (usesCustomDomain && activeTab === 'domain') {
      setSearchParams({ tab: 'add-domain' }, { replace: true });
    }
  }, [usesCustomDomain, activeTab, setSearchParams]);

  const visibleActiveTab: DashboardTab =
    usesCustomDomain && activeTab === 'domain' ? 'add-domain' : activeTab;

  const effectiveSubdomainForTour = authUser?.subdomain || portfolio?.subdomain;
  const dashboardTourReady =
    isAuthenticated &&
    !!effectiveSubdomainForTour &&
    !effectiveSubdomainForTour.startsWith('temp-');

  useDashboardTour({
    setSearchParams,
    usesCustomDomain,
    siteEditorUrl,
    portfolioLoading,
    enabled: dashboardTourReady,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const effectiveSubdomain = authUser?.subdomain || portfolio?.subdomain;
  if (!effectiveSubdomain || effectiveSubdomain.startsWith('temp-')) {
    return <Navigate to="/choose-subdomain" replace />;
  }

  const sectionEntries = Array.isArray(sections)
    ? sections.map((section) => [String(section), { active: false }] as const)
    : Object.entries((sections ?? {}) as Record<string, unknown>).map(([key, value]) => [key, value] as const);

  const freeTrialExpired = subSumFetched && subSummary
    ? subSummary.subscriptionStatus === 'FREE_TRIAL_EXPIRED'
    : authUser?.subscriptionStatus === 'FREE_TRIAL_EXPIRED';

  const isFreePlan =
    subSummary &&
    (subSummary.subscriptionStatus === 'FREE_TRIAL' ||
      subSummary.subscriptionStatus === 'FREE');

  const showSubscriptionAside =
    subSummaryLoading ||
    isFreePlan ||
    (!subSummaryError &&
      subSummary &&
      ((subSummary.hasActiveSubscription && subSummary.subscription) ||
        (!subSummary.hasActiveSubscription &&
          (subSummary.subscriptionStatus === 'EXPIRED' ||
            subSummary.subscriptionStatus === 'CANCELLED'))));

  const showUnpublishedBanner = !portfolioLoading && !!portfolio && portfolio.isPublished !== true;

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main className="mx-auto min-w-0 max-w-6xl overflow-x-clip px-4 pb-16 pt-28 sm:px-6">
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
              className={cn(primaryButtonCompactClass, 'shrink-0 text-center sm:min-w-[10rem]')}
            >
              {t('subscription.banner.freeTrialExpired.cta')}
            </Link>
          </div>
        ) : null}
        {showUnpublishedBanner ? (
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
                  {t('dashboard.banner.unpublished.title')}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t('dashboard.banner.unpublished.description')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className={cn(primaryButtonCompactClass, 'shrink-0 text-center disabled:opacity-70 sm:min-w-[10rem]')}
            >
              {publishMutation.isPending
                ? t('dashboard.publishing')
                : t('dashboard.banner.unpublished.cta')}
            </button>
          </div>
        ) : null}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">{t('dashboard.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.welcome')}{' '}
              {typeof authUser?.name === 'string'
                ? authUser.name
                : authUser?.email || t('dashboard.creatorFallback')}
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className={cn(primaryButtonCompactClass, 'flex-1 sm:flex-none')}
            >
              {publishMutation.isPending ? t('dashboard.publishing') : t('dashboard.publish')}
            </button>
            <button
              onClick={() => unpublishMutation.mutate()}
              disabled={unpublishMutation.isPending}
              className="glass flex-1 rounded-xl px-4 py-2 text-sm disabled:opacity-70 sm:flex-none"
            >
              {unpublishMutation.isPending ? t('dashboard.unpublishing') : t('dashboard.unpublish')}
            </button>
            <button onClick={logout} className="glass flex-1 rounded-xl px-4 py-2 text-sm sm:flex-none">
              {t('dashboard.logout')}
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          {showSubscriptionAside ? (
            <SubscriptionSummaryPanelSafe compact className="mb-0 h-auto w-full" />
          ) : null}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong w-full min-w-0 rounded-3xl p-6"
          >
            <p className="text-sm text-muted-foreground">{t('dashboard.subdomain')}</p>
            <p className="text-lg font-semibold">{authUser?.subdomain || portfolio?.subdomain || t('dashboard.notSet')}</p>
            <div className='flex flex-col gap-2'>
              <a
                key={siteUrl ?? 'site'}
                href={siteUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-tour="view-site"
                className={cn(primaryButtonMdClass, 'group mt-4 w-full sm:mt-4 sm:w-auto')}
              >
                {t('dashboard.goToSite')}
                <ExternalLink
                  className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              {siteEditorUrl ? (
                <a
                  key={siteEditorUrl}
                  href={siteEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tour="edit-site"
                  className={cn(primaryButtonMdClass, 'group mt-3 w-full sm:w-auto')}
                >
                  {t('dashboard.goToEditor')}
                  <ExternalLink
                    className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              ) : null}
              {/* {siteEditorUrl ? (
                <div className="mt-3 rounded-lg border border-border bg-background p-3 text-sm">
                  <p className="font-semibold text-foreground">{lang === 'ar' ? 'ملاحظة:' : 'Note:'}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lang === 'ar'
                      ? 'قد لا يعرض المحرر القالب الذي اخترته أثناء التحرير، لكن التعديلات ستُطبق على القالب النشط لديك.'
                      : 'The editor may not display your selected template, but any changes will still be applied to your active template.'}
                  </p>
                </div>
              ) : null} */}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {t('dashboard.template')}{' '}
              {authUser?.templateName || portfolio?.templateName
                ? prettyTemplateName(String(authUser?.templateName || portfolio?.templateName), lang)
                : t('templates.choose.notSelected')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('dashboard.status')}{' '}
              {portfolio?.isPublished ? t('dashboard.published') : t('dashboard.draft')}
            </p>
          </motion.div>
        </div>

        <Tabs
          value={visibleActiveTab}
          onValueChange={(value) => setSearchParams({ tab: value }, { replace: true })}
          className="space-y-6"
        >
          <TabsList className="-mx-4 flex h-auto w-full flex-nowrap justify-start gap-2 overflow-x-auto rounded-2xl bg-transparent p-0 px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {/* <TabsTrigger
              value="sections"
              className="inline-flex shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm glass data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
            >
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
              {t('dashboard.tab.sections')}
            </TabsTrigger> */}
            {!usesCustomDomain ? (
              <TabsTrigger
                value="domain"
                data-tour="tab-domain"
                className="inline-flex shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm glass data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
              >
                <Globe className="h-4 w-4 shrink-0" aria-hidden />
                {t('dashboard.tab.domain')}
              </TabsTrigger>
            ) : null}
            <TabsTrigger
              value="add-domain"
              data-tour="tab-add-domain"
              className="inline-flex shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm glass data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
            >
              <Link2 className="h-4 w-4 shrink-0" aria-hidden />
              {t('dashboard.tab.addDomain')}
            </TabsTrigger>
            <TabsTrigger
              value="logo"
              data-tour="tab-logo"
              className="inline-flex shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm glass data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
            >
              <Image className="h-4 w-4 shrink-0" aria-hidden />
              {t('dashboard.tab.logo')}
            </TabsTrigger>
            <TabsTrigger
              value="template"
              data-tour="tab-template"
              className="inline-flex shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm glass data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
            >
              <LayoutTemplate className="h-4 w-4 shrink-0" aria-hidden />
              {t('dashboard.tab.template')}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              data-tour="tab-settings"
              className="inline-flex shrink-0 gap-2 rounded-xl px-4 py-2.5 text-sm glass data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
            >
              <Settings2 className="h-4 w-4 shrink-0" aria-hidden />
              {t('dashboard.tab.settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="mt-0 focus-visible:outline-none">
            {(sectionsLoading || portfolioLoading) && (
              <div className="glass-strong rounded-2xl p-6 text-sm text-muted-foreground">{t('dashboard.loading')}</div>
            )}
            {!sectionsLoading && !portfolioLoading && sectionEntries.length === 0 && (
              <div className="glass-strong rounded-2xl p-6 text-sm text-muted-foreground">{t('dashboard.noSections')}</div>
            )}
            {!sectionsLoading && sectionEntries.length > 0 && (
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
                        <div >
                          <h3 className="font-heading font-semibold">{sectionLabel(sectionName, lang)}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{t('dashboard.editSection')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            {isToggling
                              ? t('dashboard.sectionUpdating')
                              : active
                                ? t('dashboard.sectionOpen')
                                : t('dashboard.sectionClosed')}
                          </span>
                          <Switch
                            checked={active}
                            disabled={isToggling}
                            onCheckedChange={(checked) =>
                              setSectionActiveMutation.mutate({ sectionName, active: checked })
                            }
                            aria-label={t('dashboard.sectionToggleAria').replace(
                              '{section}',
                              sectionLabel(sectionName, lang),
                            )}
                          />
                        </div>
                      </div>
                      <Link
                        to={`/section/${sectionName}/editor`}
                        className="inline-block mt-4 text-sm text-primary hover:underline"
                      >
                        {t('dashboard.openEditor')}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {!usesCustomDomain ? (
            <TabsContent value="domain" className="mt-0 focus-visible:outline-none">
              <SubdomainManagerCard
                title={t('profile.updateSubdomain.title')}
                description={t('profile.updateSubdomain.description')}
                buttonLabel={t('profile.updateSubdomain.button')}
                currentSubdomain={authUser?.subdomain || portfolio?.subdomain || ''}
              />
            </TabsContent>
          ) : null}

          <TabsContent value="add-domain" className="mt-0 focus-visible:outline-none space-y-6">
            <DomainManagerCard
              currentSubdomain={authUser?.subdomain || portfolio?.subdomain || ''}
              customDomainEnabled={usesCustomDomain}
            />
            <CustomDomainDnsGuide />
          </TabsContent>

          <TabsContent value="logo" className="mt-0 focus-visible:outline-none">
            <LogoManagerCard currentLogo={authUser?.logo || null} />
          </TabsContent>

          <TabsContent value="template" className="mt-0 focus-visible:outline-none">
            <TemplateManagerCard currentTemplateName={authUser?.templateName || String(portfolio?.templateName ?? '')} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 focus-visible:outline-none space-y-4">
            <LanguageModeCard
              currentLanguageMode={portfolio?.languageMode || null}
              currentDefaultLanguage={portfolio?.defaultLanguage || null}
            />
            <ProfilePreferencesCard
              currentCountry={authUser?.country || null}
              currentCurrency={authUser?.currency || null}
              currentAllowWhatsapp={authUser?.allowWhatsapp}
              currentWhatsApp={authUser?.WhatsApp || null}
              currentWhatsapp={authUser?.whatsapp || null}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

