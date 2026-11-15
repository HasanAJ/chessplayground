import { Chess, type Move } from "chess.js";
import { capturedSquare } from "../chess/moves.ts";
import { materialGain } from "../chess/material.ts";
import { ending } from "../chess/position.ts";
import type { Translator } from "../../i18n/translate.ts";
import type { Candidate } from "./candidatePresentation.ts";
import { boardFocus, type BoardFocus } from "./boardFocus.ts";
import { tacticalThreats } from "./tacticalThreats.ts";
export type LessonWalkthrough = {
  capturePly?: number;
  endPly: number;
  steps: { text?: string; focus?: BoardFocus }[];
  outcome?: string;
};
function endpoint(moves: Move[], capturePly?: number) {
  if (new Chess(moves.at(-1)!.after).isGameOver()) return moves.length;
  let end = capturePly ?? Math.min(2, moves.length);
  if (capturePly)
    for (; end < moves.length; end++) {
      const next = moves[end];
      if (
        next.captured ||
        next.promotion ||
        next.san.includes("+") ||
        new Chess(next.before).isCheck()
      )
        continue;
      break;
    }
  return end;
}
function materialOutcome(candidate: Candidate, shown: Move[], t: Translator) {
  const final = shown.at(-1)!;
  const board = new Chess(final.after);
  if (board.isDraw()) return ending(board, t) ?? undefined;
  if (
    board.isCheckmate() ||
    !shown.some((move) => move.captured || move.promotion)
  )
    return undefined;
  const balance = materialGain(shown, candidate.move.color);
  const text = t(
    balance > 0
      ? "coach.lesson.material.gain"
      : balance < 0
        ? "coach.lesson.material.loss"
        : "coach.lesson.material.equal",
    Math.abs(balance),
  );
  const canRecapture =
    final.captured &&
    board
      .moves({ verbose: true })
      .some((reply) => reply.captured && capturedSquare(reply) === final.to);
  const suffix = canRecapture
    ? t("coach.lesson.material.recapture")
    : candidate.materialLoss === undefined
      ? t("coach.lesson.material.incomplete")
      : "";
  return text + (suffix ? ` ${suffix}` : "");
}
export function lessonWalkthrough(
  candidate: Candidate,
  t: Translator,
): LessonWalkthrough {
  const moves = candidate.continuation;
  const capture = moves.findIndex(
    (move) => move.color !== candidate.move.color && !!move.captured,
  );
  const capturePly = capture === -1 ? undefined : capture + 1,
    endPly = endpoint(moves, capturePly);
  const shown = moves.slice(0, endPly);
  const steps = shown.map((move, index) => {
    const threat =
      move.color === candidate.move.color
        ? undefined
        : tacticalThreats(move, t);
    const focus =
      index !== 0 && move.captured
        ? boardFocus(
            t("coach.lesson.capture.focus"),
            [{ from: move.from, to: move.to }, ...(threat?.focus.arrows ?? [])],
            [capturedSquare(move)],
          )
        : threat?.focus;
    return { text: threat?.text, focus };
  });
  return {
    capturePly,
    endPly,
    steps,
    outcome: materialOutcome(candidate, shown, t),
  };
}
