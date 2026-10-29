import { translateNotice, type Diagnostic } from "../../src/i18n/notices";
import { english } from "../../src/i18n/translate";
import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { startMoveReview } from "../../src/features/coach/moveReview";
import type { MoveReview } from "../../src/features/coach/grading";

class FakeWorker {
  commands: string[] = [];
  onmessage: ((event: { data: string }) => void) | null = null;
  postMessage(command: string) {
    this.commands.push(command);
  }
  terminate() {}
  emit(...lines: string[]) {
    this.onmessage?.({ data: lines.join("\n") });
  }
}

function fixture(t: TestContext, san = "e3", game = new Chess()) {
  const worker = new FakeWorker();
  const engine = new AnalysisEngine(() => worker as unknown as Worker);
  t.after(() => engine.dispose());
  const rootFen = game.fen();
  const move = game.move(san);
  const reviews: MoveReview[] = [];
  const errors: string[] = [];
  const cancel = startMoveReview(
    engine,
    { move, history: { rootFen, moves: [move.lan] }, terminal: null, drawn: false },
    {
      onComplete: (review) => reviews.push(review),
      onError: (error: Diagnostic) => errors.push(translateNotice(error, english)),
    },
  );
  worker.emit("uciok", "readyok");
  return { worker, reviews, errors, cancel };
}

function initialSearch(worker: FakeWorker) {
  worker.emit(
    "info depth 18 multipv 1 score cp 30 pv e2e4 e7e5",
    "bestmove e2e4",
  );
}

function reverseAwayFromPlayed(worker: FakeWorker) {
  worker.emit(
    "info depth 19 multipv 1 score cp 20 pv e2e3 e7e5",
    "info depth 19 multipv 2 score cp 10 pv e2e4 e7e5",
    "info depth 20 multipv 1 score cp 100 pv e2e4 c7c5",
    "bestmove e2e4",
  );
}

test("a late final choice of the played move replaces a stale blunder grade", (t) => {
  const { worker, reviews, errors } = fixture(t);
  initialSearch(worker);
  worker.emit(
    "info depth 19 multipv 1 score cp 100 pv e2e4 e7e5",
    "info depth 19 multipv 2 score cp -500 pv e2e3 e7e5",
    "info depth 20 multipv 1 score cp 150 pv e2e3 c7c5 g1f3",
    "bestmove e2e3",
  );
  assert.deepEqual(errors, []);
  assert.equal(reviews[0].label, "Best move");
  assert.equal(reviews[0].evaluation.whiteScore, 1.5);
  assert.equal(reviews[0].best.move.san, "e3");
  assert.equal(reviews[0].best.depth, 20);
  assert.equal(reviews[0].best.cp, 150);
  assert.equal(reviews[0].played?.cp, 150);
  assert.equal(reviews[0].reply?.move.san, "c5");
  assert.equal(worker.commands.filter((command) => command.startsWith("go ")).length, 2);
});

test("a late reversal away from the played move retries before assigning a matched-depth grade", (t) => {
  const { worker, reviews, errors } = fixture(t);
  initialSearch(worker);
  reverseAwayFromPlayed(worker);
  assert.equal(reviews.length, 0, "do not keep the older Best move label");
  assert.deepEqual(errors, []);
  assert.equal(worker.commands.filter((command) => command.startsWith("go ")).length, 3);
  assert.match(worker.commands.at(-1)!, /searchmoves e2e4 e2e3$/);
  worker.emit(
    "info depth 20 multipv 1 score cp 100 pv e2e4 c7c5",
    "info depth 20 multipv 2 score cp -500 pv e2e3 e7e5",
    "bestmove e2e4",
  );
  assert.equal(reviews[0].label, "Blunder");
  assert.equal(reviews[0].best.depth, reviews[0].played?.depth);
  assert.equal(reviews[0].best.cp, 100);
  assert.equal(reviews[0].played?.cp, -500);
  assert.equal(reviews[0].evaluation.whiteScore, -5);
  assert.deepEqual(errors, []);
});

test("reply previews follow the final reply when its newest exact line predates the completed search", (t) => {
  const { worker, reviews, errors } = fixture(t, "e4");
  initialSearch(worker);
  worker.emit(
    "info depth 17 multipv 1 score cp 10 pv c7c5 g1f3",
    "info depth 18 multipv 1 score cp 20 pv e7e5 g1f3",
    "info depth 19 multipv 1 score cp 30 lowerbound pv c7c5 g1f3",
    "bestmove c7c5",
  );
  assert.deepEqual(errors, []);
  assert.equal(reviews[0].label, "Best move");
  assert.equal(reviews[0].reply?.move.san, "c5");
  assert.equal(reviews[0].reply?.depth, 17);
  assert.equal(reviews[0].reply?.cp, 10);
});

