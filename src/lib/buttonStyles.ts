import { cn } from '@/lib/utils';

/** Matches the Hero section primary CTA ("ابدأ موقعك الآن"). */
export const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-xl';

export const primaryButtonSmClass = cn(primaryButtonClass, 'px-4 py-2');
export const primaryButtonMdClass = cn(primaryButtonClass, 'px-5 py-3');
export const primaryButtonDefaultClass = cn(primaryButtonClass, 'px-6 py-3.5');
export const primaryButtonCompactClass = cn(primaryButtonClass, 'px-4 py-2.5');
export const primaryButtonFullClass = cn(primaryButtonMdClass, 'w-full');

export function primaryButton(...classes: (string | undefined | false | null)[]) {
  return cn(primaryButtonClass, 'px-5 py-3', ...classes);
}
