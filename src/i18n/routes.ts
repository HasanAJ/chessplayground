import { languages, type Language } from "./translate";

export function languagePath(language: Language) {
  return language === "en" ? "/" : `/${language}/`;
}

export function privacyPath(language: Language) {
  return `${languagePath(language)}privacy/`;
}

export function languageFromPath(pathname: string): Language | null {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const home = path.replace(/openings\/(?:[a-z0-9-]+\/)?$/, "");
  return (
    (Object.keys(languages) as Language[]).find(
      (language) => languagePath(language) === home,
    ) ?? null
  );
}

export function openingPath(language: Language, id?: string) {
  return `${languagePath(language)}openings/${id ? `${id}/` : ""}`;
}

export function openingIdFromPath(pathname: string) {
  return pathname.match(/\/openings\/([a-z0-9-]+)\/?$/)?.[1] ?? null;
}

export function isOpeningsPath(pathname: string) {
  return (
    languageFromPath(pathname) !== null && /\/openings(?:\/|$)/.test(pathname)
  );
}

export function pathForLanguage(pathname: string, language: Language) {
  return isOpeningsPath(pathname)
    ? openingPath(language, openingIdFromPath(pathname) ?? undefined)
    : languagePath(language);
}
