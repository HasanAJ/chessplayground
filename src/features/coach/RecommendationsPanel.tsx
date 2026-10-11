import { translateNotice } from "../../i18n/notices";
import { useTranslation } from "../../i18n/LanguageProvider";
import { LoaderCircle, RotateCcw, ShieldAlert } from "lucide-react";
import { sideName } from "../../chess/position";
import type { GameController } from "../game/useGameController";
import { GameOverCard } from "../game/GameOverCard";
import type { ComputerSettings } from "../computer/useComputerOpponent";
import type { BoardController } from "../board/useBoardInteractions";
import type { BoardPreview } from "../board/useBoardPreview";
import type { Recommendations } from "./useRecommendations";
import type { CoachPresentation } from "./useCoachPresentation";
import { BestMoveContent } from "./BestMoveContent";
import { AlternativeMoves } from "./AlternativeMoves";
import { PositionDetails } from "./PositionDetails";
import { SquareText } from "../board/SquareHighlight";

type Props = {
  game: GameController;
  board: BoardController;
  preview: BoardPreview;
  computer: ComputerSettings;
  botTurn: boolean;
  recommendations: Recommendations;
  presentation: CoachPresentation;
  onNewGame: () => void;
};

export function RecommendationsPanel({
  game,
  board,
  preview,
  computer: settings,
  botTurn,
  recommendations,
  presentation,
  onNewGame: newGame,
}: Props) {
  const { t } = useTranslation();
  const {
    analysisGame,
    analysisKey,
    analysisTerminal,
    reviewing,
    reviewLabel: rawReviewLabel,
    lastMove,
  } = game;
  const {
    candidates,
    best,
    thinking,
    requested: analysisRequested,
    current: isCurrent,
    continuity,
  } = recommendations;
  const reviewLabel = translateNotice(rawReviewLabel, t);
  const analysis = recommendations.analysis!;
  const turn = analysisGame.turn();
  const computer = settings.enabled,
    humanSide = settings.side;
  const { inspection, inspectMove, clearPreview, boardPreview } = preview;
  const { playSuggestedMove: playMove } = board;
  const {
    forcedMove,
    setHovered,
    setBestFocused,
    insight,
    watching,
    focusStrategy,
    setFocusStrategy,
    setPreviewStrategy,
    setHoveredWarning,
    setFocusedWarning,
  } = presentation;
  return (
    <>
      {game.playable && analysisTerminal ? (
        <GameOverCard
          key={analysisKey}
          game={analysisGame}
          reason={analysisTerminal}
          humanSide={computer ? humanSide : undefined}
          animate={!reviewing && !!lastMove}
          onPlayAgain={newGame}
        />
      ) : !game.playable || !analysisRequested || botTurn ? null : (
        <>
          <div className="sr-only" role="status">
            {thinking
              ? t("coach.analysis.status.thinking")
              : analysis.state === "error"
                ? t("coach.analysis.status.unavailable")
                : t("coach.analysis.status.ready")}
          </div>
          {reviewing && (
            <p className="analysis-context">
              <SquareText
                text={t(
                  "coach.analysis.reviewingPosition",
                  reviewLabel,
                )}
              />
            </p>
          )}
          {isCurrent && analysis.state === "error" ? (
            <div className="engine-error" role="alert">
              <ShieldAlert size={22} />
              <h3>{t("coach.analysis.errorHeading")}</h3>
              <p>
                <SquareText text={translateNotice(analysis.error ?? "", t)} />
              </p>
              <button
                className="primary-button"
                onClick={recommendations.calculate}
              >
                {t("coach.analysis.retry")}
                <RotateCcw size={15} />
              </button>
            </div>
          ) : (
            <>
              <section
                className={`strategy-card ${thinking ? "strategy-loading" : ""}`}
                aria-label={t("coach.analysis.label")}
                aria-busy={thinking}
                onMouseEnter={() => setHovered(0)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setBestFocused(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setBestFocused(false);
                }}
              >
                {best && !thinking ? (
                  <BestMoveContent
                    key={`${analysisKey}:${best.move.lan}`}
                    candidate={best}
                    forcedMove={forcedMove}
                    continuity={continuity}
                    preview={inspection}
                    onInspect={inspectMove}
                    onPlay={() =>
                      playMove(
                        best.move.from,
                        best.move.to,
                        best.move.promotion,
                      )
                    }
                  />
                ) : (
                  <>
                    <div className="card-eyebrow">
                      <LoaderCircle size={16} className="spin" />
                      <span>{t("coach.analysis.search.heading")}</span>
                    </div>
                    <h3>{t("coach.analysis.search.bestMove", sideName(turn, t))}</h3>
                    <p>
                      {reviewing
                        ? t("coach.analysis.search.history")
                        : t("coach.analysis.search.live")}
                    </p>
                    <div className="analysis-progress" aria-hidden="true">
                      <span />
                    </div>
                    <p className="analysis-timing">
                      {analysis.depth > 0 && isCurrent
                        ? t("coach.analysis.search.depth", analysis.depth)
                        : t("coach.analysis.search.estimate")}
                    </p>
                  </>
                )}
              </section>
              {best && !thinking && (
                <PositionDetails
                  key={`${analysisKey}:${best.move.lan}`}
                  candidate={best}
                  insight={insight}
                  forcedMove={forcedMove}
                  inCheck={analysisGame.inCheck()}
                  highlighted={focusStrategy}
                  onHighlightPreviewChange={setPreviewStrategy}
                  onHighlightChange={(enabled) => {
                    if (enabled) clearPreview();
                    else {
                      setHoveredWarning(false);
                      setFocusedWarning(false);
                    }
                    setFocusStrategy(enabled);
                  }}
                >
                  {watching.target && !analysisGame.inCheck() && (
                    <p
                      className="strategy-warning"
                      aria-label={t("coach.warnings.heading")}
                      tabIndex={!boardPreview ? 0 : undefined}
                      title={
                        !boardPreview
                          ? t("coach.warnings.description")
                          : undefined
                      }
                      onMouseEnter={() => setHoveredWarning(true)}
                      onMouseLeave={() => setHoveredWarning(false)}
                      onFocus={() => setFocusedWarning(true)}
                      onBlur={() => setFocusedWarning(false)}
                    >
                      <ShieldAlert size={14} />
                      <span>
                        <SquareText text={`${watching.text.split(". ")[0]}.`} />
                      </span>
                    </p>
                  )}
                </PositionDetails>
              )}
              {!thinking && (
                <AlternativeMoves
                  candidates={candidates}
                  board={board}
                  preview={preview}
                  presentation={presentation}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
