import type { Move } from "chess.js";
import { mateAfterMove, type PositionEvaluation } from "../../chess/evaluation";

export type MoveGrade =
  | "Best move"
  | "Good move"
  | "Inaccuracy"
  | "Mistake"
  | "Blunder";

export type ReviewOutcome =
  | { kind: "checkmate" }
  | { kind: "draw" }
  | { kind: "ongoing"; evaluation: PositionEvaluation; source: "played" | "reply" };

type ScoredMove = PositionEvaluation & { move: Pick<Move, "lan"> };
type MoveQuality = {
  evaluation: PositionEvaluation;
  resultingOutlook: number;
  label: MoveGrade;
};

// Lichess's published evaluation-to-outlook curve, with Tempo's own grade bands.
// https://lichess.org/page/accuracy
export function outlook(evaluation: PositionEvaluation, sign: number): number {
  if (evaluation.mate !== undefined)
    return evaluation.whiteScore * sign > 0 ? 1 : 0;
  return 1 / (1 + Math.exp(-0.368208 * evaluation.whiteScore * sign));
}

/** Grade comparable engine scores; terminal outcomes take precedence over analysis. */
export function moveQuality(
  move: Pick<Move, "lan" | "color">,
  best: ScoredMove,
  outcome: ReviewOutcome,
): MoveQuality {
  const sign = move.color === "w" ? 1 : -1;
  let evaluation: PositionEvaluation;
  let resultingOutlook: number;

  if (outcome.kind === "checkmate") {
    evaluation = { whiteScore: sign * 100, mate: 0 };
    resultingOutlook = 1;
  } else if (outcome.kind === "draw") {
    evaluation = { whiteScore: 0 };
    resultingOutlook = 0.5;
  } else {
    const result = outcome.evaluation;
    evaluation = {
      whiteScore: result.whiteScore,
      // A played line starts one ply before the reviewed position.
      mate:
        result.mate === undefined
          ? undefined
          : outcome.source === "played"
            ? mateAfterMove(result.mate)
            : result.mate,
    };
    resultingOutlook = outlook(result, sign);
  }

  const impact = Math.max(0, (outlook(best, sign) - resultingOutlook) * 100);
  return {
    evaluation,
    resultingOutlook,
    label: gradeFor(
      move.lan === best.move.lan || outcome.kind === "checkmate",
      impact,
    ),
  };
}

function gradeFor(best: boolean, impact: number): MoveGrade {
  if (best) return "Best move";
  if (impact < 4) return "Good move";
  if (impact < 12) return "Inaccuracy";
  if (impact < 25) return "Mistake";
  return "Blunder";
}
