import type { AnalysisClient, AnalysisHistory } from "../ports/analysis.ts";
import { ObservableState } from "../shared/ObservableState.ts";
import { SearchScope } from "../shared/SearchScope.ts";
import {
  completeAnalysis,
  type CompletedAnalysis,
  type RecommendationAnalysis,
} from "./recommendationAnalysis.ts";
import {
  DEFAULT_SEARCH_SETTINGS,
  validSearchSetting,
  type SearchSettings,
} from "../../domain/coach/searchSettings.ts";

type Context = {
  key: string;
  fen: string;
  history: AnalysisHistory;
  enabled: boolean;
  paused: boolean;
};
type State = {
  settings: SearchSettings;
  requestKey: string | null;
  analysis: RecommendationAnalysis | null;
};

export class RecommendationController extends ObservableState<State> {
  private context: Context | null = null;
  private task: SearchScope | null = null;
  private cache = new Map<string, CompletedAnalysis>();
  constructor(private engine: AnalysisClient) {
    super({
      settings: DEFAULT_SEARCH_SETTINGS,
      requestKey: null,
      analysis: null,
    });
  }
  get settingsValid() {
    return (
      validSearchSetting("seconds", this.value.settings.seconds) &&
      validSearchSetting("moves", this.value.settings.moves)
    );
  }
  private cacheKey() {
    return JSON.stringify([this.context!.history, this.value.settings]);
  }
  private stop() {
    this.task?.dispose();
    this.task = null;
  }
  setContext(next: Context) {
    const previous = this.context;
    this.context = next;
    if (next.key !== previous?.key || !next.enabled) {
      this.clear();
      return;
    }
    if (next.paused !== previous?.paused) {
      this.stop();
      if (!next.paused && this.value.requestKey === next.key) this.start();
    }
  }
  clear = () => {
    this.stop();
    this.publish({ ...this.value, requestKey: null, analysis: null });
  };
  updateSettings = (settings: SearchSettings) => {
    this.stop();
    this.publish({
      settings: { ...settings },
      requestKey: null,
      analysis: null,
    });
  };
  calculate = (refresh = false) => {
    if (!this.context?.enabled || !this.settingsValid) return;
    this.stop();
    if (refresh) this.cache.delete(this.cacheKey());
    this.publish({ ...this.value, requestKey: this.context.key });
    this.start();
  };
  private start() {
    const context = this.context!;
    const cacheKey = this.cacheKey();
    const saved = this.cache.get(cacheKey);
    const analysis: RecommendationAnalysis = saved
      ? { ...saved, key: context.key }
      : { key: context.key, state: "thinking", candidates: [] };
    this.publish({ ...this.value, analysis });
    if (saved || context.paused) return;
    const task = new SearchScope(this.engine);
    this.task = task;
    task.run(
      context.fen,
      {
        onProgress() {},
        onError: (error) =>
          this.publish({
            ...this.value,
            analysis: {
              key: context.key,
              state: "error",
              candidates: [],
              error,
            },
          }),
        onComplete: (lines, move, final) => {
          const ready = completeAnalysis(
            context.key,
            context.fen,
            lines,
            move,
            final,
          );
          if (ready.state === "ready") {
            this.cache.delete(cacheKey);
            this.cache.set(cacheKey, ready);
            if (this.cache.size > 64)
              this.cache.delete(this.cache.keys().next().value!);
          }
          this.publish({ ...this.value, analysis: ready });
        },
      },
      context.history,
      {
        depth: null,
        movetime: this.value.settings.seconds * 1000,
        multiPV: this.value.settings.moves,
      },
    );
  }
  dispose = () => this.stop();
}
