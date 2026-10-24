import { translateNotice } from "../../i18n/notices";
import type { Translator } from "../../i18n/translate";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useMemo, useState } from "react";
import {
  Check,
  Clock3,
  Eye,
  LoaderCircle,
  ShieldAlert,
  Sparkles,
  X,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { ending, gameMoveLabel, sideName } from "../../chess/position";
import type { GameController } from "../game/useGameController";
import { CoachOptions } from "../computer/CoachOptions";
import type {
  ComputerSettings,
  ComputerTurn,
} from "../computer/useComputerOpponent";
import type { BoardPreview } from "../board/useBoardPreview";
import { PromotionCard } from "../game/PromotionCard";
import { MoveFeedback } from "./MoveFeedback";
import type { ReviewState } from "./moveReview";
import type { Recommendations } from "./useRecommendations";
import type { CoachPresentation } from "./useCoachPresentation";
import { RecommendationsPanel } from "./RecommendationsPanel";
import { SquareText } from "../board/SquareHighlight";

type Props = {
  game: GameController;
  onPlayMove: GameController["playMove"];
  preview: BoardPreview;
  computer: ComputerSettings;
  opponent: ComputerTurn;
  recommendations: Recommendations;
  presentation: CoachPresentation;
  feedback: ReviewState | null;
  feedbackPly: number;
  onReviewRetry: () => void;
  onCalculate: () => void;
  onNewGame: () => void;
  onShowHistory: (ply: number) => void;
};

export function CoachPanel({
  game,
  onPlayMove,
  preview,
  computer: settings,
  opponent,
  recommendations,
  presentation,
  feedback,
  feedbackPly,
  onReviewRetry,
  onCalculate: calculateBestMoves,
  onNewGame,
  onShowHistory: showHistory,
}: Props) {
  const { t } = useTranslation();
  const [collapsedFeedbackKey, setCollapsedFeedbackKey] = useState<
    string | null
  >(null);
  const {
    analysisGame,
    analysisTerminal,
    terminal,
    history,
    historyPly,
    reviewing,
    reviewLabel: rawReviewLabel,
    notice,
    error,
    setError,
    promotion,
    setPromotion,
  } = game;
  const { thinking, requested: analysisRequested } = recommendations;
  const { boardPreview, inspectionMove, inspectMove } = preview;
  const displayedGame = preview.previewGame ?? analysisGame;
  const checkedKing = game.playable && displayedGame.isCheck();
  const displayedEnding = useMemo(
    () => {
      if (!game.playable) return null;
      return preview.previewGame ? ending(preview.previewGame) : analysisTerminal;
    },
    [game.playable, preview.previewGame, analysisTerminal],
  );
  const { turn: botTurn, busy: botBusy, state: botState } = opponent;
  const {
    enabled: computer,
    open: optionsOpen,
    side: humanSide,
    difficulty,
    setSide: setHumanSide,
    setDifficulty,
    setOpen: setOptionsOpen,
    setEnabled: setComputer,
  } = settings;
  const turn = analysisGame.turn();
  const reviewLabel = translateNotice(rawReviewLabel, t);
  const feedbackMove = history[feedbackPly - 1];
  const calculateReason = translateNotice(game.positionIssue ?? "", t);
  const turnStatus = displayedEnding
    ? (boardPreview ? preview.previewGame! : analysisGame).isCheckmate()
      ? t("coach.status.checkmate")
      : t("coach.status.draw")
    : boardPreview
      ? checkedKing
        ? t("coach.status.previewCheck")
        : t("coach.status.preview")
      : checkedKing
        ? t("coach.status.check")
        : computer && optionsOpen
          ? t("coach.status.paused")
          : botTurn
            ? botState === "waiting"
              ? t("coach.status.replying")
              : t("coach.status.thinking")
            : reviewing
              ? t("coach.status.reviewing")
              : computer
                ? t("coach.status.yourTurn")
                : t(turn === "w" ? "board.turn.white" : "board.turn.black");
  const showRefresh =
    analysisRequested && game.playable && !analysisTerminal && !botTurn;
  const calculateDisabled =
    !game.playable || thinking || boardPreview || botTurn || !!analysisTerminal;
  const refreshLabel = t(
    thinking ? "coach.analysis.status.thinking" : "coach.calculate.refresh",
  );
  function calculate() {
    setCollapsedFeedbackKey(feedback?.key ?? null);
    calculateBestMoves();
  }
  return (
    <aside
      className="coach-panel"
      id="coach"
      aria-label={t("coach.panel.label")}
    >
      <div className="coach-header">
        <div className="coach-heading">
          <div>
            <h2>{t("coach.panel.heading")}</h2>
            <span
              className={`turn-status ${checkedKing ? "is-check" : ""}`}
              role="status"
            >
              {turnStatus}
            </span>
          </div>
          <a className="mobile-board-link" href="#board">
            {t("coach.panel.backToBoard")}
          </a>
        </div>
        <div className="coach-header-actions">
          <CoachOptions
            enabled={computer}
            open={optionsOpen}
            side={humanSide}
            difficulty={difficulty}
            startDisabled={
              !game.playable || !!terminal || reviewing || boardPreview
            }
            failed={computer && botState === "error"}
            status={computerStatus(game, settings, opponent, boardPreview, t)}
            onSideChange={setHumanSide}
            onDifficultyChange={setDifficulty}
            onOpenChange={setOptionsOpen}
            onEnabledChange={(enabled) => {
              setComputer(enabled);
              setError("");
            }}
            onRetry={opponent.retry}
          />
          {showRefresh && (
            <button
              type="button"
              className="icon-button refresh-analysis calculate-button"
              aria-label={refreshLabel}
              title={refreshLabel}
              disabled={calculateDisabled}
              onClick={calculate}
            >
              {thinking ? (
                <LoaderCircle size={16} className="spin" aria-hidden="true" />
              ) : (
                <RotateCcw size={16} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      {game.playable && feedback && feedbackMove && (
        <MoveFeedback
          key={feedback.key}
          result={feedback}
          moveLabel={`${gameMoveLabel(feedbackMove)} · ${sideName(feedbackMove.color, t)}`}
          context={
            reviewing
              ? "coach.feedback.context.selectedMove"
              : computer && feedbackMove.color === humanSide
                ? "coach.feedback.context.yourLastMove"
                : "coach.feedback.context.lastMove"
          }
          onReanalyze={onReviewRetry}
          onInspect={inspectMove}
          preview={preview.inspection}
          collapsed={collapsedFeedbackKey === feedback.key}
          onToggle={() =>
            setCollapsedFeedbackKey((key) =>
              key === feedback.key ? null : feedback.key,
            )
          }
        />
      )}
      {!showRefresh && (
        <div className="calculation-controls">
          <button
            className="primary-button calculate-button"
            disabled={calculateDisabled}
            aria-label={
              botTurn
                ? t("coach.calculate.label.waiting")
                : thinking
                  ? t("coach.calculate.label.thinking")
                  : t("coach.calculate.label.ready")
            }
            aria-describedby={calculateReason ? "calculation-reason" : undefined}
            onClick={calculate}
          >
            {thinking || botBusy ? (
              <LoaderCircle size={20} className="spin" />
            ) : (
              <Sparkles size={20} />
            )}
            <span aria-hidden="true">
              {botTurn
                ? t("coach.calculate.text.waiting")
                : thinking
                  ? t("coach.calculate.text.thinking")
                  : t("coach.calculate.label.ready")}
            </span>
          </button>
          {calculateReason && (
            <p className="calculation-reason" id="calculation-reason">
              <SquareText text={calculateReason} />
            </p>
          )}
        </div>
      )}

      {notice && (
        <div className="panel-notice" role="status">
          <Check size={15} />
          <span>
            <SquareText text={translateNotice(notice, t)} />
          </span>
        </div>
      )}
      {error && (
        <div className="error-message" role="alert">
          <ShieldAlert size={16} />
          <span>
            <SquareText text={translateNotice(error, t)} />
          </span>
          <button aria-label={t("common.dismissError")} onClick={() => setError("")}>
            <X size={14} />
          </button>
        </div>
      )}
      {promotion && (
        <PromotionCard
          color={analysisGame.turn()}
          onClose={() => setPromotion(null)}
          onChoose={(type) => {
            if (!boardPreview && !botTurn)
              game.playMove(promotion.from, promotion.to, type);
          }}
        />
      )}
      {reviewing && (
        <section
          className="history-review"
          aria-label={t("game.history.controls")}
        >
          <p className="history-position-label" role="status">
            <span>{t("coach.status.reviewing")}</span>
            <strong>
              <SquareText text={reviewLabel} />
            </strong>
          </p>
          <span className="history-count">
            {historyPly} / {history.length}
          </span>
          <button
            className="history-latest"
            aria-label={t("game.history.backToLatest")}
            onClick={() => showHistory(history.length)}
          >
            <span>{t("game.history.backToLatest")}</span>
            <ArrowRight size={14} />
          </button>
        </section>
      )}

      <RecommendationsPanel
        game={game}
        onPlayMove={onPlayMove}
        preview={preview}
        computer={settings}
        botTurn={botTurn}
        recommendations={recommendations}
        presentation={presentation}
        onNewGame={onNewGame}
      />
      {game.playable && (
        <div
          className={`coach-status ${thinking || botBusy ? "coach-status-thinking" : ""}`}
          role={thinking || botBusy ? "status" : undefined}
        >
          {(boardPreview || reviewing || thinking || botBusy) &&
            (boardPreview || reviewing ? (
              <Eye size={14} />
            ) : botBusy && botState === "waiting" ? (
              <Clock3 size={14} />
            ) : (
              <LoaderCircle size={14} className="spin" />
            ))}
          <span>
            <SquareText
              text={
                inspectionMove
                  ? t("coach.context.preview", gameMoveLabel(inspectionMove))
                  : reviewing
                    ? thinking
                      ? t(
                          "coach.context.reviewingUpdating",
                          reviewLabel,
                        )
                      : analysisRequested
                        ? t(
                            "coach.context.reviewingReady",
                            reviewLabel,
                          )
                        : t(
                            "coach.context.reviewingIdle",
                            reviewLabel,
                          )
                    : botBusy
                      ? botState === "waiting"
                        ? t("computer.status.movingSoon")
                        : t("computer.status.choosingReply")
                      : thinking
                        ? t(
                            "coach.context.updating",
                            sideName(turn, t),
                          )
                        : ""
              }
            />
          </span>
          {boardPreview && preview.pinned && (
            <button
              className="text-action coach-preview-exit"
              onClick={preview.clearPreview}
            >
              {t("coach.panel.returnToGame")}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

function computerStatus(
  game: GameController,
  settings: ComputerSettings,
  opponent: ComputerTurn,
  previewing: boolean,
  t: Translator,
) {
  if (!game.playable)
    return t("computer.status.invalidPosition");
  if (game.terminal) return t("computer.status.gameEnded");
  if (game.reviewing || previewing)
    return t("computer.status.preview");
  if (!settings.enabled)
    return t(
      "computer.status.enable",
      sideName(settings.side === "w" ? "b" : "w", t),
    );
  if (settings.open) return t("computer.status.settings");
  if (opponent.state === "error")
    return t("computer.error.move");
  if (opponent.busy)
    return opponent.state === "waiting"
      ? t("computer.status.movingSoon")
      : t("computer.status.thinking");
  return t("computer.status.yourTurn");
}
