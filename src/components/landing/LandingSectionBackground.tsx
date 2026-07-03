import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type LandingSectionBackgroundProps = {
  variant?: 'default' | 'warm' | 'cool' | 'accent';
};

const variantConfig = {
  default: {
    orb1: 'bg-primary/20',
    orb2: 'bg-secondary/15',
    orb3: 'bg-violet-400/10',
    gradient: 'from-primary/[0.04] via-transparent to-secondary/[0.03]',
  },
  warm: {
    orb1: 'bg-fuchsia-400/15',
    orb2: 'bg-primary/18',
    orb3: 'bg-orange-400/8',
    gradient: 'from-fuchsia-500/[0.05] via-transparent to-primary/[0.04]',
  },
  cool: {
    orb1: 'bg-secondary/18',
    orb2: 'bg-accent/12',
    orb3: 'bg-blue-400/10',
    gradient: 'from-secondary/[0.05] via-transparent to-accent/[0.03]',
  },
  accent: {
    orb1: 'bg-primary/22',
    orb2: 'bg-violet-500/14',
    orb3: 'bg-fuchsia-400/10',
    gradient: 'from-violet-500/[0.06] via-transparent to-fuchsia-500/[0.04]',
  },
} as const;

const LandingSectionBackground = ({ variant = 'default' }: LandingSectionBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [-30, 50]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const colors = variantConfig[variant];

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient}`} />

      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(hsl(var(--border)/0.6)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.6)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]"
      />

      <motion.div
        style={{ y: orb1Y }}
        className={`absolute -start-24 top-1/4 h-72 w-72 rounded-full blur-3xl ${colors.orb1} animate-blob-float motion-reduce:animate-none`}
      />
      <motion.div
        style={{ y: orb2Y }}
        className={`absolute -end-16 top-1/3 h-80 w-80 rounded-full blur-3xl ${colors.orb2} animate-blob-float-delayed motion-reduce:animate-none`}
      />
      <motion.div
        style={{ y: orb3Y }}
        className={`absolute start-1/3 -bottom-16 h-64 w-64 rounded-full blur-3xl ${colors.orb3} animate-blob-float-slow motion-reduce:animate-none`}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
    </div>
  );
};

export default LandingSectionBackground;
