import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SocialLinks from '@/components/SocialLinks';
import BrandLogo from '@/components/BrandLogo';
import PaymentMethodsNote from '@/components/pricing/PaymentMethodsNote';
import { MOSTAFA_BUILDS_FACEBOOK_URL } from '@/constants/socialLinks';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4 flex items-center">
              <BrandLogo />
            </div>
            <p className="text-muted-foreground text-sm mb-5">{t('footer.description')}</p>
            <SocialLinks />
            <PaymentMethodsNote
              showTitle={false}
              compact
              className="mt-5 mx-0 max-w-none justify-start text-start [&_ul]:justify-start"
            />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t('footer.links')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.about')}</Link>
              <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.services')}</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.pricing')}</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.contact')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t('footer.legal')}</h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/terms"
                className="group glass rounded-xl px-3 py-2 border border-border hover:border-primary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t('footer.terms')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('footer.termsDesc')}
                </p>
              </Link>
              <Link
                to="/privacy"
                className="group glass rounded-xl px-3 py-2 border border-border hover:border-primary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('footer.privacyDesc')}
                </p>
              </Link>
              <Link
                to="/refund-policy"
                className="group glass rounded-xl px-3 py-2 border border-border hover:border-primary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t('footer.refund')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('footer.refundDesc')}
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center space-y-2">
          <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
          <p className="text-sm text-muted-foreground">
            {t('footer.developedBy')}{' '}
            <a
              href={MOSTAFA_BUILDS_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {t('footer.developerName')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
