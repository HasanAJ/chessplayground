import { Chess, type Move } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import type { PositionEvaluation } from "../chess/evaluation.ts";
import { presentCandidate, type Candidate } from "./candidatePresentation.ts";
import { explainMove } from "./explanations.ts";
import { describeReply } from "./replyDescription.ts";
import { betterMoveReason, lessonFor, type ReviewLesson } from "./lessons.ts";
import {
  moveQuality,
  outlook,
  type MissedOpportunity,
  type MoveGrade,
  type ReviewOutcome,
} from "./moveQuality.ts";

export type MoveReview = {
  move: Move;
  best: Candidate;
  reply?: Candidate;
  label: MoveGrade;
  text: string;
  bestReason?: string;
  lesson?: ReviewLesson;
  played?: Candidate;
  drawn: boolean;
  evaluation: PositionEvaluation;
};
const positive = new Set<MoveGrade>([
  "Best move",
  "Excellent move",
  "Good move",
]);
function outcomeFor(
  move: Move,
  drawn: boolean,
  played: Candidate | undefined,
  reply: Candidate | undefined,
  t: Translator,
): ReviewOutcome {
  const board = new Chess(move.after);
  if (board.isCheckmate()) return { kind: "checkmate" };
  if (drawn) return { kind: "draw" };
  const score = played ?? reply;
  if (!score) throw new Error(t("coach.review.error.needsAnalysis"));
  return {
    kind: "ongoing",
    evaluation: score,
    source: played ? "played" : "reply",
  };
}
function reviewText(
  move: Move,
  best: Candidate,
  outcome: ReviewOutcome,
  good: boolean,
  opportunity: MissedOpportunity | undefined,
  chance: number,
  lesson: ReviewLesson | undefined,
  played: Candidate | undefined,
  reply: Candidate | undefined,
  t: Translator,
) {
  if (outcome.kind === "checkmate")
    return explainMove(new Chess(move.before), new Chess(move.after), move, t)
      .text;
  if (opportunity) {
    const text = t(
      opportunity === "mate"
        ? "coach.review.consequence.missesMate"
        : "coach.review.consequence.missesMaterial",
    );
    return outcome.kind === "draw"
      ? `${text} ${t("coach.review.consequence.draw")}`
      : text;
  }
  if (outcome.kind === "draw")
    return t(good ? "coach.review.good.draw" : "coach.review.consequence.draw");
  if (best.move.lan === move.lan) return best.explanation;
  if (!good) {
    const replyText = reply ? describeReply(reply.move, t, move) : "";
    if (reply?.move.san.endsWith("#")) return replyText;
    const sign = move.color === "w" ? 1 : -1;
    const consequence =
      outcome.evaluation.mate !== undefined && chance === 0
        ? t("coach.review.consequence.allowsMate")
        : (lesson?.consequence ??
          (best.mate !== undefined && outlook(best, sign) === 1
            ? t("coach.review.consequence.missesMate")
            : t("coach.review.consequence.worseChances")));
    return [consequence, lesson?.consequence ? "" : replyText]
      .filter(Boolean)
      .join(" ");
  }
  const idea =
    played?.explanation ??
    explainMove(new Chess(move.before), new Chess(move.after), move, t).text;
  const fallback =
    outcome.evaluation.mate !== undefined
      ? t(
          chance === 1
            ? "coach.review.good.winningMate"
            : "coach.review.good.losingMate",
        )
      : t(
          chance > 0.9
            ? "coach.review.good.winning"
            : chance < 0.1
              ? "coach.review.good.losing"
              : "coach.review.good.balanced",
        );
  return [
    idea,
    !played && reply?.move.captured ? describeReply(reply.move, t, move) : "",
    idea ? "" : fallback,
  ]
    .filter(Boolean)
    .join(" ");
}
export function reviewMove(
  move: Move,
  best: Candidate,
  reply?: Candidate,
  drawn = false,
  played?: Candidate,
  t: Translator = english,
): MoveReview {
  const isDraw = drawn || new Chess(move.after).isDraw();
  const outcome = outcomeFor(move, isDraw, played, reply, t);
  const quality = moveQuality(
    move,
    best,
    outcome,
    played?.continuation ?? [move, ...(reply?.continuation ?? [])],
  );
  const good = positive.has(quality.label);
  const lesson: ReviewLesson | undefined =
    !isDraw && !good
      ? quality.opportunity
        ? {
            kind: "alternative",
            candidate: best,
            ply: 1,
            focus: best.explanationFocus,
          }
        : lessonFor(move, best, reply, played, t)
      : undefined;
  return {
    move,
    best,
    reply,
    label: quality.label,
    evaluation: quality.evaluation,
    drawn: isDraw,
    played,
    lesson,
    text: reviewText(
      move,
      best,
      outcome,
      good,
      quality.opportunity,
      quality.resultingOutlook,
      lesson,
      played,
      reply,
      t,
    ),
    bestReason:
      !good && move.lan !== best.move.lan
        ? betterMoveReason(best, played?.continuation[1] ?? reply?.move, t)
        : undefined,
  };
}
export function localizeReview(review: MoveReview, t: Translator): MoveReview {
  if (t === english) return review;
  const localize = (candidate?: Candidate) =>
    candidate ? presentCandidate(candidate, t) : undefined;
  return reviewMove(
    review.move,
    presentCandidate(review.best, t),
    localize(review.reply),
    review.drawn,
    localize(review.played),
    t,
  );
}
