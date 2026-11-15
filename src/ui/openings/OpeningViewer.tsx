import {
  ArrowDownUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import type { OpeningLesson } from "../../content/openings/lessons.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { openingPath } from "../../i18n/routes.ts";
import { sideName } from "../../domain/chess/position.ts";
import { BoardGrid } from "../board/BoardGrid.tsx";
import {
  SquareHighlightProvider,
  SquareText,
} from "../board/SquareHighlight.tsx";
import { OpeningArrows } from "./OpeningArrows.tsx";
import { LessonStepCard, LessonBackground } from "./LessonDetails.tsx";
import { useLessonViewer } from "./useLessonViewer.ts";
export function OpeningViewer({
  lesson,
  active,
  onClose,
}: {
  lesson: OpeningLesson;
  active: boolean;
  onClose: () => void;
}) {
  const { t, language } = useTranslation();
  const view = useLessonViewer(lesson, active);
  const back = t("opening.backToLibrary");
  return (
    <SquareHighlightProvider
      positionKey={`${lesson.id}:${view.branch}:${active ? view.frame.fen : "inactive"}`}
    >
      <div className="opening-lesson-header">
        <div className="opening-title-row" ref={view.titleRow}>
          <a
            className="opening-back"
            href={openingPath(language)}
            aria-label={back}
            title={back}
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
              onClose();
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </a>
          <h1 tabIndex={-1} ref={view.heading}>
            {lesson.name[language]}
          </h1>
          <div className="opening-lesson-meta">
            <span className="opening-label opening-level">
              {t(`opening.level.${lesson.level}`)}
            </span>
            <span className="opening-label">{sideName(lesson.side, t)}</span>
          </div>
        </div>
        <p>
          <SquareText text={view.motif.title[language]} />
        </p>
      </div>
      <div
        className="opening-branches"
        role="group"
        aria-label={t("opening.branch.label")}
      >
        {(["trap", "defense"] as const).map((branch) => (
          <button
            key={branch}
            data-opening-branch={branch}
            aria-pressed={view.branch === branch}
            onClick={() => view.changeBranch(branch)}
          >
            {t(`opening.branch.${branch}`)}
          </button>
        ))}
      </div>
      <div className="opening-lesson">
        <section
          className="opening-board-panel"
          aria-label={t("opening.viewer.label")}
        >
          <div className="opening-board-toolbar">
            <span
              className={`opening-stage ${view.isTemptation ? "temptation" : ""}`}
            >
              {t(`opening.stage.${view.stage}`)}
            </span>
            <button
              className="icon-button"
              aria-label={t("board.flip")}
              title={t("board.flip")}
              onClick={view.flip}
            >
              <ArrowDownUp size={17} />
            </button>
          </div>
          <BoardGrid
            position={view.frame.position}
            flipped={view.flipped}
            lastMove={view.frame.move}
            checkedKing={view.frame.checkedKing}
            focusSquares={view.note?.squares}
            label={t("opening.board.label", view.step, view.total)}
            className="opening-board"
          >
            {view.note && (
              <OpeningArrows arrows={view.note.arrows} flipped={view.flipped} />
            )}
          </BoardGrid>
          {view.compact && <LessonStepCard view={view} />}
          <div className="opening-progress">
            <span>{t("opening.step", view.step, view.total)}</span>
            <progress
              max={view.total}
              value={view.step}
              aria-label={t("opening.progress")}
            />
          </div>
          <div
            className="opening-navigation"
            role="group"
            aria-label={t("opening.navigation")}
          >
            <button
              className="opening-nav-button"
              disabled={view.step === 0}
              onClick={() => view.changeStep(view.step - 1)}
            >
              <ChevronLeft size={18} />
              {t("opening.previous")}
            </button>
            <button
              className="opening-restart"
              aria-label={t("opening.restart")}
              title={t("opening.restart")}
              disabled={view.step === 0}
              onClick={() => view.changeStep(0)}
            >
              <RotateCcw size={17} />
              <span>{t("opening.restart")}</span>
            </button>
            <button
              className="opening-nav-button opening-forward"
              disabled={view.finished}
              onClick={() => view.changeStep(view.step + 1)}
            >
              {t("opening.next")}
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
        <aside className="opening-explanation">
          {!view.compact && <LessonStepCard view={view} />}
          <LessonBackground view={view} lesson={lesson} />
        </aside>
      </div>
    </SquareHighlightProvider>
  );
}
