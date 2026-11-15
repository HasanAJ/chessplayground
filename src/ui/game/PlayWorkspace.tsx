import { BoardPanel } from "../board/BoardPanel.tsx";
import { SquareHighlightProvider } from "../board/SquareHighlight.tsx";
import { CoachPanel } from "../coach/CoachPanel.tsx";
import { SaveNotice } from "./SaveNotice.tsx";
import { PageHeading } from "../shell/PageHeading.tsx";
import { usePlayWorkspace } from "./usePlayWorkspace.ts";

export function PlayWorkspace({ active }: { active: boolean }) {
  const {
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
    showHistory,
    playSuggestedMove,
    calculateBestMoves,
    retryReview,
  } = usePlayWorkspace(active);
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
            onReviewRetry={retryReview}
            onCalculate={calculateBestMoves}
            onNewGame={newGame}
            onShowHistory={showHistory}
          />
        </div>
      </SquareHighlightProvider>
    </section>
  );
}
