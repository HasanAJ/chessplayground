import type { MouseEvent } from "react";
import { languages, type Language } from "../i18n/translate";
import { languagePath } from "../i18n/routes";
import { siteContent } from "../i18n/siteContent";

export function SiteIntro({
  language,
  onLanguageChange,
}: {
  language: Language;
  onLanguageChange?: (language: Language) => void;
}) {
  const content = siteContent[language];
  function changeLanguage(
    event: MouseEvent<HTMLAnchorElement>,
    next: Language,
  ) {
    if (
      !onLanguageChange ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    onLanguageChange(next);
  }
  return (
    <section className="site-intro" aria-labelledby="site-intro-heading">
      <h2 id="site-intro-heading">{content.heading}</h2>
      <p>{content.intro}</p>
      <p>{content.analysis}</p>
      <nav className="language-links" aria-label={content.languagesLabel}>
        {Object.entries(languages).map(([code, name]) => (
          <a
            key={code}
            href={languagePath(code as Language)}
            hrefLang={code}
            lang={code}
            aria-current={code === language ? "page" : undefined}
            onClick={(event) => changeLanguage(event, code as Language)}
          >
            {name}
          </a>
        ))}
      </nav>
    </section>
  );
}
