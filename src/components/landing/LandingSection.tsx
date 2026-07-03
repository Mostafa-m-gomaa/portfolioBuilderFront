import type { ReactNode } from 'react';
import LandingSectionBackground from '@/components/landing/LandingSectionBackground';

type LandingSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'warm' | 'cool' | 'accent';
  alternate?: boolean;
};

const LandingSection = ({
  children,
  className = '',
  id,
  variant = 'default',
  alternate = false,
}: LandingSectionProps) => {
  return (
    <section
      id={id}
      className={`relative isolate overflow-hidden py-24 ${alternate ? 'bg-muted/25' : ''} ${className}`}
    >
      <LandingSectionBackground variant={variant} />
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default LandingSection;
