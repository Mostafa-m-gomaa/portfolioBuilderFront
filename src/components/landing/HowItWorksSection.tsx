import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import PlatformVideoSection from '@/components/shared/PlatformVideoSection';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { landingViewport, staggerContainer, staggerItem } from '@/lib/landingMotion';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', titleKey: 'how.1.title', descKey: 'how.1.desc' },
    { num: '02', titleKey: 'how.2.title', descKey: 'how.2.desc' },
    { num: '03', titleKey: 'how.3.title', descKey: 'how.3.desc' },
  ];

  return (
    <LandingSection variant="cool" alternate>
      <div className="mx-auto max-w-5xl px-6">
        <LandingSectionHeader
          kicker={t('how.kicker')}
          title={t('how.title')}
          subtitle={t('how.subtitle')}
          className="max-w-2xl"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={staggerItem} className="relative text-start">
              <div className="h-full rounded-2xl border border-border/80 bg-card/80 p-7 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-secondary/5">
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
        </motion.div>

        <PlatformVideoSection className="mt-20" />
      </div>
    </LandingSection>
  );
};

export default HowItWorksSection;
