import { useEffect, useRef, useState } from "react";
import { useAnalysisEngine } from "../../engine/useAnalysisEngine";
import { startMoveReview, type ReviewState } from "./moveReview";
import type { GameController } from "../game/useGameController";

export function useMoveReview(
  game: GameController,
  ply: number | null,
  retry: number,
) {
  const engine = useAnalysisEngine();
  const { study, history, path, outcomes } = game;
  const nodeId = ply ? path[ply - 1]?.id : null;
  const cache = useRef(new Map<string, ReviewState>());
  const [result, setResult] = useState<ReviewState | null>(null);
  const key = `${study.id}:${nodeId}:${retry}`;
  useEffect(() => {
    cache.current.clear();
  }, [study.id]);
  useEffect(() => {
    if (!nodeId || !ply) {
      setResult(null);
      return;
    }
    const saved = cache.current.get(key);
    if (saved) {
      setResult(saved);
      return;
    }
    setResult({ key, state: "thinking" });
    return startMoveReview(
      engine.current!,
      {
        move: history[ply - 1],
        history: {
          rootFen: study.rootFen,
          moves: history.slice(0, ply).map((move) => move.lan),
        },
        ...outcomes[ply],
      },
      {
        onComplete(review) {
          const ready: ReviewState = { key, state: "ready", review };
          cache.current.set(key, ready);
          setResult(ready);
        },
        onError(error) {
          setResult({ key, state: "error", error });
        },
      },
    );
  }, [study.id, nodeId, retry]);
  return result?.key === key
    ? result
    : nodeId
      ? { key, state: "thinking" as const }
      : null;
}
