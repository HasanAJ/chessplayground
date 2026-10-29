import { type Diagnostic, notice } from "../../i18n/notices";
import { selectBestLine, type EngineLine } from "../../engine/uci";
import type { Translator } from "../../i18n/translate";
import {
  analyzeCandidates,
  recommendedCandidates,
  type CandidateAnalysis,
} from "./candidates";
import { presentCandidate } from "./candidatePresentation";

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
  const selected = selectBestLine(lines, bestMove, bestLine);
  const candidates = analyzeCandidates(fen, lines);
  let best: CandidateAnalysis | undefined;
  if (selected) {
    best = lines.includes(selected)
      ? candidates.find((candidate) => candidate.move.lan === selected.pv[0])
      : analyzeCandidates(fen, [{ ...selected, rank: 1 }])[0];
  }
  if (!best || candidates.length !== lines.length) {
    return {
      key,
      state: "error",
      candidates: [],
      error: notice("engine.error.noLegalCandidates"),
    };
  }
  return { key, state: "ready", candidates, best };
}

export function localizeCandidates(analysis: CompletedAnalysis, t: Translator) {
  return recommendedCandidates(analysis.candidates, analysis.best).map(
    (candidate) => presentCandidate(candidate, t),
  );
}
