import { useEffect, useRef } from "react";
import { AnalysisEngine } from "./AnalysisEngine";

/** Own a warm worker for the lifetime of its consumer. */
export function useAnalysisEngine() {
  const engine = useRef<AnalysisEngine | null>(null);
  useEffect(() => {
    const instance = new AnalysisEngine();
    engine.current = instance;
    return () => {
      instance.dispose();
      engine.current = null;
    };
  }, []);
  return engine;
}
