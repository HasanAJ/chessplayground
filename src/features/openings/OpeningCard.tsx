import { useMemo } from "react";
import { useTranslation } from "../../i18n/LanguageProvider";
import { sideName } from "../../chess/position";
import { openingPath } from "../../i18n/routes";
import { BoardGrid } from "../board/BoardGrid";
import { teachingNote } from "./annotations";
import { motifs } from "./content";
import { lessonPositions, setupLength, type OpeningLesson } from "./lessons";
import { OpeningArrows } from "./OpeningArrows";

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
  const { frame, note } = useMemo(() => {
    const step = setupLength(lesson) + lesson.previewPly;
    return {
      frame: lessonPositions(lesson)[step],
      note: teachingNote(lesson, "trap", step)!,
    };
  }, [lesson]);
  const flipped = lesson.side === "b";
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
      <p>{motif.summary[language]}</p>
      <div className="opening-card-preview" aria-hidden="true">
        <BoardGrid
          position={frame.position}
          flipped={flipped}
          checkedKing={frame.checkedKing}
          focusSquares={note.squares}
          label={lesson.name[language]}
        >
          <OpeningArrows arrows={note.arrows} flipped={flipped} />
        </BoardGrid>
      </div>
      <span className="opening-card-reward">
        {t(`opening.reward.${lesson.reward}`)}
      </span>
      <span className="opening-card-bottom">
        <span className="opening-label">{sideName(lesson.side, t)}</span>
        <span className={`opening-risk ${lesson.risk}`}>
          {t(`opening.risk.${lesson.risk}`)}
        </span>
      </span>
    </a>
  );
}
