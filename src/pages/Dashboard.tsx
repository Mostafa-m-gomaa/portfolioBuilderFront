import { Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useAllSections, useMyPortfolio, usePortfolioActions, usePortfolioBootstrap } from '@/hooks/usePortfolio';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import LanguageModeCard from '@/components/auth/LanguageModeCard';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const bootstrapMutation = usePortfolioBootstrap();
  const { data: portfolio, isLoading: portfolioLoading } = useMyPortfolio();
  const { data: sections, isLoading: sectionsLoading } = useAllSections();
  const { publishMutation, unpublishMutation, setSectionActiveMutation } = usePortfolioActions();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Portfolio Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Welcome {user?.name || user?.email || 'creator'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="gradient-bg px-4 py-2 rounded-xl text-primary-foreground text-sm disabled:opacity-70"
            >
              {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </button>
            <button
              onClick={() => unpublishMutation.mutate()}
              disabled={unpublishMutation.isPending}
              className="glass px-4 py-2 rounded-xl text-sm disabled:opacity-70"
            >
              {unpublishMutation.isPending ? 'Unpublishing...' : 'Unpublish'}
            </button>
            <button onClick={logout} className="glass px-4 py-2 rounded-xl text-sm">
              Logout
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 mb-8">
          <p className="text-sm text-muted-foreground">Subdomain</p>
          <p className="text-lg font-semibold">{user?.subdomain || portfolio?.subdomain || 'Not set yet'}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Status: {portfolio?.isPublished ? 'Published' : 'Draft'}
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SubdomainManagerCard
            title="Update subdomain"
            description="Type any name and we will check availability as you write. Save is enabled only when available."
            buttonLabel="Update subdomain"
            currentSubdomain={user?.subdomain || portfolio?.subdomain || ''}
          />
          <LanguageModeCard currentLanguageMode={portfolio?.languageMode || null} />
        </div>

        <h2 className="font-heading text-2xl font-semibold mb-4">Sections</h2>
        {(sectionsLoading || portfolioLoading) && (
          <div className="glass-strong rounded-2xl p-6 text-sm text-muted-foreground">Loading dashboard...</div>
        )}
        {!sectionsLoading && sectionEntries.length === 0 && (
          <div className="glass-strong rounded-2xl p-6 text-sm text-muted-foreground">No sections available from API yet.</div>
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
                  <p className="text-xs text-muted-foreground mt-1">Edit section content and items</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{isToggling ? 'Updating...' : active ? 'Open' : 'Closed'}</span>
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
                Open editor
              </Link>
            </div>
          )})}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

