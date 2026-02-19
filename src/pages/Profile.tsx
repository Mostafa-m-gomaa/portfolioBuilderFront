import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Globe2, BadgeCheck, UserRound } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/auth.store';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import LanguageModeCard from '@/components/auth/LanguageModeCard';
import { useMyPortfolio } from '@/hooks/usePortfolio';

const Profile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data: portfolio } = useMyPortfolio();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-8 glow-border">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-bg-full flex items-center justify-center">
                <UserRound className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">{user?.name || 'Portfolio User'}</h1>
                <p className="text-sm text-muted-foreground capitalize">{user?.type || 'Creator'}</p>
              </div>
            </div>
            <div className="text-xs px-3 py-1.5 rounded-full glass border border-white/20">
              {user?.isVerified ? 'Verified Account' : 'Email Not Verified'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </p>
              <p className="font-medium break-all">{user?.email || '-'}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> Subdomain
              </p>
              <p className="font-medium">{user?.subdomain || '-'}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> Verification
              </p>
              <p className="font-medium">{user?.isVerified ? 'Verified' : 'Pending'}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Public URL</p>
              <p className="font-medium break-all">
                {user?.subdomain ? `${user.subdomain}.localhost` : '-'}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SubdomainManagerCard
            title="Update your subdomain"
            description="Live check runs on each input change. Name is only saved when available and you click update."
            buttonLabel="Update subdomain"
            currentSubdomain={user?.subdomain || ''}
          />
          <LanguageModeCard currentLanguageMode={portfolio?.languageMode || null} />
        </div>
      </main>
    </div>
  );
};

export default Profile;

