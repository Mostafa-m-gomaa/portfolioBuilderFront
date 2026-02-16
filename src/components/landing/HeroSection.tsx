import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Floating orbs */}
      <div className="floating-orb w-72 h-72 bg-primary/30 top-20 -start-20" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-96 h-96 bg-secondary/20 bottom-20 -end-20" style={{ animationDelay: '2s', animation: 'float-delayed 10s ease-in-out infinite' }} />
      <div className="floating-orb w-48 h-48 bg-accent/20 top-1/2 start-1/3" style={{ animationDelay: '4s', animation: 'float 12s ease-in-out infinite' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="glass-strong inline-block rounded-full px-4 py-1.5 mb-8">
            <span className="text-sm font-medium text-muted-foreground">✨ {t('features.subtitle')}</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-foreground"
        >
          {t('hero.title')}{' '}
          <span className="gradient-text">{t('hero.titleHighlight')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="gradient-bg-full px-8 py-4 rounded-2xl text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-105 glow-border"
          >
            {t('hero.cta1')}
          </Link>
          <button className="glass-strong px-8 py-4 rounded-2xl text-foreground font-semibold text-lg hover:bg-foreground/10 transition-all duration-300 flex items-center gap-2">
            <Play className="w-5 h-5" />
            {t('hero.cta2')}
          </button>
        </motion.div>

        {/* Glass mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 glass-strong rounded-3xl p-2 max-w-3xl mx-auto glow-border"
        >
          <div className="bg-card/50 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl gradient-bg-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">P</span>
              </div>
              <p className="text-muted-foreground text-sm">Portfolio Preview</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
