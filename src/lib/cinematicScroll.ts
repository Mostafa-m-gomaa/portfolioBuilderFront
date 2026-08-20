export function isCinematicDesktop() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 768px)').matches;
}

export function canUseCinematicMotion(prefersReducedMotion: boolean) {
  return !prefersReducedMotion && isCinematicDesktop();
}

/** Always enter from screen-right as requested. */
export function enterFromX(_lang?: string) {
  return 120;
}

export function refreshScrollTriggerSoon(ScrollTrigger?: { refresh: () => void }) {
  requestAnimationFrame(() => ScrollTrigger?.refresh());
}

/** Revert GSAP/ScrollTrigger DOM changes before React mutates the tree. */
export function revertGsapContext(ctx: { revert?: () => void } | null | undefined) {
  if (!ctx) return;
  try {
    ctx.revert();
  } catch {
    // Ignore double-revert during HMR.
  }
}

type PinSectionOptions = {
  end: string;
  scrub?: number | boolean;
  start?: string;
};

/** Shared pin config: trigger and pin must be the same root element. */
export function pinSectionConfig(root: Element, { end, scrub = 0.7, start = 'top top' }: PinSectionOptions) {
  return {
    trigger: root,
    pin: root,
    pinSpacing: true as const,
    scrub,
    start,
    end,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  };
}

/** Dynamically load GSAP — keeps it out of the mobile critical bundle. */
export async function loadGsap() {
  return import('@/lib/gsap');
}
