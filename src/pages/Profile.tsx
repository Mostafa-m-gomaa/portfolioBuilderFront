import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Globe2, BadgeCheck, UserRound, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/auth.store';
import SubdomainManagerCard from '@/components/auth/SubdomainManagerCard';
import LanguageModeCard from '@/components/auth/LanguageModeCard';
import TemplateManagerCard from '@/components/auth/TemplateManagerCard';
import LogoManagerCard from '@/components/auth/LogoManagerCard';
import ProfilePreferencesCard from '@/components/auth/ProfilePreferencesCard';
import { useMyPortfolio } from '@/hooks/usePortfolio';
import { resolveApiAssetUrl } from '@/api/axios';
import SubscriptionSummaryPanelSafe from '@/components/subscription/SubscriptionSummaryPanelSafe';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAccountTypeLabel } from '@/constants/accountTypes';
import { prettyTemplateName } from '@/lib/templateCatalogView';
import { countryLabel } from '@/constants/countries';

const Profile = () => {
  const { lang, t } = useLanguage();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data: portfolio } = useMyPortfolio();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const templateName = user?.templateName || String(portfolio?.templateName ?? '');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-8 glow-border">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.logo ? (
                <img
                  src={resolveApiAssetUrl(user.logo)}
                  alt={t('profile.logo.alt')}
                  className="w-16 h-16 rounded-2xl object-cover border border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl gradient-bg-full flex items-center justify-center">
                  <UserRound className="w-8 h-8 text-primary-foreground" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                  {user?.name || t('profile.fallbackName')}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {getAccountTypeLabel(user?.type, lang)}
                </p>
              </div>
            </div>
            <div className="text-xs px-3 py-1.5 rounded-full glass border border-white/20">
              {user?.isVerified ? t('profile.verifiedAccount') : t('profile.emailNotVerified')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {t('profile.email')}
              </p>
              <p className="font-medium break-all">{user?.email || '-'}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> {t('profile.subdomain')}
              </p>
              <p className="font-medium">{user?.subdomain || '-'}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> {t('profile.verification')}
              </p>
              <p className="font-medium">{user?.isVerified ? t('profile.verified') : t('profile.pending')}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2">{t('profile.publicUrl')}</p>
              <p className="font-medium break-all">
                {user?.subdomain ? `${user.subdomain}.getsirty.com` : '-'}
              </p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2">{t('profile.template')}</p>
              <p className="font-medium">
                {templateName ? prettyTemplateName(templateName, lang) : '-'}
              </p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {t('profile.country')}
              </p>
              <p className="font-medium">{user?.country ? countryLabel(user.country, lang) : '-'}</p>
            </div>
          </div>
        </motion.div>

        <SubscriptionSummaryPanelSafe />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-4">
            <SubdomainManagerCard
              title={t('profile.updateSubdomain.title')}
              description={t('profile.updateSubdomain.description')}
              buttonLabel={t('profile.updateSubdomain.button')}
              currentSubdomain={user?.subdomain || ''}
            />
            <TemplateManagerCard currentTemplateName={templateName} />
            <LogoManagerCard currentLogo={user?.logo || null} />
          </div>
          <div className="space-y-4">
            <LanguageModeCard
              currentLanguageMode={portfolio?.languageMode || null}
              currentDefaultLanguage={portfolio?.defaultLanguage || null}
            />
            <ProfilePreferencesCard
              currentCountry={user?.country || null}
              currentCurrency={user?.currency || null}
              currentAllowWhatsapp={user?.allowWhatsapp}
              currentWhatsApp={user?.WhatsApp || null}
              currentWhatsapp={user?.whatsapp || null}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
