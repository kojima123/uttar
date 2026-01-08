import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getSettings, saveSettings } from '@/lib/storage';
import { translations, getTranslation } from '@/lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ja'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ja');

  useEffect(() => {
    const settings = getSettings();
    setLanguageState(settings.language);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveSettings({ language: lang });
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
