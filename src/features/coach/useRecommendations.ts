import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useMemo, useState } from "react";
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
  error?: string;
};

export function useRecommendations(game: GameController, paused: boolean) {
  const { t } = useTranslation();
  const engine = useAnalysisEngine();
  const [request, setRequest] = useState<{
    key: string;
    attempt: number;
  } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const requested = request?.key === game.analysisKey;
  const current =
    requested && analysis?.key === game.analysisKey && game.playable;
  const candidates = useMemo(
    () =>
      current
        ? recommendedCandidates(
            candidatesFor(game.analysisFen, analysis.candidates, t),
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
    setAnalysis({ key, candidates: [], depth: 0, state: "thinking" });
    return engine.current!.analyze(
      game.analysisFen,
      {
        onProgress: (depth) =>
          setAnalysis((previous) =>
            previous?.key === key ? { ...previous, depth } : previous,
          ),
        onComplete(lines) {
          const next = candidatesFor(game.analysisFen, lines);
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
          setAnalysis({
            key,
            candidates: next,
            depth: lines[0].depth,
            state: "ready",
          });
        },
        onError: (error) =>
          setAnalysis({ key, candidates: [], depth: 0, state: "error", error }),
      },
      {
        rootFen: game.study.rootFen,
        moves: game.history
          .slice(0, game.historyPly ?? game.history.length)
          .map((move) => move.lan),
      },
      { multiPV: MAX_RECOMMENDED_MOVES },
    );
  }, [
    game.analysisKey,
    game.playable,
    game.analysisTerminal,
    requested,
    request?.attempt,
    paused,
  ]);

  function calculate() {
    if (!game.playable) return;
    setRequest((previous) => ({
      key: game.analysisKey,
      attempt: (previous?.attempt ?? 0) + 1,
    }));
    setAnalysis({
      key: game.analysisKey,
      candidates: [],
      depth: 0,
      state: "thinking",
    });
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
