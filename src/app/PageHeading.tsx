import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "../i18n/LanguageProvider";

export function PageHeading() {
  const { t } = useTranslation();
  const [guideOpen, setGuideOpen] = useState(false);
  return (
    <section className={`page-heading ${guideOpen ? "guide-open" : ""}`}>
      <div>
        <h1>
          {t("intro.heading.start")} <span>{t("intro.heading.end")}</span>
        </h1>
        <p>{t("intro.tagline")}</p>
        <button
          className="guide-toggle"
          aria-expanded={guideOpen}
          aria-controls="page-guide"
          onClick={() => setGuideOpen(!guideOpen)}
        >
          {t(guideOpen ? "intro.guide.hide" : "intro.guide.show")}
          <ChevronDown size={14} />
        </button>
      </div>
      <p className="page-guide" id="page-guide">
        {t("intro.guide.play")}{" "}
        {t("intro.guide.analyze", t("coach.calculate.label.ready"))}{" "}
        {t("intro.guide.setup")}
      </p>
    </section>
  );
}
