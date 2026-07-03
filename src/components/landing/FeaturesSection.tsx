import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { BarChart3, LayoutTemplate, Rocket, Settings2 } from 'lucide-react';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { landingViewport, staggerContainer, staggerItem } from '@/lib/landingMotion';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: LayoutTemplate, titleKey: 'features.1.title', descKey: 'features.1.desc' },
    { icon: Settings2, titleKey: 'features.2.title', descKey: 'features.2.desc' },
    { icon: Rocket, titleKey: 'features.3.title', descKey: 'features.3.desc' },
    { icon: BarChart3, titleKey: 'features.4.title', descKey: 'features.4.desc' },
  ];

  return (
    <LandingSection variant="default">
      <div className="mx-auto max-w-7xl px-6">
        <LandingSectionHeader
          kicker={t('features.kicker')}
          title={t('features.title')}
          subtitle={t('features.subtitle')}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group cursor-default rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{t(feature.titleKey)}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{t(feature.descKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </LandingSection>
  );
};

export default FeaturesSection;
