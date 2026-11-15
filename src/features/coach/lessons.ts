import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move, type Square } from "chess.js";
import { capturedSquare } from "../../chess/moves";
import { pieceNameKeys, positionOf } from "../../chess/position";
import { candidatesFor, type Candidate } from "./candidatePresentation";
import { boardFocus, type BoardFocus } from "./boardFocus";
import { tacticalThreats } from "./tacticalThreats";
import { lessonWalkthrough, type LessonWalkthrough } from "./lessonWalkthrough";
import { explainMove } from "./explanations";

export type ReviewLesson = {
  kind: "consequence" | "alternative";
  consequence?: string;
  candidate: Candidate;
  ply: number;
  walkthrough?: LessonWalkthrough;
  focus?: BoardFocus;
};

/** Describe observable consequences in the played line, without treating attacks as guaranteed wins. */
export function lessonFor(
  move: Move,
  best: Candidate,
  reply?: Candidate,
  played?: Candidate,
  t: Translator = english,
): ReviewLesson {
  const after = new Chess(move.after);
  const continuation = played?.continuation ?? [
    move,
    ...(reply?.continuation ?? []),
  ];
  const preview =
    played ??
    candidatesFor(
      move.before,
      [
        {
          rank: 1,
          depth: best.depth,
          pv: continuation.map((step) => step.lan),
        },
      ],
      t,
    )[0];
  const response = continuation[1];
  if (response && new Chess(response.after).isCheckmate()) {
    const king = Object.entries(positionOf(after)).find(
      ([, piece]) => piece?.color === move.color && piece.type === "k",
    )![0] as Square;
    return {
      kind: "consequence",
      candidate: preview,
      ply: 1,
      focus: boardFocus(t("coach.lesson.mateThreat.focus"), [
        { from: response.from, to: response.to },
        { from: response.to, to: king },
      ]),
    };
  }
  if (response?.captured) {
    const target = capturedSquare(response);
    const undefended = !after.isAttacked(target, move.color);
    return {
      kind: "consequence",
      consequence: undefended
        ? t(
            "coach.lesson.undefended.consequence",
            t(pieceNameKeys[response.captured]),
            target,
            t(pieceNameKeys[response.piece]),
          )
        : t(
            "coach.lesson.defendedCapture.consequence",
            t(pieceNameKeys[response.piece]),
            t(pieceNameKeys[response.captured]),
            target,
          ),
      candidate: preview,
      ply: 1,
      walkthrough: lessonWalkthrough(preview, t),
      focus: boardFocus(
        t("coach.lesson.capture.focus"),
        [{ from: response.from, to: response.to }],
        [target],
      ),
    };
  }
  if (response) {
    const walkthrough = lessonWalkthrough(preview, t);
    const threat = walkthrough.steps[1]?.text;
    if (
      threat ||
      walkthrough.capturePly ||
      response.promotion ||
      preview.mate !== undefined ||
      new Chess(continuation[continuation.length - 1].after).isGameOver()
    ) {
      return {
        kind: "consequence",
        consequence: threat,
        candidate: preview,
        ply: 1,
        walkthrough,
        focus: boardFocus(t("coach.lesson.line.focus"), []),
      };
    }
  }
  return {
    kind: "alternative",
    candidate: best,
    ply: 1,
    focus: best.explanationFocus,
  };
}

/** Explain a concrete difference under the same reply, when that reply is legal. */
export function betterMoveReason(
  best: Candidate,
  response: Move | undefined,
  t: Translator,
): string {
  if (response) {
    const threat = tacticalThreats(response, t);
    const alternative = new Chess(best.move.after);
    const sameReply = alternative
      .moves({ verbose: true })
      .find((move) => move.lan === response.lan);
    if (threat && sameReply) {
      const afterReply = new Chess(sameReply.after);
      const avoided = threat.focus.arrows.find(
        ({ from, to }) =>
          to === best.move.from &&
          !afterReply.attackers(best.move.to, response.color).includes(from),
      );
      if (avoided)
        return t(
          "coach.lesson.best.avoidsAttack",
          t(pieceNameKeys[best.move.piece]),
          best.move.to,
          response.san,
        );
    }
  }
  if (best.mate !== undefined) return best.explanation;
  return explainMove(new Chess(best.move.before), new Chess(best.move.after), best.move, t).text ||
    t("coach.lesson.best.position");
}
