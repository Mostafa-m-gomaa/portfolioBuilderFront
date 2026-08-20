import { lazy, Suspense } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

const ColorBends = lazy(() => import('@/components/landing/ColorBends'));

/** Shared ColorBends settings — keep in sync across hero + auth pages */
export const colorBendsProps = {
  colors: ['#1D24CA'] as string[],
  rotation: 44,
  speed: 0.2,
  scale: 2.1,
  frequency: 1,
  warpStrength: 1,
  mouseInfluence: 1,
  noise: 0,
  parallax: 0.55,
  iterations: 1,
  intensity: 1.3,
  bandWidth: 7,
  transparent: true as const,
  autoRotate: 0,
} as const;

type ColorBendsBackgroundProps = {
  className?: string;
  /** Soft overlay so foreground content stays readable */
  withOverlay?: boolean;
};

const ColorBendsFallback = ({ isLight }: { isLight: boolean }) => (
  <div
    className="absolute inset-0"
    style={{
      background: isLight
        ? `radial-gradient(ellipse at 25% 85%, rgba(29,36,202,0.22), transparent 50%),
           radial-gradient(ellipse at 75% 15%, rgba(29,36,202,0.12), transparent 45%),
           #ffffff`
        : `radial-gradient(ellipse at 25% 85%, rgba(29,36,202,0.35), transparent 50%),
           radial-gradient(ellipse at 75% 15%, rgba(29,36,202,0.18), transparent 45%),
           #050814`,
    }}
    aria-hidden
  />
);

const ColorBendsBackground = ({
  className,
  withOverlay = true,
}: ColorBendsBackgroundProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isMobile = useIsMobileViewport();
  const prefersReducedMotion = usePrefersReducedMotion();
  const useStaticFallback = isMobile || prefersReducedMotion;

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden',
        isLight ? 'bg-white' : 'bg-[#050814]',
        className,
      )}
      aria-hidden
    >
      {useStaticFallback ? (
        <ColorBendsFallback isLight={isLight} />
      ) : (
        <Suspense
          fallback={
            <div
              className={`absolute inset-0 ${isLight ? 'bg-white' : 'bg-[#050814]'}`}
            />
          }
        >
          <ColorBends
            {...colorBendsProps}
            colors={[...colorBendsProps.colors]}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      )}

      {withOverlay ? (
        <div
          className={
            isLight
              ? 'pointer-events-none absolute inset-0 bg-gradient-to-t from-white/55 via-white/15 to-transparent'
              : 'pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35'
          }
        />
      ) : null}
    </div>
  );
};

export default ColorBendsBackground;
