import { useMemo, type MouseEvent } from "react";
import type { OpeningLesson } from "../../content/openings/lessons.ts";
import { motifs } from "../../content/openings/content.ts";
import { teachingNote } from "../../content/openings/annotations.ts";
import { lessonPositions, setupLength } from "../../domain/openings/lesson.ts";
import { sideName } from "../../domain/chess/position.ts";
import { openingPath } from "../../i18n/routes.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { BoardGrid } from "../board/BoardGrid.tsx";
import { OpeningArrows } from "./OpeningArrows.tsx";
export function OpeningCard({
  lesson,
  rank,
  onSelect,
}: {
  lesson: OpeningLesson;
  rank: number;
  onSelect: (lesson: OpeningLesson) => void;
}) {
  const { language, t } = useTranslation();
  const preview = useMemo(() => {
    const ply = setupLength(lesson) + lesson.previewPly;
    return {
      board: lessonPositions(lesson, "trap")[ply],
      annotation: teachingNote(lesson, "trap", ply)!,
    };
  }, [lesson]);
  const open = (event: MouseEvent) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    )
      return;
    event.preventDefault();
    onSelect(lesson);
  };
  const title = lesson.name[language],
    flipped = lesson.side === "b";
  return (
    <a
      className="opening-card"
      data-opening={lesson.id}
      href={openingPath(language, lesson.id)}
      onClick={open}
    >
      <span className="opening-card-top">
        <span className="opening-rank" aria-label={t("opening.rank", rank)}>
          #{rank}
        </span>
        <span className="opening-label opening-level">
          {t(`opening.level.${lesson.level}`)}
        </span>
      </span>
      <h2>{title}</h2>
      <p>{motifs[lesson.motif].summary[language]}</p>
      <div className="opening-card-preview" aria-hidden="true">
        <BoardGrid
          position={preview.board.position}
          flipped={flipped}
          checkedKing={preview.board.checkedKing}
          focusSquares={preview.annotation.squares}
          label={title}
        >
          <OpeningArrows arrows={preview.annotation.arrows} flipped={flipped} />
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
