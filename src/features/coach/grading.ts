import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move } from "chess.js";
import type { PositionEvaluation } from "../../chess/evaluation";
import { candidatesFor, type Candidate } from "./candidates";
import { explainMove } from "./explanations";
import { describeReply } from "./replyDescription";
import { lessonFor, type ReviewLesson } from "./lessons";
import {
  moveQuality,
  outlook,
  type MoveGrade,
  type ReviewOutcome,
} from "./moveQuality";

export type MoveReview = {
  move: Move;
  best: Candidate;
  reply?: Candidate;
  label: MoveGrade;
  text: string;
  lesson?: ReviewLesson;
  played?: Candidate;
  drawn: boolean;
  evaluation: PositionEvaluation;
};

export function reviewMove(
  move: Move,
  best: Candidate,
  reply?: Candidate,
  drawn = false,
  played?: Candidate,
  t: Translator = english,
): MoveReview {
  const after = new Chess(move.after);
  const sign = move.color === "w" ? 1 : -1;
  const isDraw = drawn || after.isDraw();
  const result = played ?? reply;
  let outcome: ReviewOutcome;
  if (after.isCheckmate()) outcome = { kind: "checkmate" };
  else if (isDraw) outcome = { kind: "draw" };
  else if (result)
    outcome = {
      kind: "ongoing",
      evaluation: result,
      source: played ? "played" : "reply",
    };
  else throw new Error(t("coach.review.error.needsAnalysis"));
  const { evaluation, resultingOutlook, label } = moveQuality(
    move,
    best,
    outcome,
  );
  const same = move.lan === best.move.lan;
  let text: string;
  const lesson =
    !isDraw && label !== "Best move" && label !== "Good move"
      ? lessonFor(move, best, reply, played, t)
      : undefined;
  if (after.isCheckmate())
    text = explainMove(new Chess(move.before), after, move, t).text;
  else if (isDraw)
    text = t(
      label === "Best move" || label === "Good move"
        ? "coach.review.good.draw"
        : "coach.review.consequence.draw",
    );
  else if (same) text = best.explanation;
  else if (label === "Good move") {
    const description =
      result?.mate !== undefined
        ? resultingOutlook === 1
          ? t("coach.review.good.winningMate")
          : t("coach.review.good.losingMate")
        : resultingOutlook > 0.9
          ? t("coach.review.good.winning")
          : resultingOutlook < 0.1
            ? t("coach.review.good.losing")
            : t("coach.review.good.balanced");
    const idea =
      played?.explanation ??
      explainMove(new Chess(move.before), after, move, t).text;
    text = [
      idea,
      !played && reply?.move.captured ? describeReply(reply.move, t, move) : "",
      !idea ? description : "",
    ].filter(Boolean).join(" ");
  } else {
    const consequence =
      result?.mate !== undefined && resultingOutlook === 0
        ? t("coach.review.consequence.allowsMate")
        : best.mate !== undefined && outlook(best, sign) === 1
          ? t("coach.review.consequence.missesMate")
          : (lesson?.consequence ??
            t("coach.review.consequence.worseChances"));
    const response = reply ? describeReply(reply.move, t, move) : "";
    text = reply?.move.san.endsWith("#")
      ? response
      : [consequence, !lesson?.consequence ? response : ""]
          .filter(Boolean)
          .join(" ");
  }
  return {
    move,
    best,
    reply,
    label,
    text,
    lesson,
    played,
    drawn: isDraw,
    evaluation,
  };
}

export function localizeReview(review: MoveReview, t: Translator): MoveReview {
  if (t === english) return review;
  const localize = (candidate: Candidate) =>
    candidatesFor(candidate.move.before, [candidate], t)[0];
  return reviewMove(
    review.move,
    localize(review.best),
    review.reply ? localize(review.reply) : undefined,
    review.drawn,
    review.played ? localize(review.played) : undefined,
    t,
  );
}
