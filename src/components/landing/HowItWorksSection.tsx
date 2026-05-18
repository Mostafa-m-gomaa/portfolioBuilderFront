import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', titleKey: 'how.1.title', descKey: 'how.1.desc' },
    { num: '02', titleKey: 'how.2.title', descKey: 'how.2.desc' },
    { num: '03', titleKey: 'how.3.title', descKey: 'how.3.desc' },
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{t('how.kicker')}</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">{t('how.title')}</h2>
          <p className="mx-auto mt-4 text-lg leading-8 text-muted-foreground">{t('how.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-start"
            >
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-primary">{step.num}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">{t(step.titleKey)}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
