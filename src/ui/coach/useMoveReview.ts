import { useEffect, useRef, useState } from "react";
import { useAnalysisEngine } from "../shared/useAnalysisEngine.ts";
import {
  startMoveReview,
  type ReviewState,
} from "../../application/review/moveReview.ts";
import type { GameController } from "../game/useGameController.ts";

export function useMoveReview(
  game: Pick<GameController, "history" | "outcomes" | "path" | "study">,
  ply: number | null,
  retry: number,
  paused: boolean,
) {
  const engine = useAnalysisEngine();
  const cache = useRef(new Map<string, ReviewState>());
  const [result, setResult] = useState<ReviewState | null>(null);
  const node = ply ? game.path[ply - 1] : undefined;
  const key = `${game.study.id}:${node?.id ?? null}:${retry}`;
  useEffect(() => {
    cache.current.clear();
  }, [game.study.id]);
  useEffect(() => {
    if (!node || !ply) {
      setResult(null);
      return;
    }
    const saved = cache.current.get(key);
    if (saved) {
      setResult(saved);
      return;
    }
    if (paused) return;
    setResult({ key, state: "thinking" });
    return startMoveReview(
      engine.current!,
      {
        move: game.history[ply - 1],
        ...game.outcomes[ply],
        history: {
          rootFen: game.study.rootFen,
          moves: game.history.slice(0, ply).map((move) => move.lan),
        },
      },
      {
        onError: (error) => setResult({ key, state: "error", error }),
        onComplete(review) {
          const ready: ReviewState = { key, state: "ready", review };
          cache.current.set(key, ready);
          if (cache.current.size > 64)
            cache.current.delete(cache.current.keys().next().value!);
          setResult(ready);
        },
      },
    );
  }, [game.study.id, node?.id, retry, paused]);
  return result?.key === key
    ? result
    : node
      ? { key, state: "thinking" as const }
      : null;
}
