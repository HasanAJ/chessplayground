import type { MouseEvent } from "react";
import { languages, type Language } from "../../i18n/translate.ts";
import { siteContent } from "../../i18n/siteContent.ts";
import { pathForLanguage } from "../../i18n/routes.ts";
export function SiteIntro({
  language,
  onLanguageChange,
  pathname = "/",
}: {
  language: Language;
  onLanguageChange?: (language: Language) => void;
  pathname?: string;
}) {
  const copy = siteContent[language];
  const follow = (event: MouseEvent, target: Language) => {
    const modified =
      event.metaKey || event.ctrlKey || event.altKey || event.shiftKey;
    if (event.button === 0 && !modified && onLanguageChange) {
      event.preventDefault();
      onLanguageChange(target);
    }
  };
  return (
    <section className="site-intro" aria-labelledby="site-intro-heading">
      <h2 id="site-intro-heading">{copy.heading}</h2>
      {[copy.intro, copy.analysis].map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <nav className="language-links" aria-label={copy.languagesLabel}>
        {(Object.keys(languages) as Language[]).map((target) => (
          <a
            key={target}
            href={pathForLanguage(pathname, target)}
            hrefLang={target}
            lang={target}
            aria-current={target === language ? "page" : undefined}
            onClick={(event) => follow(event, target)}
          >
            {languages[target]}
          </a>
        ))}
      </nav>
    </section>
  );
}
