import type {
  AnalysisCallbacks,
  AnalysisClient,
  AnalysisHistory,
  SearchOptions,
} from "../ports/analysis.ts";

/** A workflow may issue sequential searches. Disposal suppresses even late callbacks. */
export class SearchScope {
  private version = 0;
  private stopped = false;
  private cancelCurrent?: () => void;
  constructor(private client: AnalysisClient) {}
  run(
    fen: string,
    callbacks: AnalysisCallbacks,
    history?: AnalysisHistory,
    options?: SearchOptions,
  ) {
    if (this.stopped) return;
    const version = ++this.version;
    const current = () => !this.stopped && version === this.version;
    const cancel = this.client.analyze(
      fen,
      {
        onProgress: (depth) => {
          if (current()) callbacks.onProgress(depth);
        },
        onError: (error) => {
          if (current()) callbacks.onError(error);
        },
        onComplete: (...result) => {
          if (current()) callbacks.onComplete(...result);
        },
      },
      history,
      options,
    );
    // A synchronous client can finish and start the next search before returning.
    if (current()) this.cancelCurrent = cancel;
    else cancel();
  }
  dispose = () => {
    this.stopped = true;
    this.version++;
    this.cancelCurrent?.();
    this.cancelCurrent = undefined;
  };
}
