import { useEffect, useMemo, useReducer, type SetStateAction } from "react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { watchOutFor } from "../../domain/coach/warnings.ts";
import type { GameController } from "../game/useGameController.ts";
import type { BoardPreview } from "../board/useBoardPreview.ts";
import type { Recommendations } from "./useRecommendations.ts";

type State = {
  active: number | null;
  hovered: number | null;
  bestFocused: boolean;
  hoveredWarning: boolean;
  focusedWarning: boolean;
};
const initial: State = {
  active: null,
  hovered: null,
  bestFocused: false,
  hoveredWarning: false,
  focusedWarning: false,
};
type Action =
  | { type: "reset" }
  | { type: "active"; value: SetStateAction<number | null> }
  | { type: "patch"; patch: Partial<State> };
function reduce(state: State, action: Action): State {
  if (action.type === "reset") return initial;
  if (action.type === "patch") return { ...state, ...action.patch };
  return {
    ...state,
    active:
      typeof action.value === "function"
        ? action.value(state.active)
        : action.value,
  };
}
export function useCoachPresentation(
  game: Pick<GameController, "analysisGame" | "analysisKey" | "playable">,
  recommendations: Recommendations,
  preview: BoardPreview,
) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reduce, initial);
  const actions = useMemo(
    () => ({
      setActive: (value: SetStateAction<number | null>) =>
        dispatch({ type: "active", value }),
      setHovered: (hovered: number | null) =>
        dispatch({ type: "patch", patch: { hovered } }),
      setBestFocused: (bestFocused: boolean) =>
        dispatch({ type: "patch", patch: { bestFocused } }),
      setHoveredWarning: (hoveredWarning: boolean) =>
        dispatch({ type: "patch", patch: { hoveredWarning } }),
      setFocusedWarning: (focusedWarning: boolean) =>
        dispatch({ type: "patch", patch: { focusedWarning } }),
    }),
    [],
  );
  const watching = useMemo(
    () => watchOutFor(game.analysisGame, t),
    [game.analysisGame, t],
  );
  const forcedMove = useMemo(
    () => !!recommendations.best && game.analysisGame.moves().length === 1,
    [game.analysisGame, recommendations.best],
  );
  useEffect(() => {
    dispatch({ type: "reset" });
  }, [
    game.analysisKey,
    game.playable,
    recommendations.analysis?.key,
    recommendations.thinking,
  ]);
  const index = state.hovered ?? (state.bestFocused ? 0 : (state.active ?? 0));
  return {
    ...actions,
    active: state.active,
    watching,
    forcedMove,
    shownCandidate: recommendations.candidates[index],
    showWarning:
      (state.hoveredWarning || state.focusedWarning) &&
      watching.target !== null &&
      game.playable &&
      recommendations.requested &&
      !!recommendations.best &&
      !preview.boardPreview,
  };
}
export type CoachPresentation = ReturnType<typeof useCoachPresentation>;
