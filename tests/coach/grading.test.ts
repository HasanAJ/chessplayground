import test from "node:test";
import assert from "node:assert/strict";
import { Chess, type Color } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidatePresentation";
import { reviewMove } from "../../src/features/coach/grading";

function reviewScores(
  bestScore: number,
  playedScore: number,
  side: Color = "w",
  bestMate?: number,
  playedMate?: number,
) {
  const game = new Chess();
  if (side === "b") game.move("e4");
  const fen = game.fen();
  const best = candidatesFor(fen, [
    {
      rank: 1,
      depth: 20,
      cp: bestScore * 100,
      mate: bestMate,
      pv: [side === "w" ? "e2e4" : "e7e5"],
    },
  ])[0];
  const move = game.move(side === "w" ? "a3" : "a6");
  const played = candidatesFor(fen, [
    {
      rank: 2,
      depth: 20,
      cp: playedScore * 100,
      mate: playedMate,
      pv: [move.lan],
    },
  ])[0];
  return reviewMove(move, best, undefined, false, played);
}

test("small differences are tolerated while decisive losses remain blunders", () => {
  for (const [score, label] of [
    [-0.2, "Good move"],
    [-0.7, "Inaccuracy"],
    [-1.7, "Mistake"],
    [-5, "Blunder"],
  ] as const)
    assert.equal(reviewScores(0, score).label, label);
});

test("large raw drops in overwhelmingly winning or losing positions are not blunders", () => {
  for (const [best, played] of [
    [12, 9],
    [-9, -12],
  ]) {
    const review = reviewScores(best, played);
    assert.equal(review.label, "Good move");
  }
  assert.equal(reviewScores(6, -2).label, "Blunder");
});

test("the same evaluation change gets the same grade for either color", () => {
  for (const [best, played] of [
    [0.3, -2],
    [12, 9],
    [-9, -12],
    [0, -5],
  ]) {
    const white = reviewScores(best, played);
    const black = reviewScores(best, played, "b");
    assert.equal(white.label, black.label);
    assert.equal(white.evaluation.whiteScore, -black.evaluation.whiteScore);
  }
});

test("keeping a huge advantage instead of a calculated mate is not an automatic blunder", () => {
  const review = reviewScores(0, 12, "w", 4);
  assert.equal(review.label, "Good move");
  assert.match(review.text, /strong advantage/);
});

test("different mating distances preserve the grade for the same outcome", () => {
  const winning = reviewScores(0, 0, "w", 2, 5);
  assert.equal(winning.label, "Good move");
  const losing = reviewScores(0, 0, "b", -8, -2);
  assert.equal(losing.label, "Good move");
});

test("allowing a new forced mate remains a blunder", () => {
  const review = reviewScores(0, 0, "w", undefined, -3);
  assert.equal(review.label, "Blunder");
  assert.match(review.text, /can force checkmate/);
});

test("a comparison favoring the played move keeps a good grade", () => {
  const review = reviewScores(0.2, 0.6);
  assert.equal(review.label, "Good move");
  assert.equal(review.evaluation.whiteScore, 0.6);
});

test("the bishop capture trap still receives a serious grade", () => {
  const game = new Chess("r3q1k1/p1R5/2p5/2P2Q2/4P3/8/Pb6/2K5 w - - 0 11");
  const fen = game.fen();
  const best = candidatesFor(fen, [
    { rank: 1, depth: 20, cp: -112, pv: ["c1d2"] },
  ])[0];
  const move = game.move("Kxb2");
  const played = candidatesFor(fen, [
    { rank: 2, depth: 20, cp: -563, pv: ["c1b2", "e8b8", "b2c1", "b8c7"] },
  ])[0];
  assert.equal(
    reviewMove(move, best, undefined, false, played).label,
    "Blunder",
  );
});
