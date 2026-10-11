import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { START_FEN } from "../../src/chess/position";
import { MAX_RECOMMENDED_MOVES } from "../../src/features/coach/candidates";
import { type EngineLine } from "../../src/engine/uci";

class FakeWorker {
  commands: string[] = [];
  terminated = false;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: { preventDefault: () => void }) => void) | null = null;
  postMessage(command: string) {
    this.commands.push(command);
  }
  terminate() {
    this.terminated = true;
  }
  emit(data: string) {
    this.onmessage?.({ data });
  }
  ready() {
    this.emit("uciok\r\n");
    this.emit("readyok");
  }
  error() {
    this.onerror?.({ preventDefault() {} });
  }
  complete(depth = 12) {
    for (const [index, move] of ["e2e4", "d2d4", "g1f3"].entries())
      this.emit(
        `info depth ${depth} multipv ${index + 1} score cp 20 pv ${move} e7e5`,
      );
    this.emit("bestmove e2e4");
  }
}

function observer() {
  const result = {
    progress: [] as number[],
    completed: [] as EngineLine[][],
    errors: [] as string[],
  };
  return {
    result,
    onProgress: (depth: number) => result.progress.push(depth),
    onComplete: (lines: EngineLine[]) => result.completed.push(lines),
    onError: (message: string) => result.errors.push(message),
  };
}

test("the engine worker stays warm across completed searches", (t) => {
  const worker = new FakeWorker();
  let creations = 0;
  const engine = new AnalysisEngine(() => {
    creations++;
    return worker as unknown as Worker;
  });
  t.after(() => engine.dispose());
  const first = observer();
  engine.analyze(START_FEN, first);
  assert.deepEqual(worker.commands, ["uci"]);
  worker.ready();
  worker.complete();
  assert.equal(first.result.completed[0].length, 3);
  engine.analyze(START_FEN, observer());
  assert.equal(creations, 1);
  assert.equal(worker.terminated, false);
  assert.equal(
    worker.commands.filter((command) => command.startsWith("go ")).length,
    2,
  );
});

test("computer searches configure strength and return the engine's selected move", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  let selected: string | undefined;
  engine.analyze(
    START_FEN,
    {
      onProgress() {},
      onError(message) {
        assert.fail(message);
      },
      onComplete(_lines, move) {
        selected = move;
      },
    },
    undefined,
    { multiPV: 1, skill: 0, depth: 5, movetime: 350 },
  );
  worker.ready();
  worker.emit("info depth 5 multipv 1 score cp 20 pv e2e4");
  worker.emit("bestmove g1f3 ponder g8f6");
  assert.equal(selected, "g1f3");
  assert.ok(worker.commands.includes("setoption name Skill Level value 0"));
  assert.ok(worker.commands.includes("go depth 5 movetime 350"));
  engine.analyze(START_FEN, observer());
  assert.ok(worker.commands.includes("setoption name Skill Level value 20"));
  assert.equal(worker.commands.at(-1), "go depth 18 movetime 1800");
});

test("coaching can request five distinct moves and keeps only a complete depth", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const observed = observer();
  engine.analyze(START_FEN, observed, undefined, {
    multiPV: MAX_RECOMMENDED_MOVES,
  });
  worker.ready();
  assert.ok(worker.commands.includes("setoption name MultiPV value 5"));
  const moves = ["e2e4", "d2d4", "g1f3", "c2c4", "b1c3"];
  for (const [index, move] of moves.entries())
    worker.emit(`info depth 9 multipv ${index + 1} score cp 20 pv ${move}`);
  for (const [index, move] of moves.slice(0, 4).entries())
    worker.emit(`info depth 10 multipv ${index + 1} score cp 25 pv ${move}`);
  worker.emit("bestmove e2e4");
  assert.equal(observed.result.completed[0].length, 5);
  assert.deepEqual(
    observed.result.completed[0].map((line) => line.depth),
    [9, 9, 9, 9, 9],
  );
  assert.equal(observed.result.errors.length, 0);
});

test("paired move reviews restrict the root search and expect only those two lines", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const observed = observer();
  engine.analyze(START_FEN, observed, undefined, {
    searchMoves: ["e2e4", "e2e3"],
    depth: 20,
  });
  worker.ready();
  assert.equal(
    worker.commands.at(-1),
    "go depth 20 movetime 1800 searchmoves e2e4 e2e3",
  );
  worker.emit("info depth 20 multipv 1 score cp 30 pv e2e4 e7e5");
  worker.emit("info depth 20 multipv 2 score cp 25 pv e2e3 e7e5");
  worker.emit("bestmove e2e4");
  assert.equal(observed.result.completed[0].length, 2);
  engine.analyze(START_FEN, observer());
  assert.equal(worker.commands.at(-1), "go depth 18 movetime 1800");
});

