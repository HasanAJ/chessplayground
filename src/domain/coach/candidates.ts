import { Chess } from "chess.js";
import type { EngineLine } from "../analysis/lines.ts";
import { uciMove } from "../chess/moves.ts";
import { readContinuation } from "./continuation.ts";

export type CandidateAnalysis = EngineLine & {
  move: ReturnType<typeof uciMove>;
  continuation: ReturnType<typeof uciMove>[];
  materialLoss: number | undefined;
  whiteScore: number;
};
export function analyzeCandidates(
  fen: string,
  lines: EngineLine[],
): CandidateAnalysis[] {
  const candidates: CandidateAnalysis[] = [];
  for (const line of [...lines].sort((a, b) => a.rank - b.rank)) {
    const board = new Chess(fen);
    const perspective = board.turn() === "w" ? 1 : -1;
    try {
      const move = uciMove(board, line.pv[0]);
      const continuation = readContinuation(board, move, line.pv);
      candidates.push({
        ...line,
        move,
        continuation: continuation.moves,
        materialLoss: continuation.materialLoss,
        whiteScore:
          perspective *
          (line.mate === undefined
            ? (line.cp ?? 0) / 100
            : line.mate >= 0
              ? 100
              : -100),
      });
    } catch {
      /* Reject invalid engine continuations before presentation. */
    }
  }
  return candidates;
}
function comparable(
  candidate: CandidateAnalysis,
  best: CandidateAnalysis,
  completed: CandidateAnalysis,
) {
  if (
    best.mate !== undefined &&
    (best.mate > 0 ? (candidate.mate ?? 0) <= 0 : candidate.mate !== best.mate)
  )
    return false;
  if (best.mate === undefined && (candidate.mate ?? 0) < 0) return false;
  if (completed.mate !== undefined)
    return completed.mate > 0
      ? (candidate.mate ?? 0) > 0
      : candidate.mate === completed.mate;
  if (candidate.mate !== undefined) return candidate.mate > 0;
  return (
    candidate.cp !== undefined &&
    completed.cp !== undefined &&
    completed.cp - candidate.cp <= 50
  );
}
export function recommendedCandidates<T extends CandidateAnalysis>(
  candidates: T[],
  best = candidates[0],
  limit = candidates.length,
): T[] {
  if (!best) return [];
  const roots = new Set<string>();
  return [
    best,
    ...candidates.filter((candidate) =>
      comparable(candidate, best, candidates[0]),
    ),
  ]
    .filter((candidate) => {
      const root = candidate.move.from + candidate.move.to;
      if (roots.has(root)) return false;
      roots.add(root);
      return true;
    })
    .slice(0, limit);
}
