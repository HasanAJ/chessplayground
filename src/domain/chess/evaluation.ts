import type { Language } from "../../i18n/translate.ts";

export type PositionEvaluation = { whiteScore: number; mate?: number };

export function mateAfterMove(distance: number) {
  // A winning move consumes one of the mating side's remaining turns.
  return -distance + Number(distance > 0);
}

export function formatEvaluation(
  score: PositionEvaluation,
  locale: Language,
  precision = 2,
): string {
  const mate = score.mate !== undefined;
  const positive = mate ? score.whiteScore > 0 : score.whiteScore >= 0;
  const amount = mate
    ? `M${Math.abs(score.mate!)}`
    : new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(Math.abs(score.whiteScore));
  return `${positive ? "+" : "−"}${amount}`;
}
