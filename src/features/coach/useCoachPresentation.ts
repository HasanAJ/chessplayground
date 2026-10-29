import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useMemo, useState } from "react";
import type { GameController } from "../game/useGameController";
import type { BoardPreview } from "../board/useBoardPreview";
import type { Recommendations } from "./useRecommendations";
import { watchOutFor } from "./warnings";

export function useCoachPresentation(
  game: Pick<GameController, "analysisGame" | "analysisKey" | "playable">,
  recommendations: Recommendations,
  preview: BoardPreview,
) {
  const { t } = useTranslation();
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [bestFocused, setBestFocused] = useState(false);
  const [hoveredWarning, setHoveredWarning] = useState(false);
  const [focusedWarning, setFocusedWarning] = useState(false);
  const { best, candidates } = recommendations;
  const watching = useMemo(
    () => watchOutFor(game.analysisGame, t),
    [game.analysisGame, t],
  );
  const forcedMove = useMemo(
    () => !!best && game.analysisGame.moves().length === 1,
    [game.analysisGame, best],
  );
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
    setHoveredWarning,
    setFocusedWarning,
    watching,
    forcedMove,
    shownCandidate,
    showWarning,
  };
}

export type CoachPresentation = ReturnType<typeof useCoachPresentation>;
