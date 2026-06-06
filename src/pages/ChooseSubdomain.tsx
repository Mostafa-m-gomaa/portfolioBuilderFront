import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { needsSubscriptionOnboarding } from '@/lib/authRouting';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import { useLanguage } from '@/contexts/LanguageContext';

const ChooseSubdomain = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const hasTemporarySubdomain = Boolean(user?.subdomain?.startsWith('temp-'));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (needsSubscriptionOnboarding(user)) {
    return <Navigate to="/select-subscription" replace />;
  }

  if (user?.subdomain && !hasTemporarySubdomain) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <div className="w-full max-w-md">
          <SubdomainManagerCard
            title={t('onboarding.subdomain.title')}
            description={t('onboarding.subdomain.description')}
            buttonLabel={t('onboarding.subdomain.submit')}
            onSuccess={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseSubdomain;
