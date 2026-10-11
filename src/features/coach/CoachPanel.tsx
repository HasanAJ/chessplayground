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
      ? t("Checkmate")
      : t("Draw")
    : boardPreview
      ? checkedKing
        ? t("Preview · Check")
        : t("Preview")
      : checkedKing
        ? t("Check")
        : computer && optionsOpen
          ? t("Paused")
          : botTurn
            ? botState === "waiting"
              ? t("Replying…")
              : t("Thinking…")
            : reviewing
              ? t("Reviewing")
              : computer
                ? t("Your turn")
                : "";
  return (
    <aside
      className="coach-panel"
      id="coach"
      aria-label={t("Position analysis")}
    >
      <div className="coach-header">
        <div className="coach-heading">
          <div>
            <h2>{t("Your coach")}</h2>
            <div className="next-player">
              <label className="turn-label" htmlFor="next-player-select">
                {t("To move")}
              </label>
              <div
                className={`turn-select ${displayedTurn === "b" ? "is-black" : ""}`}
              >
                <select
                  id="next-player-select"
                  aria-label={t("Who plays next")}
                  value={displayedTurn}
                  disabled={boardPreview || botTurn}
                  onChange={(event) =>
                    chooseNextPlayer(event.target.value as Color)
                  }
                  title={
                    game.playable && history.length > 0
                      ? t(
                          "Changing the player starts a new position and clears the move history.",
                        )
                      : undefined
                  }
                >
                  <option value="w">{t("White")}</option>
                  <option value="b">{t("Black")}</option>
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
            {t("Back to board ↑")}
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
              ? "Selected move"
              : computer && feedbackMove.color === humanSide
                ? "Your last move"
                : "Last move"
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
              ? t("Waiting for computer")
              : thinking
                ? t("Calculating best moves")
                : t("Calculate best moves")
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
              ? t("Waiting for computer…")
              : thinking
                ? t("Calculating…")
                : t("Calculate best moves")}
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
          <button aria-label={t("Dismiss error")} onClick={() => setError("")}>
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
          aria-label={t("Move history controls")}
        >
          <p className="history-position-label" role="status">
            <span>{t("Reviewing")}</span>
            <strong>
              <SquareText text={reviewLabel} />
            </strong>
          </p>
          <span className="history-count">
            {historyPly} / {history.length}
          </span>
          <button
            className="history-latest"
            aria-label={t("Back to latest")}
            onClick={() => showHistory(history.length)}
          >
            <span>{t("Back to latest")}</span>
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
                  ? t("Preview · {0}", gameMoveLabel(inspectionMove))
                  : reviewing
                    ? thinking
                      ? t(
                          "Reviewing {0} · Updating this position’s analysis",
                          reviewLabel,
                        )
                      : analysisRequested
                        ? t(
                            "Reviewing {0} · Analysis is for this position",
                            reviewLabel,
                          )
                        : t(
                            "Reviewing {0} · Calculate when you want guidance",
                            reviewLabel,
                          )
                    : botBusy
                      ? botState === "waiting"
                        ? t("Computer moves in a moment…")
                        : t("Computer is choosing a reply…")
                      : thinking
                        ? t(
                            "Updating {0}’s analysis · You can keep playing",
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
              {t("Return to game")}
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
    return t("Arrange a legal position with both kings to play the computer.");
  if (game.terminal) return t("This game has ended. Start a new game to play.");
  if (game.reviewing || previewing)
    return t("Return to your game to continue playing.");
  if (!settings.enabled)
    return t(
      "Turn on “Play computer” to play against {0}.",
      sideName(settings.side === "w" ? "b" : "w", t),
    );
  if (settings.open) return t("Game paused while you choose your settings.");
  if (opponent.state === "error")
    return t("The computer could not choose a move. Try again.");
  if (opponent.busy)
    return opponent.state === "waiting"
      ? t("Computer moves in a moment…")
      : t("Computer is thinking…");
  return t("Your turn. Make a move on the board.");
}
