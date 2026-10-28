import { Chess } from "chess.js";
import { parseInfo } from "./uci";
import { MultiPvResults } from "./MultiPvResults";
import type {
  AnalysisCallbacks,
  AnalysisClient,
  AnalysisHistory,
  SearchOptions,
} from "./analysis";

type Search = AnalysisCallbacks & {
  options: SearchOptions;
  positionCommand: string;
  cancelled: boolean;
  results: MultiPvResults;
  reportedDepth: number;
};

/** Keep one engine warm; wait for bestmove after stop before starting another search. */
export class AnalysisEngine implements AnalysisClient {
  private worker: Worker | null = null;
  private phase: "booting" | "idle" | "searching" = "idle";
  private active: Search | null = null;
  private queued: Search | null = null;
  private timeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly createWorker = () =>
      new Worker("/engine/stockfish-19-lite-single.js"),
  ) {}

  analyze(
    fen: string,
    callbacks: AnalysisCallbacks,
    history?: AnalysisHistory,
    options: SearchOptions = {},
  ): () => void {
    const search: Search = {
      ...callbacks,
      options,
      positionCommand: history
        ? `position fen ${history.rootFen}${history.moves.length ? ` moves ${history.moves.join(" ")}` : ""}`
        : `position fen ${fen}`,
      results: new MultiPvResults(
        Math.min(
          options.multiPV ?? 3,
          options.searchMoves?.length ?? new Chess(fen).moves().length,
        ),
      ),
      cancelled: false,
      reportedDepth: 0,
    };
    if (this.queued) this.queued.cancelled = true;
    this.queued = search;
    if (this.active && !this.active.cancelled) {
      this.active.cancelled = true;
      this.worker?.postMessage("stop");
    }
    if (!this.worker) this.boot();
    this.startNext();
    return () => {
      if (search.cancelled) return;
      search.cancelled = true;
      if (this.queued === search) this.queued = null;
      if (this.active === search) this.worker?.postMessage("stop");
    };
  }

  dispose() {
    clearTimeout(this.timeout);
    if (this.active) this.active.cancelled = true;
    if (this.queued) this.queued.cancelled = true;
    this.active = this.queued = null;
    this.worker?.terminate();
    this.worker = null;
    this.phase = "idle";
  }

  private fail(message: string) {
    const latest = this.queued ?? this.active;
    const notify = latest && !latest.cancelled ? latest.onError : null;
    this.dispose();
    notify?.(message);
  }

  private boot() {
    this.phase = "booting";
    try {
      const worker = this.createWorker();
      this.worker = worker;
      worker.onerror = (event) => {
        if (this.worker !== worker) return;
        event.preventDefault();
        this.fail(
          "The chess engine could not load. Check your connection and retry analysis.",
        );
      };
      worker.onmessage = (event) => {
        if (this.worker !== worker || typeof event.data !== "string") return;
        for (const raw of event.data.split("\n")) this.receive(raw.trim());
      };
      this.timeout = setTimeout(
        () =>
          this.fail(
            "The engine took too long to load. Try analyzing the position again.",
          ),
        15000,
      );
      worker.postMessage("uci");
    } catch {
      this.fail(
        "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.",
      );
    }
  }

  private startNext() {
    if (!this.worker || this.phase !== "idle" || !this.queued) return;
    const search = this.queued;
    this.queued = null;
    if (search.cancelled) return;
    this.active = search;
    this.phase = "searching";
    this.timeout = setTimeout(
      () =>
        this.fail(
          "The engine took too long to respond. Try analyzing the position again.",
        ),
      Math.max(10000, (search.options.movetime ?? 1800) + 2000),
    );
    this.worker.postMessage(
      `setoption name MultiPV value ${search.options.multiPV ?? 3}`,
    );
    this.worker.postMessage(
      `setoption name Skill Level value ${search.options.skill ?? 20}`,
    );
    this.worker.postMessage(search.positionCommand);
    this.worker.postMessage(
      `go${search.options.depth === null ? "" : ` depth ${search.options.depth ?? 18}`} movetime ${search.options.movetime ?? 1800}${search.options.searchMoves ? ` searchmoves ${search.options.searchMoves.join(" ")}` : ""}`,
    );
  }

  private receive(line: string) {
    if (line === "uciok" && this.phase === "booting") {
      this.worker?.postMessage("setoption name MultiPV value 3");
      this.worker?.postMessage("setoption name Hash value 16");
      this.worker?.postMessage("isready");
      return;
    }
    if (line === "readyok" && this.phase === "booting") {
      clearTimeout(this.timeout);
      this.phase = "idle";
      this.startNext();
      return;
    }
    const search = this.active;
    if (this.phase !== "searching" || !search) return;
    if (line.startsWith("bestmove")) {
      clearTimeout(this.timeout);
      this.active = null;
      this.phase = "idle";
      if (!search.cancelled) {
        if (search.results.lines.length) {
          const bestMove = line.split(/\s+/)[1];
          search.onComplete(
            search.results.lines,
            bestMove,
            search.results.bestLine(bestMove),
          );
        } else
          search.onError(
            "No complete analysis was returned. Try this position again.",
          );
      }
      this.startNext();
      return;
    }
    if (search.cancelled) return;
    const info = parseInfo(line);
    if (!info || !search.results.add(info)) return;
    // Progress is inexpensive; generate explanations only for the finished search.
    if (info.depth >= search.reportedDepth + 3) {
      search.reportedDepth = info.depth;
      search.onProgress(info.depth);
    }
  }
}
