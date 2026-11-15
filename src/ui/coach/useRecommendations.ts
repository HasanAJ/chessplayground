import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { useAnalysisEngine } from "../shared/useAnalysisEngine.ts";
import { RecommendationController } from "../../application/analysis/RecommendationController.ts";
import { localizeCandidates } from "../../application/analysis/recommendationAnalysis.ts";
import type { GameController } from "../game/useGameController.ts";

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
  const [controller] = useState(
    () =>
      new RecommendationController({
        analyze: (...args) => engine.current!.analyze(...args),
      }),
  );
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
  );
  const context = useMemo(
    () => ({
      key: game.analysisKey,
      fen: game.analysisFen,
      enabled: game.playable && !game.analysisTerminal,
      paused,
      history: {
        rootFen: game.study.rootFen,
        moves: game.history
          .slice(0, game.historyPly ?? game.history.length)
          .map((move) => move.lan),
      },
    }),
    [
      game.analysisKey,
      game.analysisFen,
      game.playable,
      game.analysisTerminal,
      game.study.rootFen,
      game.history,
      game.historyPly,
      paused,
    ],
  );
  useEffect(() => {
    controller.setContext(context);
  }, [controller, context]);
  useEffect(() => () => controller.dispose(), [controller]);
  const requested = state.requestKey === game.analysisKey;
  const current =
    requested && state.analysis?.key === game.analysisKey && game.playable;
  const candidates = useMemo(
    () =>
      current && state.analysis?.state === "ready"
        ? localizeCandidates(state.analysis, t, state.settings.moves)
        : [],
    [current, state.analysis, state.settings.moves, t],
  );
  return {
    settings: state.settings,
    settingsValid: controller.settingsValid,
    updateSettings: controller.updateSettings,
    candidates,
    best: candidates.at(0),
    requested,
    current,
    thinking:
      game.playable &&
      requested &&
      !game.analysisTerminal &&
      (!current || state.analysis?.state === "thinking"),
    analysis: state.analysis,
    calculate: controller.calculate,
    clear: controller.clear,
  };
}
export type Recommendations = ReturnType<typeof useRecommendations>;
