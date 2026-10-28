import test from "node:test";
import assert from "node:assert/strict";
import type { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import type { EngineLine } from "../../src/engine/uci";
import type { MoveReview } from "../../src/features/coach/grading";
import { startMoveReview } from "../../src/features/coach/moveReview";
import { START_FEN } from "../../src/chess/position";
import {
  createStudy,
  addStudyMove,
  nodePath,
  replayStudy,
  ROOT,
  type Study,
} from "../../src/chess/study";

function studyAfter(...moves: string[]) {
  return moves.reduce(
    (study, uci) => addStudyMove(study, study.tipId, uci),
    createStudy(START_FEN),
  );
}

function reviewPosition(study: Study, id = study.tipId) {
  const { history, outcomes } = replayStudy(study, id);
  return {
    move: history.at(-1)!,
    history: { rootFen: study.rootFen, moves: history.map((move) => move.lan) },
    ...outcomes.at(-1)!,
  };
}

class ReviewEngine {
  requests: {
    args: Parameters<AnalysisEngine["analyze"]>;
    canceled: boolean;
  }[] = [];
  analyze(...args: Parameters<AnalysisEngine["analyze"]>) {
    const request = { args, canceled: false };
    this.requests.push(request);
    return () => {
      request.canceled = true;
    };
  }
  complete(index: number, lines: EngineLine[]) {
    this.requests[index].args[1].onComplete(lines);
  }
}

function observe() {
  const reviews: MoveReview[] = [],
    errors: string[] = [];
  return {
    reviews,
    errors,
    onComplete: (review: MoveReview) => reviews.push(review),
    onError: (error: string) => errors.push(error),
  };
}

test("non-best moves are compared at the same root and depth, including selected history", () => {
  const engine = new ReviewEngine(),
    observed = observe();
  const study = studyAfter("e2e4", "e7e5", "g1f3", "b8c6");
  const node = nodePath(study)[2];
  startMoveReview(engine, reviewPosition(study, node.id), observed);
  engine.complete(0, [{ rank: 1, depth: 18, cp: 40, pv: ["d2d4", "e5d4"] }]);
  const initial = engine.requests[0].args,
    comparison = engine.requests[1].args;
  assert.equal(comparison[0], initial[0]);
  assert.deepEqual(comparison[2], initial[2]);
  assert.deepEqual(comparison[2]?.moves, ["e2e4", "e7e5"]);
  assert.deepEqual(comparison[3]?.searchMoves, ["d2d4", "g1f3"]);
  assert.equal(comparison[3]?.multiPV, 2);
  engine.complete(1, [
    { rank: 1, depth: 20, cp: 45, pv: ["d2d4", "e5d4"] },
    { rank: 2, depth: 20, cp: 40, pv: ["g1f3", "b8c6", "f1b5"] },
  ]);
  assert.equal(observed.reviews[0].label, "Good move");
  assert.equal(observed.reviews[0].reply?.move.san, "Nc6");
  assert.equal(observed.reviews[0].reply?.whiteScore, 0.4);
  assert.equal(engine.requests.length, 2);
});

test("best moves retain a legal reply preview without a comparison search", () => {
  const engine = new ReviewEngine(),
    observed = observe();
  const study = studyAfter("e2e4");
  startMoveReview(engine, reviewPosition(study), observed);
  engine.complete(0, [{ rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5"] }]);
  assert.equal(engine.requests[1].args[3]?.multiPV, 1);
  assert.equal(engine.requests[1].args[3]?.searchMoves, undefined);
  engine.complete(1, [{ rank: 1, depth: 18, cp: -30, pv: ["e7e5", "g1f3"] }]);
  assert.equal(observed.reviews[0].label, "Best move");
  assert.equal(observed.reviews[0].reply?.move.san, "e5");
});

test("mate distance and perspective stay correct in a reply derived from the played line", () => {
  for (const [mate, replyMate] of [
    [4, -3],
    [-4, 4],
  ]) {
    const engine = new ReviewEngine(),
      observed = observe();
    const study = studyAfter("e2e3");
    startMoveReview(engine, reviewPosition(study), observed);
    engine.complete(0, [{ rank: 1, depth: 18, mate, pv: ["e2e4", "e7e5"] }]);
    engine.complete(1, [
      { rank: 1, depth: 20, mate, pv: ["e2e4", "e7e5"] },
      { rank: 2, depth: 20, mate, pv: ["e2e3", "e7e5", "g1f3"] },
    ]);
    assert.equal(observed.reviews[0].reply?.mate, replyMate);
    assert.equal(observed.reviews[0].reply?.whiteScore, mate > 0 ? 100 : -100);
    assert.deepEqual(observed.reviews[0].evaluation, {
      whiteScore: mate > 0 ? 100 : -100,
      mate: replyMate,
    });
  }
});

test("cancellation stops a paired comparison and ignores its late result", () => {
  const engine = new ReviewEngine(),
    observed = observe();
  const study = studyAfter("e2e3");
  const cancel = startMoveReview(engine, reviewPosition(study), observed);
  engine.complete(0, [{ rank: 1, depth: 18, cp: 30, pv: ["e2e4"] }]);
  cancel();
  assert.equal(engine.requests[1].canceled, true);
  engine.complete(1, [
    { rank: 1, depth: 20, cp: 30, pv: ["e2e4", "e7e5"] },
    { rank: 2, depth: 20, cp: -500, pv: ["e2e3", "e7e5"] },
  ]);
  assert.deepEqual(observed.reviews, []);
  assert.deepEqual(observed.errors, []);
});

test("incomplete comparisons report an error instead of assigning a harsh grade", () => {
  const engine = new ReviewEngine(),
    observed = observe();
  const study = studyAfter("e2e3");
  startMoveReview(engine, reviewPosition(study), observed);
  engine.complete(0, [{ rank: 1, depth: 18, cp: 30, pv: ["e2e4"] }]);
  engine.complete(1, [{ rank: 1, depth: 20, cp: 30, pv: ["e2e4"] }]);
  assert.equal(observed.reviews.length, 0);
  assert.match(observed.errors[0], /reliably compare/);
});

test("a mating move finishes its review without searching a terminal position", () => {
  const engine = new ReviewEngine(),
    observed = observe();
  const study = addStudyMove(
    createStudy("7k/6pp/8/8/8/8/6PP/4KR2 w - - 0 1"),
    ROOT,
    "f1f8",
  );
  startMoveReview(engine, reviewPosition(study), observed);
  engine.complete(0, [{ rank: 1, depth: 18, mate: 1, pv: ["f1f8"] }]);
  assert.equal(observed.reviews[0].label, "Best move");
  assert.equal(observed.reviews[0].reply, undefined);
  assert.equal(engine.requests.length, 1);
});

test("a repetition draw is reviewed from its snapshot without searching a reply", () => {
  const engine = new ReviewEngine(), observed = observe();
  const position = reviewPosition(studyAfter(
    "g1f3", "g8f6", "f3g1", "f6g8", "g1f3", "g8f6", "f3g1", "f6g8",
  ));
  startMoveReview(engine, position, observed);
  engine.complete(0, [{ rank: 1, depth: 18, cp: 0, pv: ["f6g8"] }]);
  assert.equal(observed.reviews[0].drawn, true);
  assert.equal(observed.reviews[0].reply, undefined);
  assert.equal(engine.requests.length, 1);
});
