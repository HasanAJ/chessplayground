import { ChevronDown, Languages } from "lucide-react";
import { useTranslation } from "./LanguageProvider.tsx";
import { languages, type Language } from "./translate.ts";
const choices = Object.keys(languages) as Language[];
export function LanguageSelector() {
  const locale = useTranslation();
  return (
    <label className="language-selector">
      <Languages className="language-icon" size={16} aria-hidden="true" />
      <span className="sr-only">{locale.t("language.selector.label")}</span>
      <select
        value={locale.language}
        onChange={(event) =>
          locale.setLanguage(event.currentTarget.value as Language)
        }
      >
        {choices.map((language) => (
          <option key={language} value={language} lang={language}>
            {languages[language]}
          </option>
        ))}
      </select>
      <ChevronDown className="language-chevron" size={14} aria-hidden="true" />
    </label>
  );
}
