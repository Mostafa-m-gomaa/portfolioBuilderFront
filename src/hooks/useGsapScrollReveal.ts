import { useEffect, useRef, type RefObject } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type Options = {
  selector?: string;
  start?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  deps?: unknown[];
};

/**
 * Scroll-triggered soft reveal for storytelling sections.
 * Marks targets with `data-reveal` (or custom selector) under the root.
 */
export function useGsapScrollReveal<T extends HTMLElement = HTMLElement>(
  options: Options = {},
): RefObject<T> {
  const {
    selector = '[data-reveal]',
    start = 'top 80%',
    y = 40,
    stagger = 0.08,
    duration = 0.7,
    once = true,
    deps = [],
  } = options;

  const rootRef = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const targets = root.querySelectorAll(selector);
    if (!targets.length) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | null = null;

    void import('@/lib/gsap').then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root,
              start,
              once,
              invalidateOnRefresh: true,
            },
          },
        );
      }, root);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed by caller for refresh (lang/content)
  }, [prefersReducedMotion, selector, start, y, stagger, duration, once, ...deps]);

  return rootRef;
}
