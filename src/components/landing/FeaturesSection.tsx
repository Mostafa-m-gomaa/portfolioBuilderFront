import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Palette, Settings2, Rocket, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Palette, titleKey: 'features.1.title', descKey: 'features.1.desc', gradient: 'from-primary to-secondary' },
    { icon: Settings2, titleKey: 'features.2.title', descKey: 'features.2.desc', gradient: 'from-secondary to-accent' },
    { icon: Rocket, titleKey: 'features.3.title', descKey: 'features.3.desc', gradient: 'from-accent to-primary' },
    { icon: BarChart3, titleKey: 'features.4.title', descKey: 'features.4.desc', gradient: 'from-primary to-accent' },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{t('features.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('features.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-strong rounded-2xl p-6 glow-border group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{t(feature.titleKey)}</h3>
              <p className="text-muted-foreground text-sm">{t(feature.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