test("an unfinished deeper score retries only to that depth before grading", (t) => {
  const { worker, reviews, errors } = fixture(t);
  initialSearch(worker);
  worker.emit(
    "info depth 14 multipv 1 score cp 100 pv e2e4 e7e5",
    "info depth 14 multipv 2 score cp -500 pv e2e3 e7e5",
    "info depth 15 multipv 1 score cp 150 pv e2e4 c7c5",
    "bestmove e2e4",
  );
  assert.equal(reviews.length, 0);
  assert.equal(worker.commands.at(-1), "go depth 15 movetime 1800 searchmoves e2e4 e2e3");
  worker.emit(
    "info depth 15 multipv 1 score cp 150 pv e2e4 c7c5",
    "info depth 15 multipv 2 score cp 140 pv e2e3 e7e5",
    "bestmove e2e4",
  );
  assert.equal(reviews[0].label, "Good move");
  assert.equal(reviews[0].best.depth, 15);
  assert.equal(reviews[0].played?.depth, 15);
  assert.equal(reviews[0].best.cp, 150);
  assert.equal(reviews[0].played?.cp, 140);
  assert.equal(reviews[0].evaluation.whiteScore, 1.4);
  assert.deepEqual(errors, []);
});

test("a comparison that is still inconsistent after one retry reports an error", (t) => {
  const { worker, reviews, errors } = fixture(t);
  initialSearch(worker);
  reverseAwayFromPlayed(worker);
  reverseAwayFromPlayed(worker);
  assert.equal(reviews.length, 0);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /reliably compare/);
  assert.equal(worker.commands.filter((command) => command.startsWith("go ")).length, 3);
});

test("canceling a comparison retry ignores its late results", (t) => {
  const { worker, reviews, errors, cancel } = fixture(t);
  initialSearch(worker);
  reverseAwayFromPlayed(worker);
  cancel();
  assert.equal(worker.commands.at(-1), "stop");
  worker.emit(
    "info depth 20 multipv 1 score cp 100 pv e2e4 e7e5",
    "info depth 20 multipv 2 score cp -500 pv e2e3 e7e5",
    "bestmove e2e4",
  );
  assert.equal(reviews.length, 0);
  assert.deepEqual(errors, []);
  assert.equal(worker.commands.filter((command) => command.startsWith("go ")).length, 3);
});

test("the initial search honors its final choice of the played move", (t) => {
  const { worker, reviews, errors } = fixture(t);
  worker.emit(
    "info depth 17 multipv 1 score cp 30 pv e2e3 e7e5",
    "info depth 18 multipv 1 score cp 40 pv e2e4 e7e5",
    "info depth 19 multipv 1 score cp 50 lowerbound pv e2e3 e7e5",
    "bestmove e2e3",
  );
  assert.equal(worker.commands.at(-1), "go depth 18 movetime 1000");
  worker.emit(
    "info depth 18 multipv 1 score cp -30 pv e7e5 g1f3",
    "bestmove e7e5",
  );
  assert.equal(reviews[0].label, "Best move");
  assert.equal(reviews[0].best.move.san, "e3");
  assert.equal(reviews[0].best.depth, 17);
  assert.deepEqual(errors, []);
});

test("the paired comparison targets the initial search's final alternative", (t) => {
  const { worker, reviews, errors } = fixture(t);
  worker.emit(
    "info depth 17 multipv 1 score cp 30 pv d2d4 d7d5",
    "info depth 18 multipv 1 score cp 40 pv e2e4 e7e5",
    "info depth 19 multipv 1 score cp 50 lowerbound pv d2d4 d7d5",
    "bestmove d2d4",
  );
  assert.match(worker.commands.at(-1)!, /searchmoves d2d4 e2e3$/);
  worker.emit(
    "info depth 20 multipv 1 score cp 50 pv d2d4 d7d5",
    "info depth 20 multipv 2 score cp 40 pv e2e3 e7e5",
    "bestmove d2d4",
  );
  assert.equal(reviews[0].label, "Good move");
  assert.equal(reviews[0].best.move.san, "d4");
  assert.deepEqual(errors, []);
});

test("a final move without a scored legal line reports an error instead of using another move", (t) => {
  const { worker, reviews, errors } = fixture(t);
  worker.emit(
    "info depth 18 multipv 1 score cp 30 pv e2e4 e7e5",
    "bestmove e2e3",
  );
  assert.equal(reviews.length, 0);
  assert.match(errors[0], /could not review/);
  assert.equal(worker.commands.filter((command) => command.startsWith("go ")).length, 1);
});
