import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-24">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-primary p-10 text-primary-foreground shadow-2xl shadow-primary/20 md:p-16"
        >
          <h2 className="font-heading text-3xl font-bold md:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-lg text-lg leading-8 text-primary-foreground/80">
            {t('cta.subtitle')}
          </p>
          <Link
            to="/signup"
            className="inline-flex rounded-xl bg-background px-9 py-4 text-base font-bold text-foreground transition hover:-translate-y-0.5 hover:bg-background/95"
          >
            {t('cta.button')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
