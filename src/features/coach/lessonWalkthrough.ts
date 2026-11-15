import { Chess } from "chess.js";
import { capturedSquare } from "../../chess/moves";
import { pieceValues } from "../../chess/material";
import { ending } from "../../chess/position";
import type { Translator } from "../../i18n/translate";
import type { Candidate } from "./candidatePresentation";
import { boardFocus, type BoardFocus } from "./boardFocus";
import { tacticalThreats } from "./tacticalThreats";

export type LessonWalkthrough = {
  capturePly?: number;
  endPly: number;
  steps: { text?: string; focus?: BoardFocus }[];
  outcome?: string;
};

export function lessonWalkthrough(
  candidate: Candidate,
  t: Translator,
): LessonWalkthrough {
  const { continuation: moves } = candidate;
  const player = candidate.move.color;
  const captureIndex = moves.findIndex(
    (move) => move.color !== player && !!move.captured,
  );
  const lineEnd = new Chess(moves[moves.length - 1].after);
  let endPly = captureIndex >= 0 ? captureIndex + 1 : Math.min(2, moves.length);
  if (lineEnd.isGameOver()) endPly = moves.length;
  else if (captureIndex >= 0) {
    // Include recaptures and intermediate checks before stopping at quiet play.
    while (endPly < moves.length) {
      const next = moves[endPly];
      if (
        !next.captured && !next.promotion && !next.san.includes("+") &&
        !new Chess(next.before).isCheck()
      ) break;
      endPly++;
    }
  }
  const shown = moves.slice(0, endPly);
  const balance = shown.reduce((total, move) => {
    const gain =
      (move.captured ? pieceValues[move.captured] : 0) +
      (move.promotion ? pieceValues[move.promotion] - pieceValues.p : 0);
    return total + (move.color === player ? gain : -gain);
  }, 0);
  const finalMove = shown[shown.length - 1];
  const finalBoard = endPly === moves.length ? lineEnd : new Chess(finalMove.after);
  let outcome: string | undefined;
  if (finalBoard.isDraw()) outcome = ending(finalBoard, t) ?? undefined;
  else if (!finalBoard.isCheckmate() && shown.some((move) => move.captured || move.promotion)) {
    outcome = t(
      balance < 0
        ? "coach.lesson.material.loss"
        : balance > 0
          ? "coach.lesson.material.gain"
          : "coach.lesson.material.equal",
      Math.abs(balance),
    );
    const recapture = finalMove.captured && finalBoard
      .moves({ verbose: true })
      .some((move) => move.captured && capturedSquare(move) === finalMove.to);
    if (recapture) outcome += ` ${t("coach.lesson.material.recapture")}`;
    else if (candidate.materialLoss === undefined)
      outcome += ` ${t("coach.lesson.material.incomplete")}`;
  }
  return {
    capturePly: captureIndex >= 0 ? captureIndex + 1 : undefined,
    endPly,
    steps: shown.map((move, index) => {
      const threat = move.color !== player ? tacticalThreats(move, t) : undefined;
      return {
        text: threat?.text,
        focus: index > 0 && move.captured
          ? boardFocus(
              t("coach.lesson.capture.focus"),
              [{ from: move.from, to: move.to }, ...(threat?.focus.arrows ?? [])],
              [capturedSquare(move)],
            )
          : threat?.focus,
      };
    }),
    outcome,
  };
}
