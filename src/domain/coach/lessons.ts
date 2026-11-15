import { Chess, type Move } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import { capturedSquare } from "../chess/moves.ts";
import { pieceNameKeys } from "../chess/position.ts";
import { candidatesFor, type Candidate } from "./candidatePresentation.ts";
import { boardFocus, type BoardFocus } from "./boardFocus.ts";
import { tacticalThreats } from "./tacticalThreats.ts";
import {
  lessonWalkthrough,
  type LessonWalkthrough,
} from "./lessonWalkthrough.ts";
import { explainMove } from "./explanations.ts";
export type ReviewLesson = {
  kind: "consequence" | "alternative";
  consequence?: string;
  candidate: Candidate;
  ply: number;
  walkthrough?: LessonWalkthrough;
  focus?: BoardFocus;
};

export function lessonFor(
  move: Move,
  best: Candidate,
  reply?: Candidate,
  played?: Candidate,
  t: Translator = english,
): ReviewLesson {
  const moves = played?.continuation ?? [move, ...(reply?.continuation ?? [])];
  const preview =
    played ??
    candidatesFor(
      move.before,
      [{ rank: 1, depth: best.depth, pv: moves.map((move) => move.lan) }],
      t,
    )[0];
  const response = moves[1];
  const consequence = (
    details: Omit<ReviewLesson, "kind" | "candidate" | "ply">,
  ): ReviewLesson => ({
    kind: "consequence",
    candidate: preview,
    ply: 1,
    ...details,
  });
  if (response) {
    const after = new Chess(move.after);
    if (new Chess(response.after).isCheckmate()) {
      const king = after
        .board()
        .flat()
        .find(
          (piece) => piece?.type === "k" && piece.color === move.color,
        )!.square;
      return consequence({
        focus: boardFocus(t("coach.lesson.mateThreat.focus"), [
          { from: response.from, to: response.to },
          { from: response.to, to: king },
        ]),
      });
    }
    const walkthrough = lessonWalkthrough(preview, t);
    if (response.captured) {
      const square = capturedSquare(response),
        piece = t(pieceNameKeys[response.piece]),
        victim = t(pieceNameKeys[response.captured]);
      const text = after.isAttacked(square, move.color)
        ? t("coach.lesson.defendedCapture.consequence", piece, victim, square)
        : t("coach.lesson.undefended.consequence", victim, square, piece);
      return consequence({
        consequence: text,
        walkthrough,
        focus: boardFocus(
          t("coach.lesson.capture.focus"),
          [{ from: response.from, to: response.to }],
          [square],
        ),
      });
    }
    const threat = walkthrough.steps[1]?.text;
    if (
      threat ||
      walkthrough.capturePly ||
      response.promotion ||
      preview.mate !== undefined ||
      new Chess(moves.at(-1)!.after).isGameOver()
    )
      return consequence({
        consequence: threat,
        walkthrough,
        focus: boardFocus(t("coach.lesson.line.focus"), []),
      });
  }
  return {
    kind: "alternative",
    candidate: best,
    ply: 1,
    focus: best.explanationFocus,
  };
}
export function betterMoveReason(
  best: Candidate,
  response: Move | undefined,
  t: Translator,
): string {
  if (response) {
    const threat = tacticalThreats(response, t);
    const board = new Chess(best.move.after);
    const reply = board
      .moves({ verbose: true })
      .find((move) => move.lan === response.lan);
    if (threat && reply) {
      const after = new Chess(reply.after);
      const avoidsAttack = threat.focus.arrows.some(
        ({ from, to }) =>
          to === best.move.from &&
          !after.attackers(best.move.to, response.color).includes(from),
      );
      if (avoidsAttack)
        return t(
          "coach.lesson.best.avoidsAttack",
          t(pieceNameKeys[best.move.piece]),
          best.move.to,
          response.san,
        );
    }
  }
  return best.mate !== undefined
    ? best.explanation
    : explainMove(
        new Chess(best.move.before),
        new Chess(best.move.after),
        best.move,
        t,
      ).text || t("coach.lesson.best.position");
}
