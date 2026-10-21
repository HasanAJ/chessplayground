import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider";
import { sideName } from "../../chess/position";
import { openingPath } from "../../i18n/routes";
import { motifs } from "./content";
import type { OpeningLesson } from "./lessons";

export function OpeningCard({
  lesson,
  rank,
  onSelect,
}: {
  lesson: OpeningLesson;
  rank: number;
  onSelect: (lesson: OpeningLesson) => void;
}) {
  const { t, language } = useTranslation();
  const motif = motifs[lesson.motif];
  return (
    <a
      className="opening-card"
      data-opening={lesson.id}
      href={openingPath(language, lesson.id)}
      onClick={(event) => {
        if (
          event.button ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        onSelect(lesson);
      }}
    >
      <span className="opening-card-top">
        <span className="opening-rank" aria-label={t("opening.rank", rank)}>
          #{rank}
        </span>
        <span className="opening-label opening-level">
          {t(`opening.level.${lesson.level}`)}
        </span>
      </span>
      <h2>{lesson.name[language]}</h2>
      <span className="opening-family">{motif.title[language]}</span>
      <p>{motif.plan[language]}</p>
      <span className="opening-card-reward">
        {t(`opening.reward.${lesson.reward}`)}
      </span>
      <span className={`opening-risk ${lesson.risk}`}>
        {t(`opening.risk.${lesson.risk}`)}
      </span>
      <span className="opening-card-bottom">
        <span className="opening-label">{sideName(lesson.side, t)}</span>
        <span>
          {t("opening.explore")} <ArrowRight size={15} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}
