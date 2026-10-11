import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move, type Square } from "chess.js";
import { capturedSquare } from "../../chess/moves";
import { pieceNameKeys, opposite, positionOf } from "../../chess/position";
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
        "coach.lesson.mateThreat.advice",
        king,
        response.san,
      ),
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
      consequence: undefended
        ? t(
            "coach.lesson.undefended.consequence",
            t(pieceNameKeys[response.captured]),
            target,
            t(pieceNameKeys[response.piece]),
            response.san,
          )
        : t(
            "coach.lesson.defendedCapture.consequence",
            t(pieceNameKeys[response.piece]),
            t(pieceNameKeys[response.captured]),
            target,
            response.san,
          ),
      text: undefended
        ? t("coach.lesson.undefended.advice")
        : t("coach.lesson.defendedCapture.advice"),
      candidate: preview,
      ply: 1,
      focus: boardFocus(
        t("coach.lesson.capture.focus"),
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
        "coach.lesson.laterCapture.consequence",
        capture.san,
        t(pieceNameKeys[capture.piece]),
        t(pieceNameKeys[capture.captured!]),
        target,
      ),
      text: checkInLine
        ? t("coach.lesson.forcedReply.advice")
        : t("coach.lesson.laterCapture.advice"),
      candidate: preview,
      ply: laterCapture,
      focus: boardFocus(
        t("coach.lesson.laterCapture.focus"),
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
          t("coach.piece.yoursOnSquare", t(pieceNameKeys[piece!.type]), square),
        )
        .join(t("common.join.and"));
      return {
        consequence: t(
          "coach.lesson.fork.consequence",
          t(pieceNameKeys[response.promotion ?? response.piece]),
          response.to,
          namedTargets,
        ),
        text: t("coach.lesson.fork.advice"),
        candidate: preview,
        ply: 2,
        focus: boardFocus(
          t("coach.lesson.fork.focus"),
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
          "coach.lesson.compareCapture",
          capturedSquare(best.move),
          best.move.san,
        )
      : best.theme === "support"
        ? t(
            "coach.lesson.compareDefense",
            best.move.san,
          )
        : best.theme === "piece-safety"
          ? t(
              "coach.lesson.compareEscape",
              best.move.san,
            )
          : t(
              "coach.lesson.compareAlternative",
              best.move.san,
            ),
    candidate: best,
    ply: 1,
    focus: best.explanationFocus,
  };
}
