import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** True when pin/scrub cinematic scroll should run (desktop + no reduced motion). */
export function useCinematicScrollEnabled() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return !prefersReducedMotion && desktop;
}
