import { Chess } from "chess.js";
import { notice, type Diagnostic } from "../../i18n/notices.ts";
import type {
  AnalysisCallbacks,
  AnalysisClient,
  AnalysisHistory,
  SearchOptions,
} from "../../application/ports/analysis.ts";
import { MultiPvResults } from "./MultiPvResults.ts";
import { parseInfo, positionCommand, searchCommand } from "./protocol.ts";

type Search = {
  callbacks: AnalysisCallbacks;
  options: SearchOptions;
  position: string;
  results: MultiPvResults;
  cancelled: boolean;
  progress: number;
};
type Phase = "offline" | "handshake" | "ready" | "searching" | "draining";

/** One worker, one active search, one replaceable pending request. */
export class AnalysisEngine implements AnalysisClient {
  private worker: Worker | null = null;
  private phase: Phase = "offline";
  private active: Search | null = null;
  private pending: Search | null = null;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(
    private createWorker = () =>
      new Worker("/engine/stockfish-19-lite-single.js"),
  ) {}

  analyze(
    fen: string,
    callbacks: AnalysisCallbacks,
    history?: AnalysisHistory,
    options: SearchOptions = {},
  ) {
    const legalCount =
      options.searchMoves?.length ?? new Chess(fen).moves().length;
    const search: Search = {
      callbacks,
      options,
      position: positionCommand(fen, history),
      results: new MultiPvResults(Math.min(options.multiPV ?? 3, legalCount)),
      cancelled: false,
      progress: 0,
    };
    if (this.pending) this.pending.cancelled = true;
    this.pending = search;
    if (this.active) this.cancel(this.active);
    if (!this.worker) this.boot();
    this.pump();
    return () => this.cancel(search);
  }

  dispose() {
    this.clearTimer();
    if (this.active) this.active.cancelled = true;
    if (this.pending) this.pending.cancelled = true;
    const worker = this.worker;
    this.worker = null;
    this.phase = "offline";
    this.active = this.pending = null;
    if (worker) {
      worker.onmessage = worker.onerror = worker.onmessageerror = null;
      worker.terminate();
    }
  }

  private clearTimer() {
    clearTimeout(this.timer);
    this.timer = undefined;
  }
  private deadline(ms: number, diagnostic: Diagnostic) {
    this.clearTimer();
    this.timer = setTimeout(() => this.fail(diagnostic), ms);
  }
  private fail(diagnostic: Diagnostic) {
    const request = this.pending ?? this.active;
    const callback =
      request && !request.cancelled ? request.callbacks.onError : undefined;
    this.dispose();
    callback?.(diagnostic);
  }
  private send(command: string) {
    try {
      this.worker?.postMessage(command);
    } catch {
      this.fail(notice("engine.error.load"));
    }
  }
  private cancel(search: Search) {
    if (search.cancelled) return;
    search.cancelled = true;
    if (this.pending === search) this.pending = null;
    if (this.active !== search || this.phase === "draining") return;
    this.phase = "draining";
    // Cancellation must not wait out a potentially minute-long search budget.
    this.deadline(2000, notice("engine.error.responseTimeout"));
    this.send("stop");
  }
  private boot() {
    this.phase = "handshake";
    try {
      const worker = this.createWorker();
      this.worker = worker;
      const failed = () => {
        if (this.worker === worker) this.fail(notice("engine.error.load"));
      };
      worker.onerror = (event) => {
        event.preventDefault();
        failed();
      };
      worker.onmessageerror = failed;
      worker.onmessage = (event) => {
        if (this.worker !== worker || typeof event.data !== "string") return;
        for (const line of event.data.split(/\r?\n/)) {
          if (this.worker !== worker) break;
          this.receive(line.trim());
        }
      };
      this.deadline(15000, notice("engine.error.loadTimeout"));
      this.send("uci");
    } catch {
      this.fail(notice("engine.error.start"));
    }
  }
  private pump() {
    if (this.phase !== "ready" || !this.pending) return;
    const next = this.pending;
    this.pending = null;
    this.active = next;
    this.phase = "searching";
    this.deadline(
      Math.max(10000, (next.options.movetime ?? 1800) + 2000),
      notice("engine.error.responseTimeout"),
    );
    for (const command of [
      `setoption name MultiPV value ${next.options.multiPV ?? 3}`,
      `setoption name Skill Level value ${next.options.skill ?? 20}`,
      next.position,
      searchCommand(next.options),
    ]) {
      if (this.active !== next) break;
      this.send(command);
    }
  }
  private receive(line: string) {
    if (this.phase === "handshake") {
      if (line === "uciok") {
        this.send("setoption name Hash value 16");
        this.send("isready");
      } else if (line === "readyok") {
        this.clearTimer();
        this.phase = "ready";
        this.pump();
      }
      return;
    }
    const request = this.active;
    if (!request) return;
    if (/^bestmove\s/.test(line)) {
      this.clearTimer();
      this.active = null;
      this.phase = "ready";
      // Finish bookkeeping before calling application code, which may enqueue a search.
      try {
        if (!request.cancelled) {
          const bestMove = line.split(/\s+/)[1];
          if (request.results.lines.length)
            request.callbacks.onComplete(
              request.results.lines,
              bestMove,
              request.results.bestLine(bestMove),
            );
          else
            request.callbacks.onError(
              notice("engine.error.incompleteAnalysis"),
            );
        }
      } finally {
        this.pump();
      }
      return;
    }
    if (request.cancelled) return;
    const info = parseInfo(line);
    if (
      info &&
      request.results.add(info) &&
      info.depth >= request.progress + 3
    ) {
      request.progress = info.depth;
      request.callbacks.onProgress(info.depth);
    }
  }
}
