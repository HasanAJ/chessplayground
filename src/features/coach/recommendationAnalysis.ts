import type { EngineLine } from "../../engine/uci";
import type { Language, Translator } from "../../i18n/translate";
import { candidatesFor, recommendedCandidates, type Candidate } from "./candidates";

export type CompletedAnalysis = {
  key: string;
  state: "ready";
  candidates: Candidate[];
  best: Candidate;
  language: Language;
};

export type RecommendationAnalysis =
  | CompletedAnalysis
  | { key: string; state: "thinking"; candidates: [] }
  | { key: string; state: "error"; candidates: []; error: string };

export function completeAnalysis(
  key: string,
  fen: string,
  lines: EngineLine[],
  bestMove: string | undefined,
  bestLine: EngineLine | undefined,
  t: Translator,
): RecommendationAnalysis {
  const selected = bestMove
    ? bestLine?.pv[0] === bestMove
      ? bestLine
      : lines.find((line) => line.pv[0] === bestMove)
    : lines[0];
  const candidates = candidatesFor(fen, lines, t);
  const best = !selected
    ? undefined
    : lines.includes(selected)
      ? candidates.find((candidate) => candidate.move.lan === selected.pv[0])
      : candidatesFor(fen, [{ ...selected, rank: 1 }], t)[0];

  if (!best || candidates.length !== lines.length) {
    return {
      key,
      state: "error",
      candidates: [],
      error: "The engine returned no legal candidates. Please retry analysis.",
    };
  }
  return { key, state: "ready", candidates, best, language: t.language };
}

export function localizeCandidates(
  analysis: CompletedAnalysis,
  fen: string,
  t: Translator,
) {
  if (analysis.language === t.language)
    return recommendedCandidates(analysis.candidates, analysis.best);

  return recommendedCandidates(
    candidatesFor(fen, analysis.candidates, t),
    candidatesFor(fen, [analysis.best], t)[0],
  );
}
