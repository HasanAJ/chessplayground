import { useEffect, useMemo, useState } from "react";
import type { GameController } from "../game/useGameController";
import type { BoardPreview } from "../board/useBoardPreview";
import type { Recommendations } from "./useRecommendations";
import { strategyInsight } from "./strategy";
import { watchOutFor } from "./warnings";

export function useCoachPresentation(
  game: GameController,
  recommendations: Recommendations,
  preview: BoardPreview,
) {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [bestFocused, setBestFocused] = useState(false);
  const [focusStrategy, setFocusStrategy] = useState(false);
  const [previewStrategy, setPreviewStrategy] = useState(false);
  const [hoveredWarning, setHoveredWarning] = useState(false);
  const [focusedWarning, setFocusedWarning] = useState(false);
  const { best, candidates } = recommendations;
  const insight = useMemo(
    () =>
      best
        ? strategyInsight(
            game.analysisGame,
            best,
            candidates[1],
            game.reviewing ? game.reviewedMove : game.lastMove,
          )
        : null,
    [
      game.analysisGame,
      best,
      candidates,
      game.reviewing,
      game.reviewedMove,
      game.lastMove,
    ],
  );
  const watching = useMemo(
    () => watchOutFor(game.analysisGame),
    [game.analysisGame],
  );
  const forcedMove = !!best && game.analysisGame.moves().length === 1;
  const shownCandidate =
    candidates[hovered ?? (bestFocused ? 0 : (active ?? 0))];
  const showWarning =
    (hoveredWarning || focusedWarning) &&
    !!watching.target &&
    game.playable &&
    recommendations.requested &&
    !!best &&
    !preview.boardPreview;
  useEffect(() => {
    setActive(null);
    setHovered(null);
    setBestFocused(false);
    setFocusStrategy(false);
    setPreviewStrategy(false);
    setHoveredWarning(false);
    setFocusedWarning(false);
  }, [
    game.analysisKey,
    game.playable,
    recommendations.analysis?.key,
    recommendations.thinking,
  ]);
  return {
    active,
    setActive,
    setHovered,
    setBestFocused,
    focusStrategy,
    setFocusStrategy,
    previewStrategy,
    setPreviewStrategy,
    setHoveredWarning,
    setFocusedWarning,
    insight,
    watching,
    forcedMove,
    shownCandidate,
    showWarning,
  };
}

export type CoachPresentation = ReturnType<typeof useCoachPresentation>;
