import type { ReactNode } from 'react';

type LandingSectionHeaderProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

const LandingSectionHeader = ({
  kicker,
  title,
  subtitle,
  children,
  className = '',
}: LandingSectionHeaderProps) => {
  return (
    <div data-reveal className={`mx-auto mb-14 max-w-3xl text-center ${className}`}>
      <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{kicker}</span>
      <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
};

export default LandingSectionHeader;
