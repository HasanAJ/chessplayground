import type { Language } from "../i18n/translate";

export type PositionEvaluation = {
  whiteScore: number;
  mate?: number;
};

// Winning mate in N becomes losing mate in N-1 after the winning side moves.
export function mateAfterMove(mate: number): number {
  return mate > 0 ? 1 - mate : -mate;
}

export function formatEvaluation(
  { whiteScore, mate }: PositionEvaluation,
  language: Language,
  precision = 2,
): string {
  if (mate !== undefined)
    return `${whiteScore > 0 ? "+" : "−"}M${Math.abs(mate)}`;
  return `${whiteScore >= 0 ? "+" : "−"}${Math.abs(whiteScore).toLocaleString(language, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })}`;
}
