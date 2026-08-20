import { forwardRef, type ReactNode } from 'react';
import LandingSectionBackground from '@/components/landing/LandingSectionBackground';
import { cn } from '@/lib/utils';

type LandingSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'warm' | 'cool' | 'accent';
  alternate?: boolean;
  /** Skip vertical padding — use for pinned sections that manage their own spacing. */
  flush?: boolean;
};

const LandingSection = forwardRef<HTMLElement, LandingSectionProps>(
  ({ children, className = '', id, variant = 'default', alternate = false, flush = false }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'relative isolate overflow-x-clip',
          flush ? '' : 'py-12 md:py-16',
          alternate ? 'bg-muted/25' : '',
          className,
        )}
      >
        <LandingSectionBackground variant={variant} />
        <div className="relative z-10">{children}</div>
      </section>
    );
  },
);

LandingSection.displayName = 'LandingSection';

export default LandingSection;
