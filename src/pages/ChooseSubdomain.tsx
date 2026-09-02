import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ColorBendsBackground from '@/components/ColorBendsBackground';
import { useAuth } from '@/hooks/useAuth';
import {
  getPostSubdomainOnboardingPath,
  markPendingSiteContent,
  SETUP_SITE_CONTENT_PATH,
} from '@/lib/authRouting';
import { isUserEmailVerified } from '@/lib/authVerification';
import RedirectToEmailVerification from '@/components/RedirectToEmailVerification';
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

  if (user?.email && !isUserEmailVerified(user)) {
    return <RedirectToEmailVerification email={user.email} />;
  }

  if (user?.subdomain && !hasTemporarySubdomain) {
    return <Navigate to={getPostSubdomainOnboardingPath(user)} replace />;
  }

  return (
    <div className="relative min-h-screen">
      <ColorBendsBackground />
      <Navbar />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-24">
        <div className="w-full max-w-md">
          <SubdomainManagerCard
            title={t('onboarding.subdomain.title')}
            description={t('onboarding.subdomain.description')}
            buttonLabel={t('onboarding.subdomain.submit')}
            onSuccess={() => {
              markPendingSiteContent();
              navigate(SETUP_SITE_CONTENT_PATH);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseSubdomain;
