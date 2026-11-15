import { notice, type Diagnostic } from "../../i18n/notices.ts";
import {
  selectBestLine,
  type EngineLine,
} from "../../domain/analysis/lines.ts";
import type { Translator } from "../../i18n/translate.ts";
import {
  analyzeCandidates,
  recommendedCandidates,
  type CandidateAnalysis,
} from "../../domain/coach/candidates.ts";
import { presentCandidate } from "../../domain/coach/candidatePresentation.ts";

export type CompletedAnalysis = {
  key: string;
  state: "ready";
  candidates: CandidateAnalysis[];
  best: CandidateAnalysis;
};
export type RecommendationAnalysis =
  | CompletedAnalysis
  | { key: string; state: "thinking"; candidates: [] }
  | { key: string; state: "error"; candidates: []; error: Diagnostic };

export function completeAnalysis(
  key: string,
  fen: string,
  lines: EngineLine[],
  bestMove: string | undefined,
  bestLine: EngineLine | undefined,
): RecommendationAnalysis {
  const candidates = analyzeCandidates(fen, lines);
  const winner = selectBestLine(lines, bestMove, bestLine);
  const completedWinner =
    winner && lines.includes(winner)
      ? candidates.find(({ move }) => move.lan === winner.pv[0])
      : undefined;
  const best =
    completedWinner ??
    (winner && !lines.includes(winner)
      ? analyzeCandidates(fen, [{ ...winner, rank: 1 }]).at(0)
      : undefined);
  return best && candidates.length === lines.length
    ? { key, state: "ready", candidates, best }
    : {
        key,
        state: "error",
        candidates: [],
        error: notice("engine.error.noLegalCandidates"),
      };
}
export function localizeCandidates(
  analysis: CompletedAnalysis,
  t: Translator,
  limit: number,
) {
  const recommendations = recommendedCandidates(
    analysis.candidates,
    analysis.best,
    limit,
  );
  return recommendations.map((analysis) => presentCandidate(analysis, t));
}
