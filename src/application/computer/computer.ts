import { Chess } from "chess.js";
import { isUciMove } from "../../domain/analysis/lines.ts";
import type { AnalysisClient, AnalysisHistory } from "../ports/analysis.ts";
import { SearchScope } from "../shared/SearchScope.ts";

export const COMPUTER_LEVELS = {
  beginner: {
    labelKey: "computer.level.beginner",
    depth: 5,
    movetime: 300,
    skill: 0,
  },
  easy: { labelKey: "computer.level.easy", depth: 8, movetime: 450, skill: 3 },
  medium: {
    labelKey: "computer.level.medium",
    depth: 11,
    movetime: 650,
    skill: 7,
  },
  hard: {
    labelKey: "computer.level.hard",
    depth: 15,
    movetime: 1000,
    skill: 13,
  },
  expert: {
    labelKey: "computer.level.expert",
    depth: 18,
    movetime: 1500,
    skill: 20,
  },
} as const;
export type ComputerLevel = keyof typeof COMPUTER_LEVELS;

export function startComputerTurn(
  engine: AnalysisClient,
  fen: string,
  history: AnalysisHistory,
  level: ComputerLevel,
  callbacks: {
    onWaiting: () => void;
    onMove: (uci: string) => void;
    onError: () => void;
  },
) {
  const scope = new SearchScope(engine);
  const started = Date.now();
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  scope.run(
    fen,
    {
      onProgress() {},
      onError: callbacks.onError,
      onComplete(lines, selected) {
        const move = selected ?? lines[0]?.pv[0];
        const legal =
          move &&
          isUciMove(move) &&
          new Chess(fen)
            .moves({ verbose: true })
            .some((choice) => choice.lan === move);
        if (!legal) {
          callbacks.onError();
          return;
        }
        const remaining = Math.max(0, 1000 - (Date.now() - started));
        const deliver = () => {
          if (!disposed) callbacks.onMove(move);
        };
        if (remaining === 0) deliver();
        else {
          callbacks.onWaiting();
          timer = setTimeout(deliver, remaining);
        }
      },
    },
    history,
    { ...COMPUTER_LEVELS[level], multiPV: 1 },
  );
  return () => {
    disposed = true;
    clearTimeout(timer);
    scope.dispose();
  };
}
