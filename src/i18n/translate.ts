import en from "../content/locales/en.ts";
import es from "../content/locales/es.ts";
import de from "../content/locales/de.ts";
import it from "../content/locales/it.ts";
import fr from "../content/locales/fr.ts";

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
const messages = { en, ...catalogs };
function format(source: string, values: (string | number)[]) {
  return source
    .split(/(\{\d+\})/)
    .map((part) =>
      /^\{\d+\}$/.test(part)
        ? String(values[Number(part.slice(1, -1))] ?? part)
        : part,
    )
    .join("");
}
function createTranslator(language: Language): Translator {
  const translate = (key: MessageKey, ...values: (string | number)[]) =>
    format(messages[language][key] ?? en[key], values);
  return Object.assign(translate, { language });
}
const translators = new Map<Language, Translator>();
export function translator(language: Language): Translator {
  const cached = translators.get(language);
  if (cached) return cached;
  const next = createTranslator(language);
  translators.set(language, next);
  return next;
}
export const english = translator("en");
