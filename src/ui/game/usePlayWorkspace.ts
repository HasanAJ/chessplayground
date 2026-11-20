import { useCallback, useEffect, useRef, useState } from "react";
import { practicePositions } from "../../content/practice/positions.ts";
import {
  choosePracticePosition,
  RECENT_PRACTICE_LIMIT,
} from "../../domain/practice/positions.ts";
import { useGameController, type GameController } from "./useGameController.ts";
import { useBoardPreview } from "../board/useBoardPreview.ts";
import { scrollToBoard } from "../board/scrollToBoard.ts";
import { useCoachPresentation } from "../coach/useCoachPresentation.ts";
import { useMoveReview } from "../coach/useMoveReview.ts";
import { useRecommendations } from "../coach/useRecommendations.ts";
import { useComputerSettings } from "../computer/useComputerSettings.ts";
import { useComputerTurn } from "../computer/useComputerTurn.ts";
import { usePanelFocus } from "../shell/usePanelFocus.ts";

export function usePlayWorkspace(active: boolean) {
  const [dragging, setDragging] = useState(false);
  const [selectionReset, setSelectionReset] = useState(0);
  const recentPractice = useRef<string[]>([]);
  const computer = useComputerSettings();
  const game = useGameController(computer.disable);
  const preview = useBoardPreview(game.analysisKey, game.playable);
  const botTurn =
    computer.enabled &&
    !computer.open &&
    !game.reviewing &&
    game.positionGame.turn() !== computer.side;
  const recommendations = useRecommendations(game, botTurn || !active);
  const presentation = useCoachPresentation(game, recommendations, preview);
  const opponent = useComputerTurn(
    game,
    computer,
    botTurn,
    !active || preview.boardPreview || dragging,
  );
  const [reviewRetry, setReviewRetry] = useState(0);
  const feedbackPly =
    computer.enabled && !game.reviewing
      ? game.history.reduce(
          (ply, move, index) =>
            move.color === computer.side ? index + 1 : ply,
          game.history.length,
        )
      : (game.historyPly ?? game.history.length);
  const reviewPaused =
    !active ||
    dragging ||
    recommendations.thinking ||
    (botTurn && opponent.state !== "error");
  const feedback = useMoveReview(
    game,
    game.playable ? feedbackPly : null,
    reviewRetry,
    reviewPaused,
  );
  // Computer play can keep feedback on the human's move after the reply.
  const reviewEvaluation =
    game.playable &&
    feedbackPly === (game.historyPly ?? game.history.length) &&
    feedback?.state === "ready"
      ? feedback.review.evaluation
      : undefined;
  const storageError = game.storageError || computer.storageError;
  usePanelFocus(game.promotion, () => game.setPromotion(null));
  useEffect(() => {
    if (!game.playable) computer.setOpen(false);
  }, [game.playable]);

  function newGame() {
    preview.clearPreview();
    game.newGame();
    computer.setOpen(false);
  }

  function randomPosition() {
    const position = choosePracticePosition(practicePositions, {
      recent: recentPractice.current,
      currentFen: game.analysisFen,
      side: computer.enabled ? computer.side : undefined,
    });
    recentPractice.current = [...recentPractice.current, position.id].slice(
      -RECENT_PRACTICE_LIMIT,
    );
    preview.clearPreview();
    recommendations.clear();
    game.startGame(position.fen);
    computer.setOpen(false);
  }

  const showHistory = useCallback(
    (ply: number) => {
      preview.clearPreview();
      recommendations.clear();
      game.showHistory(ply);
      setSelectionReset((value) => value + 1);
      scrollToBoard();
    },
    [preview.clearPreview, recommendations.clear, game.showHistory],
  );

  const playSuggestedMove: GameController["playMove"] = (from, to, promote) => {
    if (botTurn) return;
    preview.clearPreview();
    game.playMove(from, to, promote);
  };

  function calculateBestMoves(reuseAnalysis = false) {
    if (!game.playable) return;
    preview.clearPreview();
    game.setTool("move");
    setSelectionReset((value) => value + 1);
    game.setError(null);
    if (!reuseAnalysis) recommendations.calculate(recommendations.requested);
    if (window.matchMedia("(max-width: 900px)").matches)
      document.getElementById("coach")?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }

  return {
    game,
    preview,
    computer,
    botTurn,
    recommendations,
    presentation,
    opponent,
    feedback,
    feedbackPly,
    reviewEvaluation,
    storageError,
    selectionReset,
    setDragging,
    newGame,
    randomPosition,
    showHistory,
    playSuggestedMove,
    calculateBestMoves,
    retryReview: () => setReviewRetry((value) => value + 1),
  };
}
