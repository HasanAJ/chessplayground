import { Languages } from "lucide-react";
import { useTranslation } from "./LanguageProvider";
import { languages, type Language } from "./translate";

export function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();
  return (
    <label className="language-selector">
      <Languages size={16} aria-hidden="true" />
      <span className="sr-only">{t("Language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code} lang={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
