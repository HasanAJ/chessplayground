import { english, type Translator } from "../../i18n/translate";
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
      text: t(
        "Before moving, check whether their pieces can reach your king on {0}. Here, {1} ends the game.",
        king,
        response.san,
      ),
      candidate: preview,
      ply: 1,
      focus: boardFocus(t("See their checkmate threat"), [
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
        ? t(
            "leaves your {0} on {1} with no defender. Their {2} can take it with {3}",
            t(names[response.captured]),
            target,
            t(names[response.piece]),
            response.san,
          )
        : t(
            "allows their {0} to take your {1} on {2} with {3}. Your piece has a defender, so follow the rest of the trade",
            t(names[response.piece]),
            t(names[response.captured]),
            target,
            response.san,
          ),
      text: undefended
        ? t(
            "Before moving, check which of your pieces they can capture and whether you can capture back.",
          )
        : t(
            "Before accepting a trade, compare the pieces both sides can capture, including the next reply.",
          ),
      candidate: preview,
      ply: 1,
      focus: boardFocus(
        t("See the piece they can capture"),
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
      consequence: t(
        "allows the shown line to reach {0}, where their {1} takes your {2} on {3}. Further trades may follow",
        capture.san,
        t(names[capture.piece]),
        t(names[capture.captured!]),
        target,
      ),
      text: checkInLine
        ? t(
            "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece.",
          )
        : t(
            "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.",
          ),
      candidate: preview,
      ply: laterCapture,
      focus: boardFocus(
        t("See the later capture in this line"),
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
        .map(([square, piece]) =>
          t("your {0} on {1}", t(names[piece!.type]), square),
        )
        .join(t(" and "));
      return {
        consequence: t(
          "allows a fork: their {0} on {1} attacks {2} at once",
          t(names[response.promotion ?? response.piece]),
          response.to,
          namedTargets,
        ),
        text: t(
          "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.",
        ),
        candidate: preview,
        ply: 2,
        focus: boardFocus(
          t("See the two attacks"),
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
      ? t(
          "Compare the capture on {0} with {1}. Preview their reply before deciding whether the capture helps.",
          capturedSquare(best.move),
          best.move.san,
        )
      : best.theme === "support"
        ? t(
            "Check which of your pieces need protection. {0} offers another way to defend your position.",
            best.move.san,
          )
        : best.theme === "piece-safety"
          ? t(
              "Check whether a piece is under attack before starting another plan. {0} moves a piece out of danger.",
              best.move.san,
            )
          : t(
              "Check their checks, captures, and attacks before choosing your move. Preview {0} to compare the alternative.",
              best.move.san,
            ),
    candidate: best,
    ply: 1,
    focus: best.explanationFocus,
  };
}
