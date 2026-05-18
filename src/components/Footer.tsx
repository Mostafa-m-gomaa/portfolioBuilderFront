import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="سيرتي" className="w-12 h-12 rounded-xl object-contain" />
              <span className="font-heading font-bold text-lg text-foreground">سيرتي</span>
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
            <div className="flex flex-col gap-3">
              <Link
                to="/terms"
                className="group glass rounded-xl px-3 py-2 border border-white/10 hover:border-primary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t('footer.terms')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAr ? 'شروط استخدام الخدمة والمنصة' : 'Rules for using our platform'}
                </p>
              </Link>
              <Link
                to="/privacy"
                className="group glass rounded-xl px-3 py-2 border border-white/10 hover:border-primary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAr ? 'كيف نتعامل مع بياناتك الشخصية' : 'How we collect and process data'}
                </p>
              </Link>
              <Link
                to="/refund-policy"
                className="group glass rounded-xl px-3 py-2 border border-white/10 hover:border-primary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {t('footer.refund')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAr ? 'سياسة الاسترداد والاشتراكات عبر Paddle' : 'Refunds and subscription billing via Paddle'}
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2024 سيرتي. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
