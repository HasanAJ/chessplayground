import { useEffect, useRef, useState } from "react";
import { useAnalysisEngine } from "../../engine/useAnalysisEngine";
import { startMoveReview, type ReviewState } from "./moveReview";
import { ROOT, type Study } from "../../chess/study";

export function useMoveReview(
  study: Study,
  nodeId: string | null,
  retry: number,
) {
  const engine = useAnalysisEngine();
  const cache = useRef(new Map<string, ReviewState>());
  const [result, setResult] = useState<ReviewState | null>(null);
  const key = `${study.id}:${nodeId}:${retry}`;
  useEffect(() => {
    cache.current.clear();
  }, [study.id]);
  useEffect(() => {
    if (!nodeId || nodeId === ROOT) {
      setResult(null);
      return;
    }
    const saved = cache.current.get(key);
    if (saved) {
      setResult(saved);
      return;
    }
    setResult({ key, state: "thinking" });
    return startMoveReview(engine.current!, study, nodeId, {
      onComplete(review) {
        const ready: ReviewState = { key, state: "ready", review };
        cache.current.set(key, ready);
        setResult(ready);
      },
      onError(error) {
        setResult({ key, state: "error", error });
      },
    });
  }, [study.id, nodeId, retry]);
  return result?.key === key
    ? result
    : nodeId && nodeId !== ROOT
      ? { key, state: "thinking" as const }
      : null;
}
