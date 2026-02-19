import type { MouseEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 18, mass: 0.7 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 18, mass: 0.7 });

  const orbOffsetX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const orbOffsetY = useTransform(springY, [-0.5, 0.5], [-18, 18]);
  const cardOffsetX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const cardOffsetY = useTransform(springY, [-0.5, 0.5], [-10, 10]);
  const particles = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    left: `${8 + ((index * 9) % 84)}%`,
    top: `${12 + ((index * 13) % 72)}%`,
    duration: 7 + (index % 4) * 1.5,
    delay: index * 0.001,
  }));

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-background/75">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 22%, hsl(var(--primary) / 0.24), transparent 46%), radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.2), transparent 44%), radial-gradient(circle at 50% 82%, hsl(var(--accent) / 0.16), transparent 50%)',
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                scale: [1, 1.03, 1],
                x: [0, 10, -8, 0],
                y: [0, -8, 6, 0],
              }
          }
          transition={prefersReducedMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, transparent 0%, hsl(var(--primary) / 0.08) 35%, transparent 65%), linear-gradient(295deg, transparent 0%, hsl(var(--secondary) / 0.06) 35%, transparent 65%)',
          }}
          animate={prefersReducedMotion ? undefined : { opacity: [0.45, 0.7, 0.45] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 [background-size:44px_44px] [background-image:linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)]" />
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-primary/35"
            style={{
              left: particle.left,
              top: particle.top,
              width: '4px',
              height: '4px',
              boxShadow: '0 0 12px hsl(var(--primary) / 0.55)',
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                  y: [0, -18, 0],
                  x: [0, 5, -4, 0],
                  opacity: [0.2, 0.6, 0.2],
                }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
            }
          />
        ))}
      </div>

      {/* Floating orbs */}
      <motion.div
        className="floating-orb w-72 h-72 bg-primary/30 top-20 -start-20"
        style={prefersReducedMotion ? { animationDelay: '0s' } : { animationDelay: '0s', x: orbOffsetX, y: orbOffsetY }}
      />
      <motion.div
        className="floating-orb w-96 h-96 bg-secondary/20 bottom-20 -end-20"
        style={
          prefersReducedMotion
            ? { animationDelay: '2s', animation: 'float-delayed 10s ease-in-out infinite' }
            : { animationDelay: '2s', animation: 'float-delayed 10s ease-in-out infinite', x: cardOffsetX, y: cardOffsetY }
        }
      />
      <motion.div
        className="floating-orb w-48 h-48 bg-accent/20 top-1/2 start-1/3"
        style={
          prefersReducedMotion
            ? { animationDelay: '4s', animation: 'float 12s ease-in-out infinite' }
            : { animationDelay: '4s', animation: 'float 12s ease-in-out infinite', x: orbOffsetX, y: cardOffsetY }
        }
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={prefersReducedMotion ? undefined : { x: cardOffsetX, y: cardOffsetY }}
        >
          <div className="glass-strong inline-block rounded-full px-4 py-1.5 mb-8">
            <span className="text-sm font-medium text-muted-foreground">✨ {t('features.subtitle')}</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.14 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-foreground"
        >
          {t('hero.title')}{' '}
          <motion.span
            className="gradient-text inline-block"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                  textShadow: [
                    '0 0 0px rgba(0,0,0,0)',
                    '0 0 18px hsl(var(--primary) / 0.35)',
                    '0 0 0px rgba(0,0,0,0)',
                  ],
                }
            }
            transition={prefersReducedMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {t('hero.titleHighlight')}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={prefersReducedMotion ? undefined : { scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup"
              className="gradient-bg-full px-8 py-4 rounded-2xl text-primary-foreground font-semibold text-lg hover:opacity-95 transition-all duration-300 glow-border"
              style={{
                boxShadow: '0 12px 30px hsl(var(--primary) / 0.35), 0 0 16px hsl(var(--secondary) / 0.2)',
              }}
            >
              {t('hero.cta1')}
            </Link>
          </motion.div>
          <motion.button
            className="glass-strong px-8 py-4 rounded-2xl text-foreground font-semibold text-lg hover:bg-foreground/10 transition-all duration-300 flex items-center gap-2"
            whileHover={prefersReducedMotion ? undefined : { y: -2, boxShadow: '0 12px 24px hsl(var(--foreground) / 0.14)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            {t('hero.cta2')}
          </motion.button>
        </motion.div>

        {/* Glass mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.56 }}
          style={prefersReducedMotion ? undefined : { x: cardOffsetX, y: cardOffsetY }}
          whileHover={prefersReducedMotion ? undefined : { y: -6 }}
          className="mt-16 glass-strong rounded-3xl p-2 max-w-3xl mx-auto glow-border"
        >
          <div className="bg-card/50 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(120deg, transparent 20%, hsl(var(--primary) / 0.12) 48%, transparent 78%)',
              }}
              animate={prefersReducedMotion ? undefined : { x: ['-120%', '120%'] }}
              transition={prefersReducedMotion ? undefined : { duration: 4.8, repeat: Infinity, ease: 'linear', repeatDelay: 2.4 }}
            />
            <div className="text-center p-8">
              <motion.div
                className="w-16 h-16 rounded-2xl gradient-bg-full mx-auto mb-4 flex items-center justify-center"
                animate={prefersReducedMotion ? undefined : { y: [0, -6, 0], rotate: [0, 2, 0] }}
                transition={prefersReducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-2xl font-bold text-primary-foreground">P</span>
              </motion.div>
              <p className="text-muted-foreground text-sm">Portfolio Preview</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
