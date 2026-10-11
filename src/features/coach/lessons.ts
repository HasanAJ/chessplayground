import { Chess, type Move, type Square } from "chess.js";
import { capturedSquare } from "../../chess/moves";
import { names, opposite, positionOf } from "../../chess/position";
import { candidatesFor, type Candidate } from "./candidates";
import { boardFocus, type BoardFocus } from "./explanations";

export type ReviewLesson = {
  text: string;
  consequence?: string;
  candidate: Candidate;
  ply: number;
  focus?: BoardFocus;
};

/** Describe observable consequences in the played line, without treating attacks as guaranteed wins. */
export function lessonFor(
  move: Move,
  best: Candidate,
  reply?: Candidate,
  played?: Candidate,
): ReviewLesson {
  const after = new Chess(move.after);
  const continuation = played?.continuation ?? [
    move,
    ...(reply?.continuation ?? []),
  ];
  const preview =
    played ??
    candidatesFor(move.before, [
      {
        rank: 1,
        depth: best.depth,
        pv: continuation.map((step) => step.lan),
      },
    ])[0];
  const response = continuation[1];
  if (response && new Chess(response.after).isCheckmate()) {
    const king = Object.entries(positionOf(after)).find(
      ([, piece]) => piece?.color === move.color && piece.type === "k",
    )![0] as Square;
    return {
      text: `Before moving, check whether their pieces can reach your king on ${king}. Here, ${response.san} ends the game.`,
      candidate: preview,
      ply: 1,
      focus: boardFocus("See their checkmate threat", [
        { from: response.from, to: response.to },
        { from: response.to, to: king },
      ]),
    };
  }
  if (response?.captured) {
    const target = capturedSquare(response);
    const undefended = !after.isAttacked(target, move.color);
    return {
      consequence: undefended
        ? `leaves your ${names[response.captured]} on ${target} with no defender. Their ${names[response.piece]} can take it with ${response.san}`
        : `allows their ${names[response.piece]} to take your ${names[response.captured]} on ${target} with ${response.san}. Your piece has a defender, so follow the rest of the trade`,
      text: undefended
        ? "Before moving, check which of your pieces they can capture and whether you can capture back."
        : "Before accepting a trade, compare the pieces both sides can capture, including the next reply.",
      candidate: preview,
      ply: 1,
      focus: boardFocus(
        "See the piece they can capture",
        [{ from: response.from, to: response.to }],
        [target],
      ),
    };
  }
  const laterCapture = continuation.findIndex(
    (step, index) => index > 1 && step.color !== move.color && !!step.captured,
  );
  if (laterCapture > 0) {
    const capture = continuation[laterCapture];
    const target = capturedSquare(capture);
    const checkInLine = continuation
      .slice(1, laterCapture)
      .some((step) => step.color !== move.color && step.san.endsWith("+"));
    return {
      consequence: `allows the shown line to reach ${capture.san}, where their ${names[capture.piece]} takes your ${names[capture.captured!]} on ${target}. Further trades may follow`,
      text: checkInLine
        ? "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece."
        : "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.",
      candidate: preview,
      ply: laterCapture,
      focus: boardFocus(
        "See the later capture in this line",
        [{ from: capture.from, to: capture.to }],
        [target],
      ),
    };
  }
  if (response) {
    const replied = new Chess(response.after);
    const targets = Object.entries(positionOf(replied)).filter(
      ([square, piece]) =>
        piece?.color === move.color &&
        piece.type !== "p" &&
        replied
          .attackers(square as Square, opposite(move.color))
          .includes(response.to) &&
        !after
          .attackers(square as Square, opposite(move.color))
          .includes(response.from),
    );
    if (targets.length >= 2) {
      const namedTargets = targets
        .map(([square, piece]) => `your ${names[piece!.type]} on ${square}`)
        .join(" and ");
      return {
        consequence: `allows a fork: their ${names[response.promotion ?? response.piece]} on ${response.to} attacks ${namedTargets} at once`,
        text: "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.",
        candidate: preview,
        ply: 2,
        focus: boardFocus(
          "See the two attacks",
          targets.map(([square]) => ({
            from: response.to,
            to: square as Square,
          })),
        ),
      };
    }
  }
  return {
    text: best.move.captured
      ? `Compare the capture on ${capturedSquare(best.move)} with ${best.move.san}. Preview their reply before deciding whether the capture helps.`
      : best.theme === "support"
        ? `Check which of your pieces need protection. ${best.move.san} offers another way to defend your position.`
        : best.theme === "piece-safety"
          ? `Check whether a piece is under attack before starting another plan. ${best.move.san} moves a piece out of danger.`
          : `Check their checks, captures, and attacks before choosing your move. Preview ${best.move.san} to compare the alternative.`,
    candidate: best,
    ply: 1,
    focus: best.explanationFocus,
  };
}
