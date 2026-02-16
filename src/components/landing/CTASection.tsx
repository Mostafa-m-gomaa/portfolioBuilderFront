import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="floating-orb w-96 h-96 bg-primary/20 -top-20 start-1/4" />
      <div className="floating-orb w-64 h-64 bg-accent/15 bottom-0 end-1/4" style={{ animation: 'float-delayed 10s ease-in-out infinite' }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-12 md:p-16 glow-border"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link
            to="/signup"
            className="inline-block gradient-bg-full px-10 py-4 rounded-2xl text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
          >
            {t('cta.button')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
