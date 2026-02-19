import { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import { useMyPortfolio } from '@/hooks/usePortfolio';

const ChooseSubdomain = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: portfolio, isLoading: portfolioLoading } = useMyPortfolio();
  const hasTemporarySubdomain = Boolean(user?.subdomain?.startsWith('temp-'));

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.subdomain && !hasTemporarySubdomain) {
    if (portfolioLoading) return null;
    return <Navigate to={portfolio?.languageMode ? '/dashboard' : '/select-language-mode'} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <div className="w-full max-w-md">
          <SubdomainManagerCard
            title="Choose your subdomain"
            description="This checks availability live while you type. It does not reserve the name until you save it."
            buttonLabel="Continue to language mode"
            onSuccess={() => navigate('/select-language-mode')}
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseSubdomain;

