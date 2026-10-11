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
    throw new Error(t("The move needs analysis of the resulting position."));
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
      "{0} delivers checkmate. Their king has no way out—you’ve finished the game.",
      move.san,
    );
  else if (same)
    text = t("{0} is the top choice here. {1}", move.san, best.explanation);
  else if (label === "Good move") {
    const description = isDraw
      ? t("gets you a draw, close to the best result found here")
      : result!.mate !== undefined
        ? resultingOutlook === 1
          ? t("keeps your checkmate on track in the analyzed line")
          : t(
              "holds up about as well as the best defense found here, though the analysis still finds mate against you",
            )
        : resultingOutlook > 0.9
          ? t("keeps your strong advantage. You’re still in a great position")
          : resultingOutlook < 0.1
            ? t(
                "holds up about as well as the best option in an already tough position",
              )
            : t("looks good here, with chances close to {0}", best.move.san);
    text = `${move.san} ${description}.`;
  } else {
    const consequence = isDraw
      ? t("leads to a draw. {0} offered better chances", best.move.san)
      : result!.mate !== undefined && resultingOutlook === 0
        ? t("allows a forced checkmate in the analyzed line")
        : best.mate !== undefined && outlook(best, sign) === 1
          ? t("lets a forced checkmate slip away")
          : (lesson?.consequence ??
            t(
              "gives your opponent better chances than {0} would",
              best.move.san,
            ));
    const response = reply
      ? (played?.reply ?? describeReply(reply.move, t))
      : isDraw
        ? t("Try the other move to see what you could keep playing for.")
        : t("Play through the reply to see what they could do next.");
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
