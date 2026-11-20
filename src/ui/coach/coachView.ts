import { ending, sideName } from "../../domain/chess/position.ts";
import { translateNotice } from "../../i18n/notices.ts";
import type { Translator } from "../../i18n/translate.ts";
import type { CoachPanelProps } from "./coachContracts.ts";

type Input = Pick<
  CoachPanelProps,
  | "game"
  | "preview"
  | "computer"
  | "opponent"
  | "recommendations"
  | "feedbackPly"
  | "presentation"
>;
export function coachView(
  {
    game,
    preview,
    computer,
    opponent,
    recommendations,
    feedbackPly,
    presentation,
  }: Input,
  t: Translator,
) {
  const board = preview.previewGame ?? game.analysisGame;
  const check = game.playable && board.isCheck();
  const terminal =
    game.playable &&
    (preview.previewGame ? ending(board) : game.analysisTerminal);
  let turn: string;
  if (terminal)
    turn = t(
      board.isCheckmate() ? "coach.status.checkmate" : "coach.status.draw",
    );
  else if (preview.boardPreview)
    turn = t(check ? "coach.status.previewCheck" : "coach.status.preview");
  else if (check) turn = t("coach.status.check");
  else if (computer.enabled && computer.open) turn = t("coach.status.paused");
  else if (opponent.turn)
    turn = t(
      opponent.state === "waiting"
        ? "coach.status.replying"
        : "coach.status.thinking",
    );
  else if (game.reviewing) turn = t("coach.status.reviewing");
  else
    turn = t(
      computer.enabled
        ? "coach.status.yourTurn"
        : game.analysisGame.turn() === "w"
          ? "board.turn.white"
          : "board.turn.black",
    );
  let computerStatus: string;
  if (!game.playable) computerStatus = t("computer.status.invalidPosition");
  else if (game.terminal) computerStatus = t("computer.status.gameEnded");
  else if (game.reviewing || preview.boardPreview)
    computerStatus = t("computer.status.preview");
  else if (!computer.enabled)
    computerStatus = t(
      "computer.status.enable",
      sideName(computer.side === "w" ? "b" : "w", t),
    );
  else if (computer.open) computerStatus = t("computer.status.settings");
  else if (opponent.state === "error")
    computerStatus = t("computer.error.move");
  else if (opponent.busy)
    computerStatus = t(
      opponent.state === "waiting"
        ? "computer.status.movingSoon"
        : "computer.status.thinking",
    );
  else computerStatus = t("computer.status.yourTurn");
  const thinking = recommendations.thinking && !presentation.hinting;
  const unavailable =
    !game.playable ||
    thinking ||
    preview.boardPreview ||
    opponent.turn ||
    !!game.analysisTerminal;
  const feedbackMove = game.history[feedbackPly - 1];
  return {
    check,
    turn,
    computerStatus,
    feedbackMove,
    showRefresh:
      recommendations.requested &&
      !presentation.hinting &&
      game.playable &&
      !game.analysisTerminal &&
      !opponent.turn,
    showWelcome:
      !game.playable ||
      (!recommendations.requested &&
        !unavailable &&
        !feedbackMove &&
        !game.reviewing &&
        !game.promotion),
    calculateDisabled: unavailable || !recommendations.settingsValid,
    hintDisabled:
      unavailable || recommendations.thinking || !recommendations.settingsValid,
    calculateReason: translateNotice(game.positionIssue, t),
    calculateLabel: t(
      opponent.turn
        ? "coach.calculate.label.waiting"
        : thinking
          ? "coach.calculate.label.thinking"
          : "coach.calculate.label.ready",
    ),
    calculateText: t(
      opponent.turn
        ? "coach.calculate.text.waiting"
        : thinking
          ? "coach.calculate.text.thinking"
          : "coach.calculate.label.ready",
    ),
    refreshLabel: t(
      recommendations.thinking
        ? "coach.analysis.status.thinking"
        : "coach.calculate.refresh",
    ),
    showComputerStatus: opponent.busy && !preview.boardPreview,
  };
}
export type CoachView = ReturnType<typeof coachView>;
