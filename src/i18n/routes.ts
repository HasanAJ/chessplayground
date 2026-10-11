import { languages, type Language } from "./translate";

export function languagePath(language: Language) {
  return language === "en" ? "/" : `/${language}/`;
}

export function languageFromPath(pathname: string): Language | null {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return (
    (Object.keys(languages) as Language[]).find(
      (language) => languagePath(language) === path,
    ) ?? null
  );
}
