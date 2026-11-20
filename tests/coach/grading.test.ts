import test from "node:test";
import assert from "node:assert/strict";
import { Chess, type Color } from "chess.js";
import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import { reviewMove } from "../../src/domain/coach/grading.ts";

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

test("both colors use the published 2, 5, 10 and 20 point loss boundaries", () => {
  for (const side of ["w", "b"] as const)
    for (const [score, label] of [
      [0, "Excellent move"],
      [-0.21, "Excellent move"],
      [-0.22, "Good move"],
      [-0.54, "Good move"],
      [-0.55, "Inaccuracy"],
      [-1.1, "Inaccuracy"],
      [-1.11, "Mistake"],
      [-2.3, "Mistake"],
      [-2.31, "Blunder"],
    ] as const)
      assert.equal(
        reviewScores(0, score, side).label,
        label,
        `${side}: ${score}`,
      );
});

test("excellent moves keep positive explanations without a corrective lesson", () => {
  const review = reviewScores(0, -0.2);
  assert.equal(review.label, "Excellent move");
  assert.equal(review.text, "This is almost as strong as the best move.");
  assert.equal(review.lesson, undefined);
});

test("large raw drops in overwhelmingly winning or losing positions are not blunders", () => {
  for (const side of ["w", "b"] as const)
    for (const [best, played] of [
      [12, 9],
      [-9, -12],
    ])
      assert.equal(reviewScores(best, played, side).label, "Good move");
  assert.equal(reviewScores(6, -2).label, "Blunder");
});

test("keeping a huge advantage instead of a calculated mate is not an automatic blunder", () => {
  const review = reviewScores(0, 12, "w", 4);
  assert.equal(review.label, "Excellent move");
  assert.match(review.text, /strong advantage/);
});

test("shorter mate distances keep the same grade in an already lost position", () => {
  const losing = reviewScores(0, 0, "b", -8, -2);
  assert.equal(losing.label, "Excellent move");
});

test("a comparison favoring the played move keeps an excellent grade", () => {
  const review = reviewScores(0.2, 0.6);
  assert.equal(review.label, "Excellent move");
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
