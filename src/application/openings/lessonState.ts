import type { OpeningBranch } from "../../content/openings/lessons.ts";
type LessonState = { branch: OpeningBranch; step: number };
type LessonAction =
  | { type: "branch"; branch: OpeningBranch }
  | { type: "step"; step: number; total: number }
  | { type: "advance"; offset: number; total: number };
export function lessonState(
  state: LessonState,
  action: LessonAction,
): LessonState {
  if (action.type === "branch")
    return state.branch === action.branch
      ? state
      : { branch: action.branch, step: 0 };
  const next =
    action.type === "advance" ? state.step + action.offset : action.step;
  return {
    ...state,
    step: Math.max(0, Math.min(action.total, Math.trunc(next))),
  };
}
