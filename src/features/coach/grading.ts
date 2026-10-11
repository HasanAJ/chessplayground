import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move } from "chess.js";
import { candidatesFor, type Candidate } from "./candidates";
import { describeReply } from "./explanations";
import { lessonFor, type ReviewLesson } from "./lessons";

export type MoveReview = {
  move: Move;
  best: Candidate;
  reply?: Candidate;
  label: "Best move" | "Good move" | "Inaccuracy" | "Mistake" | "Blunder";
  loss: number | null;
  impact: number;
  text: string;
  lesson?: ReviewLesson;
  played?: Candidate;
  drawn: boolean;
};

// Lichess's published evaluation-to-outlook curve, with Tempo's own grade bands.
// https://lichess.org/page/accuracy
function outlook(candidate: Candidate, sign: number): number {
  if (candidate.mate !== undefined)
    return candidate.whiteScore * sign > 0 ? 1 : 0;
  return 1 / (1 + Math.exp(-0.368208 * candidate.whiteScore * sign));
}

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
  if (!after.isCheckmate() && !isDraw && !result)
    throw new Error(t("coach.review.error.needsAnalysis"));
  const resultingOutlook = after.isCheckmate()
    ? 1
    : isDraw
      ? 0.5
      : outlook(result!, sign);
  const impact = Math.max(0, (outlook(best, sign) - resultingOutlook) * 100);
  const resultingScore = after.isCheckmate()
    ? null
    : isDraw
      ? 0
      : result!.mate === undefined
        ? result!.whiteScore
        : null;
  const loss =
    best.mate === undefined && resultingScore !== null
      ? Math.max(0, (best.whiteScore - resultingScore) * sign)
      : null;
  const same = move.lan === best.move.lan;
  const label =
    same || after.isCheckmate()
      ? "Best move"
      : impact < 4
        ? "Good move"
        : impact < 12
          ? "Inaccuracy"
          : impact < 25
            ? "Mistake"
            : "Blunder";
  let text: string;
  const lesson =
    !isDraw && label !== "Best move" && label !== "Good move"
      ? lessonFor(move, best, reply, played, t)
      : undefined;
  if (after.isCheckmate())
    text = t(
      "coach.review.checkmate",
      move.san,
    );
  else if (same)
    text = t("coach.review.best", move.san, best.explanation);
  else if (label === "Good move") {
    const description = isDraw
      ? t("coach.review.good.draw")
      : result!.mate !== undefined
        ? resultingOutlook === 1
          ? t("coach.review.good.winningMate")
          : t("coach.review.good.losingMate")
        : resultingOutlook > 0.9
          ? t("coach.review.good.winning")
          : resultingOutlook < 0.1
            ? t("coach.review.good.losing")
            : t("coach.review.good.balanced", best.move.san);
    text = `${move.san} ${description}.`;
  } else {
    const consequence = isDraw
      ? t("coach.review.consequence.draw", best.move.san)
      : result!.mate !== undefined && resultingOutlook === 0
        ? t("coach.review.consequence.allowsMate")
        : best.mate !== undefined && outlook(best, sign) === 1
          ? t("coach.review.consequence.missesMate")
          : (lesson?.consequence ??
            t(
              "coach.review.consequence.worseChances",
              best.move.san,
            ));
    const response = reply
      ? (played?.reply ?? describeReply(reply.move, t))
      : isDraw
        ? t("coach.review.response.draw")
        : t("coach.review.response.preview");
    text = `${move.san} ${consequence}.${lesson?.consequence ? "" : ` ${response}`}`;
  }
  return {
    move,
    best,
    reply,
    label,
    loss,
    impact,
    text,
    lesson,
    played,
    drawn: isDraw,
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
