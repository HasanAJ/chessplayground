import { useTranslation } from "../../i18n/LanguageProvider";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAnalysisEngine } from "../../engine/useAnalysisEngine";
import type { GameController } from "../game/useGameController";
import { MAX_RECOMMENDED_MOVES } from "./candidates";
import {
  completeAnalysis,
  localizeCandidates,
  type CompletedAnalysis,
  type RecommendationAnalysis,
} from "./recommendationAnalysis";

const SEARCH_OPTIONS = {
  depth: null,
  movetime: 2000,
  multiPV: MAX_RECOMMENDED_MOVES,
};
const MAX_CACHED_ANALYSES = 64;

export function useRecommendations(
  game: Pick<
    GameController,
    | "analysisFen"
    | "analysisKey"
    | "analysisTerminal"
    | "history"
    | "historyPly"
    | "playable"
    | "study"
  >,
  paused: boolean,
) {
  const { t } = useTranslation();
  const engine = useAnalysisEngine();
  const cache = useRef(new Map<string, CompletedAnalysis>());
  const [request, setRequest] = useState<{
    key: string;
    attempt: number;
  } | null>(null);
  const [analysis, setAnalysis] = useState<RecommendationAnalysis | null>(null);
  const history = useMemo(
    () => ({
      rootFen: game.study.rootFen,
      moves: game.history
        .slice(0, game.historyPly ?? game.history.length)
        .map((move) => move.lan),
    }),
    [game.study.rootFen, game.history, game.historyPly],
  );
  // FEN alone cannot distinguish positions with different repetition histories.
  const cacheKey = useMemo(() => JSON.stringify(history), [history]);
  const requested = request?.key === game.analysisKey;
  const current =
    requested && analysis?.key === game.analysisKey && game.playable;
  const candidates = useMemo(() => {
    if (!current || analysis.state !== "ready") return [];
    return localizeCandidates(analysis, t);
  }, [current, analysis, t]);
  const thinking =
    game.playable &&
    requested &&
    !game.analysisTerminal &&
    (!current || analysis.state === "thinking");
  useEffect(() => {
    setRequest(null);
  }, [game.analysisKey, game.playable]);
  useEffect(() => {
    if (!game.playable || game.analysisTerminal || !requested || paused) return;
    const key = game.analysisKey;
    const saved = cache.current.get(cacheKey);
    if (saved) {
      setAnalysis({ ...saved, key });
      return;
    }
    let cancelled = false;
    setAnalysis({ key, candidates: [], state: "thinking" });
    const cancelSearch = engine.current!.analyze(
      game.analysisFen,
      {
        onProgress() {},
        onComplete(lines, bestMove, bestLine) {
          if (cancelled) return;
          const ready = completeAnalysis(
            key,
            game.analysisFen,
            lines,
            bestMove,
            bestLine,
          );
          if (ready.state !== "ready") {
            setAnalysis(ready);
            return;
          }
          cache.current.set(cacheKey, ready);
          if (cache.current.size > MAX_CACHED_ANALYSES)
            cache.current.delete(cache.current.keys().next().value!);
          startTransition(() => setAnalysis(ready));
        },
        onError(error) {
          if (!cancelled)
            setAnalysis({ key, candidates: [], state: "error", error });
        },
      },
      history,
      SEARCH_OPTIONS,
    );
    return () => {
      cancelled = true;
      cancelSearch();
    };
  }, [
    game.analysisKey,
    game.playable,
    game.analysisTerminal,
    cacheKey,
    requested,
    request?.attempt,
    paused,
  ]);

  function calculate(refresh = false) {
    if (!game.playable) return;
    if (refresh) cache.current.delete(cacheKey);
    setRequest((previous) => ({
      key: game.analysisKey,
      attempt: (previous?.attempt ?? 0) + 1,
    }));
    const saved = cache.current.get(cacheKey);
    setAnalysis(
      saved
        ? { ...saved, key: game.analysisKey }
        : {
            key: game.analysisKey,
            candidates: [],
            state: "thinking",
          },
    );
  }

  const clear = useCallback(() => setRequest(null), []);

  return {
    candidates,
    best: candidates.at(0),
    thinking,
    requested,
    current,
    analysis,
    calculate,
    clear,
  };
}

export type Recommendations = ReturnType<typeof useRecommendations>;
