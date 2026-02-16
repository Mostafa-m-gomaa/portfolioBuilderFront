import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-heading font-bold text-lg text-foreground">Portfolia</span>
            </div>
            <p className="text-muted-foreground text-sm">{t('footer.description')}</p>
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
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.terms')}</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2024 Portfolia. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
