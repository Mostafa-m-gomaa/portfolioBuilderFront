import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingSectionBackground from '@/components/landing/LandingSectionBackground';
import { fadeUp, landingViewport } from '@/lib/landingMotion';
import { primaryButtonDefaultClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden py-24">
      <LandingSectionBackground variant="accent" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-2xl shadow-primary/25 md:p-16"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:48px_48px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-blob-float motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-white/10 blur-3xl animate-blob-float-delayed motion-reduce:animate-none"
            aria-hidden="true"
          />

          <div className="relative">
            <h2 className="font-heading text-3xl font-bold md:text-5xl">{t('cta.title')}</h2>
            <p className="mx-auto mb-8 mt-4 max-w-lg text-lg leading-8 text-primary-foreground/80">
              {t('cta.subtitle')}
            </p>
            <Link
              to="/signup"
              className={cn(primaryButtonDefaultClass, 'px-9 py-4 text-base')}
            >
              {t('cta.button')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
