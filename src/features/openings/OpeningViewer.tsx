import { useEffect, useMemo, useRef, useState } from "react";
import type { Move } from "chess.js";
import {
  ArrowDownUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider";
import type { Translator } from "../../i18n/translate";
import { gameMoveLabel, opposite, sideName } from "../../chess/position";
import { moveDescription } from "../../chess/moves";
import { BoardGrid } from "../board/BoardGrid";
import { SquareHighlightProvider, SquareText } from "../board/SquareHighlight";
import { motifs } from "./content";
import {
  lessonPositions,
  setupLength,
  type OpeningBranch,
  type OpeningLesson,
} from "./lessons";
import { teachingNote } from "./annotations";
import { OpeningArrows } from "./OpeningArrows";
import { useCompactLesson } from "./useCompactLesson";
import { openingPath } from "../../i18n/routes";

function moveIdea(move: Move, t: Translator) {
  if (move.san.endsWith("#")) return t("opening.idea.mate");
  if (move.promotion === "n") return t("opening.idea.underpromotion");
  if (move.san.endsWith("+")) return t("opening.idea.check");
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return t("opening.idea.castle");
  if (move.captured) return t("opening.idea.capture");
  return t(`opening.idea.${move.piece}`, move.to);
}

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
  const compact = useCompactLesson();
  const [{ branch, step }, setView] = useState<{
    branch: OpeningBranch;
    step: number;
  }>({ branch: "trap", step: 0 });
  const [flipped, setFlipped] = useState(lesson.side === "b");
  const heading = useRef<HTMLHeadingElement>(null);
  const titleRow = useRef<HTMLDivElement>(null);
  const positions = useMemo(
    () => lessonPositions(lesson, branch),
    [lesson, branch],
  );
  const frame = positions[step];
  const total = positions.length - 1;
  const setup = setupLength(lesson);
  const temptation = setup + lesson.temptation + 1;
  const finished = step === total;
  const motif = motifs[lesson.motif];
  const isTemptation = branch === "trap" && step === temptation;
  const note = teachingNote(lesson, branch, step);
  const focusSquares = note?.squares;
  const changeStep = (next: number) => setView({ branch, step: next });
  const explanation = frame.move
    ? (note?.explanation[language] ?? moveIdea(frame.move, t))
    : branch === "trap"
      ? t(
          "opening.start.trap",
          sideName(lesson.side, t),
          gameMoveLabel(positions[temptation].move!),
        )
      : t(
          "opening.start.defense",
          sideName(opposite(lesson.side), t),
          gameMoveLabel(positions[setup + 1].move!),
        );
  const stage =
    step <= setup
      ? "setup"
      : isTemptation
        ? "temptation"
        : branch === "defense"
          ? "defense"
          : "attack";
  const stepTitle =
    step === 0
      ? "opening.beforeStart"
      : isTemptation
        ? "opening.stage.temptation"
        : "opening.moveIdea";
  const resultTitle =
    branch === "defense" ? "opening.result.defense" : "opening.complete";

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    titleRow.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);
  useEffect(() => {
    if (!active) return;
    const navigate = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !(event.target instanceof window.HTMLElement) ||
        event.target.closest(
          "input, select, textarea, [contenteditable], [role=tablist]",
        )
      )
        return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      setView((current) => ({
        ...current,
        step: Math.max(
          0,
          Math.min(total, current.step + (event.key === "ArrowRight" ? 1 : -1)),
        ),
      }));
    };
    document.addEventListener("keydown", navigate);
    return () => document.removeEventListener("keydown", navigate);
  }, [active, total]);

  const stepCard = (
    <div
      className={`opening-step-card ${isTemptation ? "is-temptation" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="eyebrow">{t(stepTitle)}</span>
      <h3>
        <SquareText
          text={
            frame.move ? gameMoveLabel(frame.move) : t("opening.startPosition")
          }
        />
      </h3>
      {frame.move && (
        <p className="opening-move-description">
          <SquareText text={moveDescription(frame.move, t)} />
        </p>
      )}
      <p>
        <SquareText text={explanation} />
      </p>
    </div>
  );

  return (
    <SquareHighlightProvider
      positionKey={`${lesson.id}:${branch}:${active ? frame.fen : "inactive"}`}
    >
      <div className="opening-lesson-header">
        <div className="opening-title-row" ref={titleRow}>
          <a
            className="opening-back"
            href={openingPath(language)}
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
            aria-label={t("opening.backToLibrary")}
            title={t("opening.backToLibrary")}
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </a>
          <h1 tabIndex={-1} ref={heading}>
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
          <SquareText text={motif.title[language]} />
        </p>
      </div>
      <div
        className="opening-branches"
        role="group"
        aria-label={t("opening.branch.label")}
      >
        {(["trap", "defense"] as const).map((value) => (
          <button
            key={value}
            data-opening-branch={value}
            aria-pressed={branch === value}
            onClick={() => {
              if (branch !== value) setView({ branch: value, step: 0 });
            }}
          >
            {t(`opening.branch.${value}`)}
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
              className={`opening-stage ${isTemptation ? "temptation" : ""}`}
            >
              {t(`opening.stage.${stage}`)}
            </span>
            <button
              className="icon-button"
              aria-label={t("board.flip")}
              title={t("board.flip")}
              onClick={() => setFlipped((current) => !current)}
            >
              <ArrowDownUp size={17} />
            </button>
          </div>
          <BoardGrid
            position={frame.position}
            flipped={flipped}
            lastMove={frame.move}
            checkedKing={frame.checkedKing}
            focusSquares={focusSquares}
            label={t("opening.board.label", step, total)}
            className="opening-board"
          >
            {note && <OpeningArrows arrows={note.arrows} flipped={flipped} />}
          </BoardGrid>
          {compact && stepCard}
          <div className="opening-progress">
            <span>{t("opening.step", step, total)}</span>
            <progress
              max={total}
              value={step}
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
              disabled={step === 0}
              onClick={() => changeStep(step - 1)}
            >
              <ChevronLeft size={18} />
              {t("opening.previous")}
            </button>
            <button
              className="opening-restart"
              aria-label={t("opening.restart")}
              title={t("opening.restart")}
              disabled={step === 0}
              onClick={() => changeStep(0)}
            >
              <RotateCcw size={17} />
              <span>{t("opening.restart")}</span>
            </button>
            <button
              className="opening-nav-button opening-forward"
              disabled={finished}
              onClick={() => changeStep(step + 1)}
            >
              {t("opening.next")}
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
        <aside className="opening-explanation">
          {!compact && stepCard}
          <details className="opening-background" open={!compact}>
            <summary>{t("opening.background")}</summary>
            <div className="opening-background-content">
              <div className="opening-plan">
                <h3>{t("opening.plan")}</h3>
                <p>
                  <SquareText text={motif.plan[language]} />
                </p>
              </div>
              <div className="opening-mistake">
                <h3>{t("opening.mistake")}</h3>
                <p>
                  <SquareText text={motif.temptation[language]} />
                </p>
              </div>
              <div className="opening-defense">
                <h3>{t("opening.defense")}</h3>
                <p>
                  <SquareText text={motif.defense[language]} />
                </p>
                <span className={`opening-risk ${lesson.risk}`}>
                  {t(`opening.risk.${lesson.risk}`)}
                </span>
                <p className="opening-risk-detail">
                  {t(`opening.risk.detail.${lesson.risk}`)}
                </p>
              </div>
            </div>
          </details>
          {finished && !frame.checkmate && (
            <div className="opening-complete" role="status">
              <h3>{t(resultTitle)}</h3>
              <p>
                {branch === "trap"
                  ? t(`opening.reward.${lesson.reward}`)
                  : t("opening.defense.takeaway")}
              </p>
              <button onClick={() => changeStep(0)}>
                <RotateCcw size={15} />
                {t("opening.restart")}
              </button>
            </div>
          )}
        </aside>
      </div>
    </SquareHighlightProvider>
  );
}
