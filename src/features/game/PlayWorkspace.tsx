import { useCallback, useEffect, useState } from "react";
import { useGameController, type GameController } from "./useGameController";
import { BoardPanel } from "../board/BoardPanel";
import { useBoardPreview } from "../board/useBoardPreview";
import { scrollToBoard } from "../board/scrollToBoard";
import { SquareHighlightProvider } from "../board/SquareHighlight";
import { CoachPanel } from "../coach/CoachPanel";
import { useCoachPresentation } from "../coach/useCoachPresentation";
import { useMoveReview } from "../coach/useMoveReview";
import { useRecommendations } from "../coach/useRecommendations";
import { useComputerSettings } from "../computer/useComputerSettings";
import { useComputerTurn } from "../computer/useComputerTurn";
import { SaveNotice } from "./SaveNotice";
import { usePanelFocus } from "../../app/usePanelFocus";
import { PageHeading } from "../../app/PageHeading";

export function PlayWorkspace({ active }: { active: boolean }) {
  const [dragging, setDragging] = useState(false);
  const [selectionReset, setSelectionReset] = useState(0);
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

  function calculateBestMoves() {
    if (!game.playable) return;
    preview.clearPreview();
    game.setTool("move");
    setSelectionReset((value) => value + 1);
    game.setError("");
    recommendations.calculate(recommendations.requested);
    if (window.matchMedia("(max-width: 900px)").matches)
      document.getElementById("coach")?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }

  return (
    <section
      id="play-workspace"
      role="tabpanel"
      aria-labelledby="play-tab"
      hidden={!active}
    >
      <PageHeading />

      <SaveNotice
        error={storageError}
        recovery={game.recovery}
        paused={game.autosavePaused}
        onResume={game.resumeAutosave}
        onDismiss={game.dismissRecovery}
      />

      <SquareHighlightProvider positionKey={game.analysisKey}>
        <div className="workspace">
          <BoardPanel
            game={game}
            preview={preview}
            computer={computer}
            botTurn={botTurn}
            onDraggingChange={setDragging}
            selectionReset={selectionReset}
            analysis={recommendations}
            reviewEvaluation={reviewEvaluation}
            highlights={presentation}
            onNewGame={newGame}
            onShowHistory={showHistory}
          />
          <CoachPanel
            game={game}
            preview={preview}
            computer={computer}
            opponent={opponent}
            onPlayMove={playSuggestedMove}
            recommendations={recommendations}
            presentation={presentation}
            feedback={feedback}
            feedbackPly={feedbackPly}
            onReviewRetry={() => setReviewRetry((value) => value + 1)}
            onCalculate={calculateBestMoves}
            onNewGame={newGame}
            onShowHistory={showHistory}
          />
        </div>
      </SquareHighlightProvider>
    </section>
  );
}
