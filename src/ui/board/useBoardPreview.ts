import { useCallback, useEffect, useMemo, useReducer } from "react";
import { Chess } from "chess.js";
import type { Candidate } from "../../domain/coach/candidatePresentation.ts";
import type { BoardFocus } from "../../domain/coach/boardFocus.ts";
import type { LessonWalkthrough } from "../../domain/coach/lessonWalkthrough.ts";

export type MovePreview = {
  candidate: Candidate;
  ply: number;
  focus?: BoardFocus;
  walkthrough?: LessonWalkthrough;
};
type Input = "hover" | "focus" | "click";
type Inspection = MovePreview & { key: string };
type State = Record<Input, Inspection | null>;
type Action =
  | { type: "inspect"; input: Input; inspection: Inspection }
  | { type: "clear"; input?: Input; candidate?: Candidate };
const empty: State = { hover: null, focus: null, click: null };
function reducer(state: State, action: Action): State {
  if (action.type === "inspect")
    return {
      ...(action.input === "click" ? empty : state),
      [action.input]: action.inspection,
    };
  const next = { ...state };
  for (const input of ["hover", "focus", "click"] as const)
    if (
      (!action.input || action.input === input) &&
      (!action.candidate || state[input]?.candidate === action.candidate)
    )
      next[input] = null;
  return next.hover === state.hover &&
    next.focus === state.focus &&
    next.click === state.click
    ? state
    : next;
}
export type InspectMove = (
  candidate: Candidate,
  ply: number,
  input: Input,
  focus?: BoardFocus,
  walkthrough?: LessonWalkthrough,
) => void;
export type ClearInspection = (candidate: Candidate, input?: Input) => void;

export function useBoardPreview(key: string, enabled: boolean) {
  const [state, dispatch] = useReducer(reducer, empty);
  const valid = (inspection: Inspection | null) =>
    enabled &&
    inspection?.key === key &&
    inspection.candidate.continuation[inspection.ply - 1]
      ? inspection
      : null;
  const inspection =
    valid(state.hover) ?? valid(state.focus) ?? valid(state.click);
  const pinnedInspection = valid(state.click);
  const inspectionMove = inspection?.candidate.continuation[inspection.ply - 1];
  const previewGame = useMemo(
    () => (inspectionMove ? new Chess(inspectionMove.after) : null),
    [inspectionMove],
  );
  const inspectMove: InspectMove = useCallback(
    (candidate, ply, input, focus, walkthrough) => {
      if (!candidate.continuation[ply - 1]) return;
      dispatch({
        type: "inspect",
        input,
        inspection: { key, candidate, ply, focus, walkthrough },
      });
    },
    [key],
  );
  const clearInspection: ClearInspection = useCallback(
    (candidate, input) => dispatch({ type: "clear", candidate, input }),
    [],
  );
  const clearPreview = useCallback(() => dispatch({ type: "clear" }), []);
  useEffect(clearPreview, [key, enabled, clearPreview]);
  useEffect(() => {
    if (!inspection) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearPreview();
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [!!inspection, clearPreview]);
  return {
    inspection,
    pinnedInspection,
    inspectionMove,
    previewGame,
    boardPreview: !!inspection,
    pinned: !!inspection && inspection === pinnedInspection,
    inspectMove,
    clearInspection,
    clearPreview,
  };
}
export type BoardPreview = ReturnType<typeof useBoardPreview>;
