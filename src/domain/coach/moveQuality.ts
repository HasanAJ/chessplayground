import { Chess, type Move } from "chess.js";
import { mateAfterMove, type PositionEvaluation } from "../chess/evaluation.ts";
import type { CandidateAnalysis } from "./candidates.ts";
import { hangsMaterial, settledMaterialGain } from "./materialTactics.ts";

export type MoveGrade =
  | "Best move"
  | "Excellent move"
  | "Good move"
  | "Inaccuracy"
  | "Mistake"
  | "Miss"
  | "Blunder";
export type ReviewOutcome =
  | { kind: "checkmate" }
  | { kind: "draw" }
  | {
      kind: "ongoing";
      evaluation: PositionEvaluation;
      source: "played" | "reply";
    };
export type MissedOpportunity = "mate" | "material";

// Lichess's evaluation-to-outlook curve, independent of player rating.
// https://lichess.org/page/accuracy
export function outlook(score: PositionEvaluation, perspective: number) {
  const advantage = score.whiteScore * perspective;
  return score.mate === undefined
    ? 1 / (1 + Math.exp(-0.368208 * advantage))
    : Number(advantage > 0);
}
// Chess.com's published expected-points bands, applied to our outlook estimate.
// https://support.chess.com/en/articles/8572705-how-are-moves-classified-what-is-a-blunder-or-brilliant-etc
const bands: readonly [number, MoveGrade][] = [
  [2, "Excellent move"],
  [5, "Good move"],
  [10, "Inaccuracy"],
  [20, "Mistake"],
  [Infinity, "Blunder"],
];

function result(outcome: ReviewOutcome, perspective: number) {
  switch (outcome.kind) {
    case "checkmate":
      return {
        evaluation: { whiteScore: 100 * perspective, mate: 0 },
        resultingOutlook: 1,
      };
    case "draw":
      return { evaluation: { whiteScore: 0 }, resultingOutlook: 0.5 };
    case "ongoing": {
      const score = outcome.evaluation;
      const evaluation: PositionEvaluation = {
        whiteScore: score.whiteScore,
        mate:
          score.mate === undefined
            ? undefined
            : outcome.source === "played"
              ? mateAfterMove(score.mate)
              : score.mate,
      };
      return { evaluation, resultingOutlook: outlook(score, perspective) };
    }
  }
}

function winningOpportunity(
  best: CandidateAnalysis,
): MissedOpportunity | undefined {
  if (best.mate !== undefined) return best.mate > 0 ? "mate" : undefined;
  const moves = best.continuation;
  const last = moves.at(-1)!;
  const board = new Chess(last.after);
  if (
    board.isDraw() ||
    (moves.length !== best.pv.length && !board.isGameOver())
  )
    return undefined;
  const gain = settledMaterialGain(moves, best.move.color);
  return gain >= 2 ? "material" : undefined;
}

export function moveQuality(
  move: Move,
  best: CandidateAnalysis,
  outcome: ReviewOutcome,
  continuation: readonly Move[],
) {
  const perspective = move.color === "w" ? 1 : -1;
  const final = result(outcome, perspective);
  const bestOutlook = outlook(best, perspective);
  const loss = Math.max(0, 100 * (bestOutlook - final.resultingOutlook));
  const label: MoveGrade =
    outcome.kind === "checkmate" || move.lan === best.move.lan
      ? "Best move"
      : bands.find(([maximum]) => loss < maximum)![1];
  // Outlook loss can hide passing up mate in one in an already won position.
  const missedMateInOne =
    label !== "Best move" &&
    best.mate === 1 &&
    final.evaluation.mate === undefined &&
    new Chess(best.move.after).isCheckmate();
  // Other misses must lose a winning chance (75% outlook) and a concrete tactic.
  const losesWinningChance =
    (label === "Mistake" || label === "Blunder") &&
    bestOutlook >= 0.75 &&
    final.resultingOutlook < 0.75;
  const opportunity =
    (missedMateInOne || losesWinningChance) &&
    !(final.evaluation.mate !== undefined && final.resultingOutlook === 0) &&
    !hangsMaterial(continuation)
      ? winningOpportunity(best)
      : undefined;
  const grade: MoveGrade = opportunity
    ? "Miss"
    : missedMateInOne && label !== "Blunder"
      ? "Mistake"
      : label;
  return { ...final, label: grade, opportunity };
}
