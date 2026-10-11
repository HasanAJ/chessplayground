import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  english,
  supportedLanguage,
  translator,
  type Language,
  type Translator,
} from "./translate";

export const LANGUAGE_KEY = "tempo-language-v1";

export function initialLanguage(
  storage?: Pick<Storage, "getItem">,
  preferred: readonly string[] = [],
): Language {
  try {
    const saved = supportedLanguage(
      (storage ?? localStorage).getItem(LANGUAGE_KEY),
    );
    if (saved) return saved;
  } catch {
    // Language choice remains available when browser storage is disabled.
  }
  for (const preference of preferred) {
    const language = supportedLanguage(preference);
    if (language) return language;
  }
  return "en";
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translator;
}>({ language: "en", setLanguage() {}, t: english });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() =>
    initialLanguage(undefined, navigator.languages),
  );
  const value = useMemo(
    () => ({ language, setLanguage, t: translator(language) }),
    [language],
  );
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = value.t("Tempo — Your next move, explained.");
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // A failed preference save must not interrupt the game.
    }
  }, [language, value]);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
