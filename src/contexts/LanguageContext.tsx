import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Lang } from '@/i18n/translations';
import { getAppLang, setStoredAppLang } from '@/lib/i18n';

export type { Lang };

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export { translations };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => getAppLang());

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const setLang = (next: Lang) => {
    setLangState(next);
    setStoredAppLang(next);
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
