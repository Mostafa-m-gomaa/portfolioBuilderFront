import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useMyPortfolio, usePortfolioActions, usePortfolioBootstrap } from '@/hooks/usePortfolio';

const SelectLanguageMode = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const bootstrap = usePortfolioBootstrap();
  const { data: portfolio, isLoading } = useMyPortfolio();
  const { updateLanguageModeMutation } = usePortfolioActions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.subdomain) {
    return <Navigate to="/choose-subdomain" replace />;
  }

  if (!isLoading && portfolio?.languageMode) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSelect = async (mode: 'ar' | 'en' | 'both') => {
    try {
      if (!portfolio) {
        await bootstrap.mutateAsync();
      }
      await updateLanguageModeMutation.mutateAsync(mode);
      navigate('/dashboard');
    } catch {
      // Error toast handled in mutation hooks.
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-xl glow-border"
        >
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Choose portfolio language mode</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Pick how your portfolio content should be displayed. You can update this later.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSelect('en')}
              disabled={updateLanguageModeMutation.isPending}
              className="glass rounded-2xl p-4 text-start hover:bg-foreground/5 transition-colors disabled:opacity-60"
            >
              <p className="font-semibold">English</p>
              <p className="text-xs text-muted-foreground mt-1">Show content in English only.</p>
            </button>
            <button
              onClick={() => handleSelect('ar')}
              disabled={updateLanguageModeMutation.isPending}
              className="glass rounded-2xl p-4 text-start hover:bg-foreground/5 transition-colors disabled:opacity-60"
            >
              <p className="font-semibold">Arabic</p>
              <p className="text-xs text-muted-foreground mt-1">Show content in Arabic only.</p>
            </button>
            <button
              onClick={() => handleSelect('both')}
              disabled={updateLanguageModeMutation.isPending}
              className="gradient-bg rounded-2xl p-4 text-start text-primary-foreground disabled:opacity-70"
            >
              <p className="font-semibold">Both</p>
              <p className="text-xs text-primary-foreground/85 mt-1">Show both Arabic and English.</p>
            </button>
          </div>
          {updateLanguageModeMutation.isPending && (
            <p className="text-xs text-muted-foreground mt-4">Saving language mode...</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SelectLanguageMode;

