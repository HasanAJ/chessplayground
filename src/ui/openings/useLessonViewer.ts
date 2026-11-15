import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Move } from "chess.js";
import type {
  OpeningLesson,
  OpeningBranch,
} from "../../content/openings/lessons.ts";
import { motifs } from "../../content/openings/content.ts";
import { teachingNote } from "../../content/openings/annotations.ts";
import { lessonPositions, setupLength } from "../../domain/openings/lesson.ts";
import {
  gameMoveLabel,
  opposite,
  sideName,
} from "../../domain/chess/position.ts";
import { lessonState } from "../../application/openings/lessonState.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import type { Translator } from "../../i18n/translate.ts";
import { useCompactLesson } from "./useCompactLesson.ts";
function idea(move: Move, t: Translator) {
  const key = move.san.endsWith("#")
    ? "opening.idea.mate"
    : move.promotion === "n"
      ? "opening.idea.underpromotion"
      : move.san.endsWith("+")
        ? "opening.idea.check"
        : move.isKingsideCastle() || move.isQueensideCastle()
          ? "opening.idea.castle"
          : move.captured
            ? "opening.idea.capture"
            : (`opening.idea.${move.piece}` as const);
  return t(key, move.to);
}
export function useLessonViewer(lesson: OpeningLesson, active: boolean) {
  const { t, language } = useTranslation();
  const [state, dispatch] = useReducer(lessonState, {
    branch: "trap",
    step: 0,
  });
  const [flipped, setFlipped] = useState(lesson.side === "b");
  const compact = useCompactLesson();
  const heading = useRef<HTMLHeadingElement>(null),
    titleRow = useRef<HTMLDivElement>(null);
  const positions = useMemo(
    () => lessonPositions(lesson, state.branch),
    [lesson, state.branch],
  );
  const frame = positions[state.step],
    total = positions.length - 1,
    setup = setupLength(lesson);
  const temptation = setup + lesson.temptation + 1,
    isTemptation = state.branch === "trap" && state.step === temptation;
  const note = teachingNote(lesson, state.branch, state.step);
  const explanation = frame.move
    ? (note?.explanation[language] ?? idea(frame.move, t))
    : state.branch === "trap"
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
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    titleRow.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);
  useEffect(() => {
    if (!active) return;
    const keydown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !(event.target instanceof window.HTMLElement)
      )
        return;
      if (
        event.target.closest(
          "input, select, textarea, [contenteditable], [role=tablist]",
        )
      )
        return;
      const offset =
        event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (offset === 0) return;
      event.preventDefault();
      dispatch({ type: "advance", offset, total });
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [active, total]);
  return {
    ...state,
    flipped,
    compact,
    heading,
    titleRow,
    frame,
    total,
    isTemptation,
    note,
    explanation,
    motif: motifs[lesson.motif],
    finished: state.step === total,
    stage:
      state.step <= setup
        ? ("setup" as const)
        : isTemptation
          ? ("temptation" as const)
          : state.branch === "defense"
            ? ("defense" as const)
            : ("attack" as const),
    stepTitle:
      state.step === 0
        ? ("opening.beforeStart" as const)
        : isTemptation
          ? ("opening.stage.temptation" as const)
          : ("opening.moveIdea" as const),
    flip: () => setFlipped((current) => !current),
    changeStep: (step: number) => dispatch({ type: "step", step, total }),
    changeBranch: (branch: OpeningBranch) =>
      dispatch({ type: "branch", branch }),
  };
}
export type LessonView = ReturnType<typeof useLessonViewer>;
