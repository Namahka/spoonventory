import { createContext, ReactNode, useContext } from "react";

import { STORAGE_KEYS } from "@/constants/storage";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  interpolate,
  Language,
  MONTH_NAMES,
  translations,
  TranslationKey,
  WEEKDAY_LABELS,
} from "@/lib/i18n/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  monthNames: string[];
  weekdayLabels: string[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = usePersistedState<Language>(
    STORAGE_KEYS.language,
    "en",
  );

  const t = (key: TranslationKey, vars?: Record<string, string | number>) =>
    interpolate(translations[language][key], vars);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        monthNames: MONTH_NAMES[language],
        weekdayLabels: WEEKDAY_LABELS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
