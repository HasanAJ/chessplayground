import { isUciMove, type EngineLine } from "../../domain/analysis/lines.ts";
import type {
  SearchOptions,
  AnalysisHistory,
} from "../../application/ports/analysis.ts";

export function parseInfo(message: string): EngineLine | null {
  const tokens = message.trim().split(/\s+/);
  if (
    tokens[0] !== "info" ||
    tokens.includes("upperbound") ||
    tokens.includes("lowerbound")
  )
    return null;
  const value = (key: string) => tokens[tokens.indexOf(key) + 1];
  const depth = Number(value("depth"));
  const rank = tokens.includes("multipv") ? Number(value("multipv")) : 1;
  const scoreAt = tokens.indexOf("score");
  const scoreType = tokens[scoreAt + 1];
  const score = Number(tokens[scoreAt + 2]);
  const pvAt = tokens.indexOf("pv");
  if (
    !tokens.includes("depth") ||
    !Number.isSafeInteger(depth) ||
    depth < 0 ||
    !Number.isSafeInteger(rank) ||
    rank < 1 ||
    scoreAt < 0 ||
    !["cp", "mate"].includes(scoreType) ||
    !Number.isSafeInteger(score) ||
    pvAt < 0
  )
    return null;
  const pv = tokens.slice(pvAt + 1);
  if (!pv.length || !pv.every(isUciMove)) return null;
  return { depth, rank, [scoreType]: score, pv };
}

export function positionCommand(fen: string, history?: AnalysisHistory) {
  return history
    ? `position fen ${history.rootFen}${history.moves.length ? ` moves ${history.moves.join(" ")}` : ""}`
    : `position fen ${fen}`;
}

export function searchCommand(options: SearchOptions) {
  const depth = options.depth === null ? "" : ` depth ${options.depth ?? 18}`;
  const moves = options.searchMoves?.length
    ? ` searchmoves ${options.searchMoves.join(" ")}`
    : "";
  return `go${depth} movetime ${options.movetime ?? 1800}${moves}`;
}
