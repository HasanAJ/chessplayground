import { Chess, type Move } from "chess.js";
import type { Candidate } from "./candidates";
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
): MoveReview {
  const after = new Chess(move.after);
  const sign = move.color === "w" ? 1 : -1;
  const isDraw = drawn || after.isDraw();
  const result = played ?? reply;
  if (!after.isCheckmate() && !isDraw && !result)
    throw new Error("The move needs analysis of the resulting position.");
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
      ? lessonFor(move, best, reply, played)
      : undefined;
  if (after.isCheckmate())
    text = `${move.san} delivers checkmate. Their king has no way out—you’ve finished the game.`;
  else if (same)
    text = `${move.san} is the top choice here. ${best.explanation}`;
  else if (label === "Good move") {
    const description = isDraw
      ? "gets you a draw, close to the best result found here"
      : result!.mate !== undefined
        ? resultingOutlook === 1
          ? "keeps your checkmate on track in the analyzed line"
          : "holds up about as well as the best defense found here, though the analysis still finds mate against you"
        : resultingOutlook > 0.9
          ? "keeps your strong advantage. You’re still in a great position"
          : resultingOutlook < 0.1
            ? "holds up about as well as the best option in an already tough position"
            : `looks good here, with chances close to ${best.move.san}`;
    text = `${move.san} ${description}.`;
  } else {
    const consequence = isDraw
      ? `leads to a draw. ${best.move.san} offered better chances`
      : result!.mate !== undefined && resultingOutlook === 0
        ? "allows a forced checkmate in the analyzed line"
        : best.mate !== undefined && outlook(best, sign) === 1
          ? "lets a forced checkmate slip away"
          : (lesson?.consequence ??
            `gives your opponent better chances than ${best.move.san} would`);
    const response = reply
      ? (played?.reply ?? describeReply(reply.move))
      : isDraw
        ? "Try the other move to see what you could keep playing for."
        : "Play through the reply to see what they could do next.";
    text = `${move.san} ${consequence}.${lesson?.consequence ? "" : ` ${response}`}`;
  }
  return { move, best, reply, label, loss, impact, text, lesson };
}
