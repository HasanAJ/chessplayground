import type en from "./locales/en";
import es from "./locales/es";
import de from "./locales/de";
import it from "./locales/it";
import fr from "./locales/fr";

export const languages = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  fr: "Français",
} as const;
export type Language = keyof typeof languages;
export type Message = keyof typeof en;
export type Translator = ((
  source: Message,
  ...values: (string | number)[]
) => string) & { language: Language };
export const catalogs = { es, de, it, fr };

function interpolate(source: string, values: (string | number)[]) {
  return source.replace(/\{(\d+)\}/g, (placeholder, index: string) =>
    String(values[Number(index)] ?? placeholder),
  );
}

export const english: Translator = Object.assign(
  (source: string, ...values: (string | number)[]) =>
    interpolate(source, values),
  { language: "en" as Language },
);

export function translator(language: Language): Translator {
  if (language === "en") return english;
  const catalog: Record<string, string> = catalogs[language];
  return Object.assign(
    (source: string, ...values: (string | number)[]) =>
      interpolate(
        Object.hasOwn(catalog, source) ? catalog[source] : source,
        values,
      ),
    { language },
  );
}
