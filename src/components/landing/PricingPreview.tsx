import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingPreview = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.free'),
      price: '$0',
      features: ['1 Portfolio', '5 Pages', 'Basic Templates', 'Portfolia Subdomain'],
      popular: false,
    },
    {
      name: t('pricing.pro'),
      price: '$12',
      features: ['5 Portfolios', 'Unlimited Pages', 'Premium Templates', 'Custom Domain', 'Analytics', 'Priority Support'],
      popular: true,
    },
    {
      name: t('pricing.business'),
      price: '$29',
      features: ['Unlimited Portfolios', 'Unlimited Pages', 'All Templates', 'Custom Domain', 'Advanced Analytics', 'Team Features', 'API Access'],
      popular: false,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="floating-orb w-80 h-80 bg-accent/10 bottom-0 start-10" />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{t('pricing.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('pricing.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`rounded-2xl p-6 relative ${plan.popular ? 'gradient-bg-full text-primary-foreground' : 'glass-strong glow-border'}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 glass-strong px-3 py-1 rounded-full text-xs font-semibold text-foreground">
                  {t('pricing.popular')}
                </span>
              )}
              <h3 className={`font-heading font-semibold text-xl mb-2 ${plan.popular ? '' : 'text-foreground'}`}>{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold font-heading">{plan.price}</span>
                <span className={`text-sm ${plan.popular ? 'opacity-80' : 'text-muted-foreground'}`}>{t('pricing.month')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block text-center px-4 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90 ${
                  plan.popular ? 'bg-background text-foreground' : 'gradient-bg text-primary-foreground'
                }`}
              >
                {t('pricing.cta')}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
