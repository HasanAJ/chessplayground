import en from "./locales/en";
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
export type MessageKey = keyof typeof en;
export type Translator = ((
  key: MessageKey,
  ...values: (string | number)[]
) => string) & { language: Language };
export const catalogs = { es, de, it, fr };

function interpolate(source: string, values: (string | number)[]) {
  return source.replace(/\{(\d+)\}/g, (placeholder, index: string) =>
    String(values[Number(index)] ?? placeholder),
  );
}

export const english: Translator = Object.assign(
  (key: MessageKey, ...values: (string | number)[]) =>
    interpolate(en[key], values),
  { language: "en" as Language },
);

export function translator(language: Language): Translator {
  if (language === "en") return english;
  const catalog = catalogs[language];
  return Object.assign(
    (key: MessageKey, ...values: (string | number)[]) =>
      interpolate(catalog[key] ?? en[key], values),
    { language },
  );
}
