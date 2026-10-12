import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  english,
  translator,
  type Language,
  type Translator,
} from "./translate";
import { languageFromPath, pathForLanguage, isOpeningsPath } from "./routes";
import { navigate } from "../app/navigation";
import { updatePageMetadata } from "./metadata";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translator;
}>({ language: "en", setLanguage() {}, t: english });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setCurrentLanguage] = useState(
    () => languageFromPath(window.location.pathname) ?? "en",
  );
  const setLanguage = useCallback((next: Language) => {
    const path = pathForLanguage(window.location.pathname, next);
    if (window.location.pathname !== path)
      navigate(`${path}${window.location.search}${window.location.hash}`);
    setCurrentLanguage(next);
  }, []);
  const value = useMemo(
    () => ({ language, setLanguage, t: translator(language) }),
    [language, setLanguage],
  );
  useEffect(() => {
    document.documentElement.lang = language;
    if (!isOpeningsPath(window.location.pathname)) updatePageMetadata(language);
  }, [language]);
  useEffect(() => {
    const restoreLanguage = () =>
      setCurrentLanguage(languageFromPath(window.location.pathname) ?? "en");
    window.addEventListener("popstate", restoreLanguage);
    return () => window.removeEventListener("popstate", restoreLanguage);
  }, []);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
