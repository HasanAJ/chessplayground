import type { Move } from "chess.js";
import { mateAfterMove, type PositionEvaluation } from "../chess/evaluation.ts";

export type MoveGrade =
  | "Best move"
  | "Excellent move"
  | "Good move"
  | "Inaccuracy"
  | "Mistake"
  | "Blunder";
export type ReviewOutcome =
  | { kind: "checkmate" }
  | { kind: "draw" }
  | {
      kind: "ongoing";
      evaluation: PositionEvaluation;
      source: "played" | "reply";
    };
type ScoredMove = PositionEvaluation & { move: Pick<Move, "lan"> };

// Lichess's evaluation-to-outlook curve; the grade bands are Tempo's policy.
// https://lichess.org/page/accuracy
export function outlook(score: PositionEvaluation, perspective: number) {
  const advantage = score.whiteScore * perspective;
  return score.mate === undefined
    ? 1 / (1 + Math.exp(-0.368208 * advantage))
    : Number(advantage > 0);
}
const bands: readonly [number, MoveGrade][] = [
  [2, "Excellent move"],
  [4, "Good move"],
  [12, "Inaccuracy"],
  [25, "Mistake"],
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

export function moveQuality(
  move: Pick<Move, "lan" | "color">,
  best: ScoredMove,
  outcome: ReviewOutcome,
) {
  const perspective = move.color === "w" ? 1 : -1;
  const final = result(outcome, perspective);
  const loss = Math.max(
    0,
    100 * (outlook(best, perspective) - final.resultingOutlook),
  );
  const label: MoveGrade =
    outcome.kind === "checkmate" || move.lan === best.move.lan
      ? "Best move"
      : bands.find(([maximum]) => loss < maximum)![1];
  return { ...final, label };
}
