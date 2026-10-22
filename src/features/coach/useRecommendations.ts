import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../../i18n/translate";
import { useAnalysisEngine } from "../../engine/useAnalysisEngine";
import type { GameController } from "../game/useGameController";
import {
  candidatesFor,
  MAX_RECOMMENDED_MOVES,
  recommendedCandidates,
  type Candidate,
} from "./candidates";

type Analysis = {
  key: string;
  candidates: Candidate[];
  depth: number;
  state: "thinking" | "ready" | "error";
  language?: Language;
  error?: string;
};
type CompletedAnalysis = Analysis & { state: "ready"; language: Language };
const SEARCH_OPTIONS = {
  depth: 18,
  movetime: 1800,
  multiPV: MAX_RECOMMENDED_MOVES,
};
const MAX_CACHED_ANALYSES = 64;

export function useRecommendations(game: GameController, paused: boolean) {
  const { t } = useTranslation();
  const engine = useAnalysisEngine();
  const cache = useRef(new Map<string, CompletedAnalysis>());
  const [request, setRequest] = useState<{
    key: string;
    attempt: number;
  } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
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
  const cacheKey = useMemo(
    () => JSON.stringify([history, SEARCH_OPTIONS]),
    [history],
  );
  const requested = request?.key === game.analysisKey;
  const current =
    requested && analysis?.key === game.analysisKey && game.playable;
  const candidates = useMemo(
    () =>
      current
        ? recommendedCandidates(
            analysis.language === t.language
              ? analysis.candidates
              : candidatesFor(game.analysisFen, analysis.candidates, t),
          )
        : [],
    [current, analysis, game.analysisFen, t],
  );
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
    setAnalysis({ key, candidates: [], depth: 0, state: "thinking" });
    const cancelSearch = engine.current!.analyze(
      game.analysisFen,
      {
        onProgress: (depth) => {
          if (cancelled) return;
          setAnalysis((previous) =>
            previous?.key === key ? { ...previous, depth } : previous,
          );
        },
        onComplete(lines) {
          if (cancelled) return;
          const next = candidatesFor(game.analysisFen, lines, t);
          if (!next.length || next.length !== lines.length) {
            setAnalysis({
              key,
              candidates: [],
              depth: 0,
              state: "error",
              error:
                "The engine returned no legal candidates. Please retry analysis.",
            });
            return;
          }
          const ready: CompletedAnalysis = {
            key,
            candidates: next,
            depth: lines[0].depth,
            state: "ready",
            language: t.language,
          };
          cache.current.set(cacheKey, ready);
          if (cache.current.size > MAX_CACHED_ANALYSES)
            cache.current.delete(cache.current.keys().next().value!);
          setAnalysis(ready);
        },
        onError(error) {
          if (!cancelled)
            setAnalysis({ key, candidates: [], depth: 0, state: "error", error });
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
            depth: 0,
            state: "thinking",
          },
    );
  }

  return {
    candidates,
    best: candidates.at(0),
    thinking,
    requested,
    current,
    analysis,
    calculate,
    clear: () => setRequest(null),
  };
}

export type Recommendations = ReturnType<typeof useRecommendations>;
