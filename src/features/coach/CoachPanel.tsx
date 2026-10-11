import { translateNotice } from "../../i18n/notices";
import type { Translator } from "../../i18n/translate";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  Eye,
  LoaderCircle,
  ShieldAlert,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";
import type { Color } from "chess.js";
import { gameMoveLabel, sideName } from "../../chess/position";
import type { GameController } from "../game/useGameController";
import { CoachOptions } from "../computer/CoachOptions";
import type {
  ComputerSettings,
  ComputerTurn,
} from "../computer/useComputerOpponent";
import type { BoardController } from "../board/useBoardInteractions";
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
  board: BoardController;
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
  board,
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
    chooseNextPlayer,
  } = game;
  const { thinking, requested: analysisRequested } = recommendations;
  const { boardPreview, inspectionMove, inspectMove } = preview;
  const { turn: displayedTurn, checkedKing, terminal: displayedEnding } = board;
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
                : "";
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
            <div className="next-player">
              <label className="turn-label" htmlFor="next-player-select">
                {t("coach.turn.label")}
              </label>
              <div
                className={`turn-select ${displayedTurn === "b" ? "is-black" : ""}`}
              >
                <select
                  id="next-player-select"
                  aria-label={t("coach.turn.select")}
                  value={displayedTurn}
                  disabled={boardPreview || botTurn}
                  onChange={(event) =>
                    chooseNextPlayer(event.target.value as Color)
                  }
                  title={
                    game.playable && history.length > 0
                      ? t("coach.turn.changeDescription")
                      : undefined
                  }
                >
                  <option value="w">{t("chess.side.white")}</option>
                  <option value="b">{t("chess.side.black")}</option>
                </select>
                <ChevronDown size={12} aria-hidden="true" />
              </div>
              <span
                className={`turn-status ${checkedKing ? "is-check" : ""}`}
                role="status"
              >
                {turnStatus}
              </span>
            </div>
          </div>
          <a className="mobile-board-link" href="#board">
            {t("coach.panel.backToBoard")}
          </a>
        </div>
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
      <div className="calculation-controls">
        <button
          className="primary-button calculate-button"
          disabled={
            !game.playable ||
            thinking ||
            boardPreview ||
            botTurn ||
            !!analysisTerminal
          }
          aria-label={
            botTurn
              ? t("coach.calculate.label.waiting")
              : thinking
                ? t("coach.calculate.label.thinking")
                : t("coach.calculate.label.ready")
          }
          aria-describedby={calculateReason ? "calculation-reason" : undefined}
          onClick={() => {
            setCollapsedFeedbackKey(feedback?.key ?? null);
            calculateBestMoves();
          }}
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
          onChoose={(type) =>
            board.playMove(promotion.from, promotion.to, type)
          }
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
        board={board}
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
