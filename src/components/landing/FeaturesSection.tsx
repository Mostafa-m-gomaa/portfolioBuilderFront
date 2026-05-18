import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { BarChart3, LayoutTemplate, Rocket, Settings2 } from 'lucide-react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: LayoutTemplate, titleKey: 'features.1.title', descKey: 'features.1.desc' },
    { icon: Settings2, titleKey: 'features.2.title', descKey: 'features.2.desc' },
    { icon: Rocket, titleKey: 'features.3.title', descKey: 'features.3.desc' },
    { icon: BarChart3, titleKey: 'features.4.title', descKey: 'features.4.desc' },
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{t('features.kicker')}</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">{t('features.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{t('features.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group cursor-default rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-foreground/5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{t(feature.titleKey)}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{t(feature.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
