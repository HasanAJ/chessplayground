import { Chess, type Move } from "chess.js";
import type { EngineLine } from "../../engine/uci";
import { moveDescription, uciMove } from "../../chess/moves";
import {
  boardFocus,
  describeReply,
  explainMove,
  type BoardFocus,
} from "./explanations";

export type Candidate = EngineLine & {
  move: Move;
  title: string;
  explanation: string;
  explanationFocus?: BoardFocus;
  reply: string;
  continuation: Move[];
  theme: string;
  score: string;
  whiteScore: number;
};
export const MAX_RECOMMENDED_MOVES = 5;
const RECOMMENDATION_CP_GAP = 50;

/** Keep useful alternatives to the first, engine-ranked move. UCI scores favor the mover. */
export function recommendedCandidates(candidates: Candidate[]): Candidate[] {
  const best = candidates[0];
  if (!best) return [];
  return candidates
    .filter((candidate, index) => {
      if (index === 0) return true;
      if (best.mate !== undefined)
        return best.mate > 0
          ? candidate.mate !== undefined && candidate.mate > 0
          : candidate.mate === best.mate;
      if (candidate.mate !== undefined) return candidate.mate > 0;
      return (
        best.cp !== undefined &&
        candidate.cp !== undefined &&
        best.cp - candidate.cp <= RECOMMENDATION_CP_GAP
      );
    })
    .slice(0, MAX_RECOMMENDED_MOVES);
}

export function candidatesFor(fen: string, lines: EngineLine[]): Candidate[] {
  return [...lines]
    .sort((a, b) => a.rank - b.rank)
    .flatMap((line) => {
      const before = new Chess(fen),
        after = new Chess(fen);
      try {
        const move = uciMove(after, line.pv[0]);
        let insight = explainMove(before, after, move);
        if (line.mate !== undefined && line.mate > 0 && !after.isCheckmate()) {
          insight = {
            title: "Keep the mating attack going",
            text: `There’s a checkmate in ${line.mate} moves starting with ${move.san}, according to this analysis. Play through the replies to see how the attack works.`,
            theme: "mating-attack",
            focus: boardFocus("See the start of the mating attack", [
              { from: move.from, to: move.to },
            ]),
          };
        } else if (line.mate !== undefined && line.mate < 0) {
          insight = {
            title: "Find the toughest defense",
            text: `Your king is in serious trouble: this analysis still finds a forced checkmate after ${move.san}. Play through their checks to see where the danger comes from.`,
            theme: "mate-defense",
            focus: boardFocus("See the defensive move", [
              { from: move.from, to: move.to },
            ]),
          };
        }
        const continuation: Move[] = [move];
        let reply =
          "No reply is included in this preview. Try the move to explore what comes next.";
        if (line.pv[1] && !after.isGameOver()) {
          // An invalid immediate reply rejects the candidate; later errors only
          // shorten the preview. Parse each move once for both prose and frames.
          const response = uciMove(after, line.pv[1]);
          continuation.push(response);
          for (const uci of line.pv.slice(2, 6)) {
            try {
              continuation.push(uciMove(after, uci));
            } catch {
              break;
            }
          }
          reply = `${describeReply(response)}${continuation[2] ? ` You could follow with ${continuation[2].san}: ${moveDescription(continuation[2])}.` : ""}`;
        } else if (after.isGameOver())
          reply = after.isCheckmate()
            ? "That’s checkmate. They have no reply."
            : "This move ends the game in a draw.";
        const sign = before.turn() === "w" ? 1 : -1;
        const whiteScore =
          line.mate !== undefined
            ? (line.mate >= 0 ? 100 : -100) * sign
            : ((line.cp ?? 0) / 100) * sign;
        const score =
          line.mate !== undefined
            ? `${whiteScore > 0 ? "+" : "−"}M${Math.abs(line.mate)}`
            : `${whiteScore >= 0 ? "+" : "−"}${Math.abs(whiteScore).toFixed(2)}`;
        return [
          {
            ...line,
            move,
            title: insight.title,
            explanation: insight.text,
            explanationFocus: insight.focus,
            theme: insight.theme,
            reply,
            continuation,
            whiteScore,
            score,
          },
        ];
      } catch {
        return [];
      }
    });
}

export function positionSummary(candidate: Candidate): string {
  if (candidate.mate !== undefined)
    return `A forced mate for ${candidate.whiteScore > 0 ? "White" : "Black"}`;
  const advantage = Math.abs(candidate.whiteScore),
    side = candidate.whiteScore >= 0 ? "White" : "Black";
  if (advantage < 0.3) return "A balanced position";
  if (advantage < 1) return `${side} has a small edge`;
  if (advantage < 3) return `${side} has the advantage`;
  return `${side} has a winning advantage`;
}
