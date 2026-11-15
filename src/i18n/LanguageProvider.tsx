import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import {
  english,
  translator,
  type Translator,
  type Language,
} from "./translate.ts";
import { isOpeningsPath, languageFromPath, pathForLanguage } from "./routes.ts";
import {
  navigate,
  useLocation,
} from "../infrastructure/navigation/location.ts";
import { updatePageMetadata } from "./metadata.ts";

function setLanguage(language: Language) {
  navigate(
    pathForLanguage(window.location.pathname, language) +
      window.location.search +
      window.location.hash,
  );
}
const LanguageContext = createContext<{
  language: Language;
  t: Translator;
  setLanguage: typeof setLanguage;
}>({ language: "en", t: english, setLanguage });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const language = languageFromPath(location) ?? "en";
  const value = useMemo(
    () => ({ language, t: translator(language), setLanguage }),
    [language],
  );
  useEffect(() => {
    document.documentElement.lang = language;
    if (!isOpeningsPath(window.location.pathname)) updatePageMetadata(language);
  }, [language]);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useTranslation = () => useContext(LanguageContext);
