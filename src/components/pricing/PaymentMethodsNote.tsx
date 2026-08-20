import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import applePayLogo from '@/assets/apple.png';
import visaLogo from '@/assets/visa.webp';
import mastercardLogo from '@/assets/masterCard.png';

type PaymentMethodsNoteProps = {
  className?: string;
  /** Compact inline style for package detail / CTAs */
  compact?: boolean;
  /** Hide the descriptive sentence (e.g. footer logos only) */
  showTitle?: boolean;
};

const brands = [
  {
    id: 'apple-pay',
    labelKey: 'payment.methods.applePay',
    src: applePayLogo,
    /** Apple mark needs a bit more visual weight */
    scale: 'lg' as const,
  },
  {
    id: 'visa',
    labelKey: 'payment.methods.visa',
    src: visaLogo,
    scale: 'md' as const,
  },
  {
    id: 'mastercard',
    labelKey: 'payment.methods.mastercard',
    src: mastercardLogo,
    /** Mastercard circles need a bit more visual weight */
    scale: 'lg' as const,
  },
] as const;

const sizeClass = (scale: 'md' | 'lg', compact: boolean) => {
  if (compact) {
    return scale === 'lg' ? 'h-10 w-[4.5rem] p-1' : 'h-8 w-14 p-1';
  }
  return scale === 'lg'
    ? 'h-11 w-[5.25rem] p-1 sm:h-12 sm:w-24'
    : 'h-9 w-16 p-1.5 sm:h-10 sm:w-[4.75rem]';
};

/** Trust note with Apple Pay / Visa / Mastercard asset logos. */
const PaymentMethodsNote = ({
  className,
  compact = false,
  showTitle = true,
}: PaymentMethodsNoteProps) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-2xl text-center',
        showTitle ? (compact ? 'mt-4' : 'mt-8') : undefined,
        className,
      )}
    >
      {showTitle ? (
        <p
          className={cn(
            'leading-relaxed text-muted-foreground',
            compact ? 'text-sm' : 'text-sm sm:text-base',
          )}
        >
          {t('payment.methods.title')}
        </p>
      ) : null}
      <ul
        className={cn(
          'flex flex-wrap items-center justify-center',
          showTitle ? 'mt-4' : undefined,
          compact ? 'gap-2' : 'gap-2.5 sm:gap-3',
        )}
        aria-label={t('payment.methods.aria')}
      >
        {brands.map(({ id, labelKey, src, scale }) => {
          const label = t(labelKey);
          return (
            <li key={id}>
              <img
                src={src}
                alt={label}
                width={scale === 'lg' ? 96 : 64}
                height={scale === 'lg' ? 48 : 40}
                loading="lazy"
                decoding="async"
                className={cn(
                  'block object-contain rounded-md bg-white shadow-sm ring-1 ring-black/10 dark:ring-white/15',
                  sizeClass(scale, compact),
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PaymentMethodsNote;
