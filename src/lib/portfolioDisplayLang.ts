import type { Lang } from '@/i18n/translations';

type PortfolioLanguageHints = {
  languageMode?: string | null;
  defaultLanguage?: string | null;
};

/** UI language for portfolio content labels (sections, etc.) based on site language settings. */
export const resolvePortfolioDisplayLang = (
  portfolio: PortfolioLanguageHints | null | undefined,
  uiLang: Lang,
): Lang => {
  const mode = portfolio?.languageMode;
  if (mode === 'ar' || mode === 'en') return mode;
  const defaultLanguage = portfolio?.defaultLanguage;
  if (mode === 'both' && (defaultLanguage === 'ar' || defaultLanguage === 'en')) {
    return defaultLanguage;
  }
  return uiLang;
};
