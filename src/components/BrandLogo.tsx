import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import logoDark from '@/assets/logo.png';
import logoLight from '@/assets/logo-light.png';

type BrandLogoProps = {
  className?: string;
};

/** Site brand mark — light logo in light mode, dark logo in dark mode. */
const BrandLogo = ({ className }: BrandLogoProps) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const src = theme === 'light' ? logoLight : logoDark;

  return (
    <img
      src={src}
      alt={t('brand.logoAlt')}
      width={160}
      height={64}
      className={cn('h-14 w-auto object-contain sm:h-16', className)}
    />
  );
};

export default BrandLogo;
