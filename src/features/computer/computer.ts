import type { AnalysisClient } from "../../engine/analysis";

export const COMPUTER_LEVELS = {
  beginner: {
    labelKey: "computer.level.beginner",
    depth: 5,
    movetime: 300,
    skill: 0,
  },
  easy: { labelKey: "computer.level.easy", depth: 8, movetime: 450, skill: 3 },
  medium: { labelKey: "computer.level.medium", depth: 11, movetime: 650, skill: 7 },
  hard: { labelKey: "computer.level.hard", depth: 15, movetime: 1000, skill: 13 },
  expert: { labelKey: "computer.level.expert", depth: 18, movetime: 1500, skill: 20 },
} as const;
export type ComputerLevel = keyof typeof COMPUTER_LEVELS;

export function startComputerTurn(
  engine: AnalysisClient,
  fen: string,
  history: { rootFen: string; moves: string[] },
  level: ComputerLevel,
  callbacks: {
    onWaiting: () => void;
    onMove: (uci: string) => void;
    onError: () => void;
  },
): () => void {
  const startedAt = Date.now();
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancelSearch = engine.analyze(
    fen,
    {
      onProgress() {},
      onError() {
        if (!cancelled) callbacks.onError();
      },
      onComplete(lines, bestMove) {
        if (cancelled) return;
        const uci = bestMove ?? lines[0]?.pv[0];
        if (!uci || !/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci)) {
          callbacks.onError();
          return;
        }
        const remaining = Math.max(0, 1000 - (Date.now() - startedAt));
        const move = () => {
          if (!cancelled) callbacks.onMove(uci);
        };
        if (remaining > 0) {
          callbacks.onWaiting();
          timer = setTimeout(move, remaining);
        } else move();
      },
    },
    history,
    { ...COMPUTER_LEVELS[level], multiPV: 1 },
  );
  return () => {
    cancelled = true;
    clearTimeout(timer);
    cancelSearch();
  };
}
