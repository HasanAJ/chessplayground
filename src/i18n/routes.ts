import { languages, type Language } from "./translate.ts";

export const languagePath = (language: Language) =>
  language === "en" ? "/" : `/${language}/`;
export const privacyPath = (language: Language) =>
  `${languagePath(language)}privacy/`;
export const openingPath = (language: Language, id?: string) =>
  `${languagePath(language)}openings/${id ? `${id}/` : ""}`;

function route(path: string) {
  const pathname = path.split(/[?#]/)[0];
  const match =
    /^\/(?:(es|de|it|fr)\/)?(?:(openings)(?:\/([a-z0-9-]+))?\/?)?$/.exec(
      pathname,
    );
  if (!match) return null;
  return {
    language: (match[1] ?? "en") as Language,
    opening: !!match[2],
    id: match[3] ?? null,
  };
}
export function languageFromPath(path: string): Language | null {
  // Language roots without a trailing slash are valid navigation destinations.
  const normalized = /^\/(es|de|it|fr)$/.test(path) ? path + "/" : path;
  const parsed = route(normalized);
  return parsed && Object.hasOwn(languages, parsed.language)
    ? parsed.language
    : null;
}
export function openingIdFromPath(path: string) {
  return route(path)?.id ?? null;
}
export function isOpeningsPath(path: string) {
  return route(path)?.opening ?? false;
}
export function pathForLanguage(path: string, language: Language) {
  return isOpeningsPath(path)
    ? openingPath(language, openingIdFromPath(path) ?? undefined)
    : languagePath(language);
}
