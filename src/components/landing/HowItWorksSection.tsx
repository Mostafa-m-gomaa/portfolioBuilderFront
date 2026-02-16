import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', titleKey: 'how.1.title', descKey: 'how.1.desc' },
    { num: '02', titleKey: 'how.2.title', descKey: 'how.2.desc' },
    { num: '03', titleKey: 'how.3.title', descKey: 'how.3.desc' },
  ];

  return (
    <section className="py-24 relative">
      <div className="floating-orb w-64 h-64 bg-secondary/15 top-0 end-10" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{t('how.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('how.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="glass-strong rounded-2xl p-8 h-full">
                <span className="gradient-text text-5xl font-heading font-bold">{step.num}</span>
                <h3 className="font-heading font-semibold text-xl text-foreground mt-4 mb-3">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground text-sm">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
