import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Language = 'en' | 'ar';
type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const initialTranslations: Record<Language, Translations> = {
    en: {},
    ar: {}
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<Language, Translations>>(initialTranslations);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Paths are relative to the root index.html file
        const enRes = await fetch('./i18n/translations/en.json');
        if (!enRes.ok) throw new Error(`HTTP error! status: ${enRes.status}`);
        const enData = await enRes.json();

        const arRes = await fetch('./i18n/translations/ar.json');
        if (!arRes.ok) throw new Error(`HTTP error! status: ${arRes.status}`);
        const arData = await arRes.json();

        setTranslations({ en: enData, ar: arData });
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[language][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [language, translations]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};