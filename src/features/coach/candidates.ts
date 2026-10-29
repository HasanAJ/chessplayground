import { Chess, type Move } from "chess.js";
import type { EngineLine } from "../../engine/uci";
import { uciMove } from "../../chess/moves";
import { readContinuation } from "./continuation";

export type CandidateAnalysis = EngineLine & {
  move: Move;
  continuation: Move[];
  materialLoss: number | undefined;
  whiteScore: number;
};
export const MAX_RECOMMENDED_MOVES = 5;
const RECOMMENDATION_CP_GAP = 50;

/** Qualify alternatives at the completed depth, keeping the final choice first. */
export function recommendedCandidates<T extends CandidateAnalysis>(
  candidates: T[],
  best = candidates[0],
): T[] {
  if (!best) return [];
  const comparisonBest = candidates[0];
  const alternatives = candidates.filter((candidate) => {
    if (candidate.move.lan === best.move.lan) return false;
    // A newer mate result can rule out alternatives from the completed batch.
    if (
      best.mate !== undefined &&
      (best.mate > 0
        ? (candidate.mate ?? 0) <= 0
        : candidate.mate !== best.mate)
    )
      return false;
    if (best.mate === undefined && (candidate.mate ?? 0) < 0) return false;
    if (comparisonBest.mate !== undefined)
      return comparisonBest.mate > 0
        ? candidate.mate !== undefined && candidate.mate > 0
        : candidate.mate === comparisonBest.mate;
    if (candidate.mate !== undefined) return candidate.mate > 0;
    return (
      comparisonBest.cp !== undefined &&
      candidate.cp !== undefined &&
      comparisonBest.cp - candidate.cp <= RECOMMENDATION_CP_GAP
    );
  });
  return [best, ...alternatives].slice(0, MAX_RECOMMENDED_MOVES);
}

/** Validate the engine's moves once, independently of their display language. */
export function analyzeCandidates(
  fen: string,
  lines: EngineLine[],
): CandidateAnalysis[] {
  return [...lines]
    .sort((a, b) => a.rank - b.rank)
    .flatMap((line) => {
      const after = new Chess(fen);
      const sign = after.turn() === "w" ? 1 : -1;
      let move: Move;
      let continuation: ReturnType<typeof readContinuation>;
      try {
        move = uciMove(after, line.pv[0]);
        continuation = readContinuation(after, move, line.pv);
      } catch {
        // Malformed engine moves are rejected; presentation errors must surface.
        return [];
      }
      const whiteScore =
        line.mate !== undefined
          ? (line.mate >= 0 ? 100 : -100) * sign
          : ((line.cp ?? 0) / 100) * sign;
      return [
        {
          ...line,
          move,
          continuation: continuation.moves,
          materialLoss: continuation.materialLoss,
          whiteScore,
        },
      ];
    });
}
