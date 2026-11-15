import { useEffect, useRef } from "react";
import { AnalysisEngine } from "../../infrastructure/stockfish/AnalysisEngine.ts";

/** Construction is cheap; the worker boots only when the consumer first searches. */
export function useAnalysisEngine() {
  const engine = useRef<AnalysisEngine | null>(null);
  useEffect(() => {
    const owned = new AnalysisEngine();
    engine.current = owned;
    return () => {
      owned.dispose();
      if (engine.current === owned) engine.current = null;
    };
  }, []);
  return engine;
}
