import { type Diagnostic } from "../i18n/notices";
import type { EngineLine } from "./uci";

export type AnalysisCallbacks = {
  onProgress: (depth: number) => void;
  // Lines share one completed depth; bestLine may come from a newer iteration.
  onComplete: (
    lines: EngineLine[],
    bestMove?: string,
    bestLine?: EngineLine,
  ) => void;
  onError: (message: Diagnostic) => void;
};

export type SearchOptions = {
  // Null uses only the time budget, with no depth ceiling.
  depth?: number | null;
  movetime?: number;
  multiPV?: number;
  skill?: number;
  searchMoves?: string[];
};

export type AnalysisHistory = { rootFen: string; moves: string[] };

export interface AnalysisClient {
  analyze(
    fen: string,
    callbacks: AnalysisCallbacks,
    history?: AnalysisHistory,
    options?: SearchOptions,
  ): () => void;
}