test("rapid moves stop the old search and analyze only the latest queued position", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const first = observer(),
    skipped = observer(),
    latest = observer();
  const game = new Chess();
  engine.analyze(game.fen(), first);
  worker.ready();
  game.move("e4");
  const skippedFen = game.fen();
  engine.analyze(skippedFen, skipped);
  game.move("e5");
  const latestFen = game.fen();
  engine.analyze(latestFen, latest);
  assert.equal(
    worker.commands.filter((command) => command === "stop").length,
    1,
  );
  assert.equal(
    worker.commands.some((command) => command === `position fen ${skippedFen}`),
    false,
  );
  worker.complete(); // Old search finishes only after stop; its results must be ignored.
  assert.equal(worker.commands.at(-2), `position fen ${latestFen}`);
  assert.equal(first.result.completed.length, 0);
  assert.equal(first.result.progress.length, 0);
  assert.equal(skipped.result.completed.length, 0);
  worker.complete();
  assert.equal(latest.result.completed.length, 1);
});

test("cancellation during engine initialization does not start a discarded search", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const old = observer(),
    next = observer();
  const cancel = engine.analyze(START_FEN, old);
  cancel();
  worker.ready();
  assert.equal(
    worker.commands.some((command) => command.startsWith("go ")),
    false,
  );
  engine.analyze(START_FEN, next);
  worker.complete();
  assert.equal(old.result.completed.length, 0);
  assert.equal(next.result.completed.length, 1);
});

test("canceling a queued search keeps both stale searches out of the UI", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const old = observer(),
    queued = observer();
  engine.analyze(START_FEN, old);
  worker.ready();
  const cancel = engine.analyze(START_FEN, queued);
  cancel();
  worker.complete();
  assert.equal(old.result.completed.length + queued.result.completed.length, 0);
  assert.equal(
    worker.commands.filter((command) => command.startsWith("go ")).length,
    1,
  );
});

test("an incomplete deeper iteration cannot mix rankings from different depths", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const observed = observer();
  engine.analyze(START_FEN, observed);
  worker.ready();
  for (const [index, move] of ["e2e4", "d2d4", "g1f3"].entries())
    worker.emit(`info depth 9 multipv ${index + 1} score cp 20 pv ${move}`);
  worker.emit("info depth 10 multipv 1 score cp 30 pv g1f3");
  worker.emit("info depth 10 multipv 2 score cp 20 pv d2d4");
  worker.emit("bestmove g1f3");
  assert.deepEqual(
    observed.result.completed[0].map((line) => line.depth),
    [9, 9, 9],
  );
});

test("duplicate candidates are rejected instead of presented as a complete batch", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const observed = observer();
  engine.analyze(START_FEN, observed);
  worker.ready();
  for (let rank = 1; rank <= 3; rank++)
    worker.emit(`info depth 9 multipv ${rank} score cp 20 pv e2e4`);
  worker.emit("bestmove e2e4");
  assert.equal(observed.result.completed.length, 0);
  assert.equal(observed.result.errors.length, 1);
});

test("positions with one legal move finish with a single candidate", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const observed = observer();
  engine.analyze("7k/4K3/5B2/8/8/8/8/7R b - - 0 1", observed, undefined, {
    multiPV: MAX_RECOMMENDED_MOVES,
  });
  worker.ready();
  worker.emit("info depth 9 multipv 1 score mate -1 pv h8g8 h1h8");
  worker.emit("bestmove h8g8");
  assert.equal(observed.result.completed[0].length, 1);
});

test("the engine gets the played history so it can consider repetition", (t) => {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const game = new Chess();
  game.move("Nf3");
  game.move("Nf6");
  engine.analyze(game.fen(), observer(), {
    rootFen: START_FEN,
    moves: ["g1f3", "g8f6"],
  });
  worker.ready();
  assert.ok(
    worker.commands.includes(`position fen ${START_FEN} moves g1f3 g8f6`),
  );
});

test("worker initialization failures reach the error UI without an uncaught exception", () => {
  const engine = new AnalysisEngine(() => {
    throw new Error("Blocked Worker");
  });
  const observed = observer();
  assert.doesNotThrow(() => engine.analyze(START_FEN, observed));
  assert.equal(observed.result.errors.length, 1);
  engine.dispose();
});

test("retry creates a working engine and late events from the old worker are ignored", (t) => {
  const workers: FakeWorker[] = [];
  const engine = new AnalysisEngine(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker as unknown as Worker;
  });
  t.after(() => engine.dispose());
  const failed = observer(),
    retried = observer();
  engine.analyze(START_FEN, failed);
  workers[0].error();
  assert.equal(failed.result.errors.length, 1);
  assert.equal(workers[0].terminated, true);
  engine.analyze(START_FEN, retried);
  workers[0].error();
  workers[0].emit("bestmove e2e4");
  workers[1].ready();
  workers[1].complete();
  assert.equal(retried.result.errors.length, 0);
  assert.equal(retried.result.completed.length, 1);
});

test("a stalled boot times out and permits retry", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const engine = new AnalysisEngine(
    () => new FakeWorker() as unknown as Worker,
  );
  t.after(() => engine.dispose());
  const observed = observer();
  engine.analyze(START_FEN, observed);
  t.mock.timers.tick(15001);
  assert.match(observed.result.errors[0], /too long to load/);
});

test("a stalled canceled search reports the timeout to the latest waiting request", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const old = observer(),
    latest = observer();
  engine.analyze(START_FEN, old);
  worker.ready();
  engine.analyze(START_FEN, latest);
  t.mock.timers.tick(10001);
  assert.equal(old.result.errors.length, 0);
  assert.match(latest.result.errors[0], /too long to respond/);
});
