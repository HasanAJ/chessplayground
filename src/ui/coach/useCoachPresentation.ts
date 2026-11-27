import { useEffect, useMemo, useReducer, useState } from "react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { moveHints } from "../../domain/coach/hints.ts";
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
  hintStep: number;
};
const initial: State = {
  active: null,
  hovered: null,
  bestFocused: false,
  hoveredWarning: false,
  focusedWarning: false,
  hintStep: 0,
};
type Action = { type: "reset" } | { type: "patch"; patch: Partial<State> };
function reduce(state: State, action: Action): State {
  return action.type === "reset" ? initial : { ...state, ...action.patch };
}
export function useCoachPresentation(
  game: Pick<GameController, "analysisGame" | "analysisKey" | "playable">,
  recommendations: Recommendations,
  preview: BoardPreview,
) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reduce, initial);
  const [hintKey, setHintKey] = useState<string | null>(null);
  const hinting = game.playable && hintKey === game.analysisKey;
  const hintedCandidate = hinting ? recommendations.best : undefined;
  const hints = useMemo(
    () => (hintedCandidate ? moveHints(hintedCandidate, t) : []),
    [hintedCandidate, t],
  );
  useEffect(() => {
    setHintKey(null);
  }, [game.analysisKey, game.playable]);
  const actions = useMemo(
    () => ({
      setActive: (active: number | null) =>
        dispatch({ type: "patch", patch: { active } }),
      setHovered: (hovered: number | null) =>
        dispatch({ type: "patch", patch: { hovered } }),
      setBestFocused: (bestFocused: boolean) =>
        dispatch({ type: "patch", patch: { bestFocused } }),
      setHoveredWarning: (hoveredWarning: boolean) =>
        dispatch({ type: "patch", patch: { hoveredWarning } }),
      setFocusedWarning: (focusedWarning: boolean) =>
        dispatch({ type: "patch", patch: { focusedWarning } }),
      setHintStep: (hintStep: number) =>
        dispatch({ type: "patch", patch: { hintStep } }),
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
  const hintStep = Math.max(0, Math.min(state.hintStep, hints.length - 1));
  return {
    ...actions,
    hinting,
    hints,
    hintStep,
    hintSquares: hints[hintStep]?.squares,
    startHints: () => {
      if (!hinting) actions.setHintStep(0);
      setHintKey(game.analysisKey);
    },
    revealMove: () => setHintKey(null),
    active: state.active,
    watching,
    forcedMove,
    shownCandidate: hinting ? undefined : recommendations.candidates[index],
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
