import { useReducer } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
export function PageHeading() {
  const { t } = useTranslation();
  const [expanded, toggle] = useReducer((open: boolean) => !open, false);
  const guide = [
    t("intro.guide.play"),
    t("intro.guide.analyze", t("coach.calculate.label.ready")),
    t("intro.guide.setup"),
  ];
  return (
    <section className={`page-heading ${expanded ? "guide-open" : ""}`}>
      <div>
        <h1>
          {t("intro.heading.start")} <span>{t("intro.heading.end")}</span>
        </h1>
        <p>{t("intro.tagline")}</p>
        <button
          className="guide-toggle"
          aria-expanded={expanded}
          aria-controls="page-guide"
          onClick={toggle}
        >
          {t(expanded ? "intro.guide.hide" : "intro.guide.show")}
          <ChevronDown size={14} />
        </button>
      </div>
      <p className="page-guide" id="page-guide">
        {guide.flatMap((sentence, index) =>
          index === 0 ? [sentence] : [" ", sentence],
        )}
      </p>
    </section>
  );
}
