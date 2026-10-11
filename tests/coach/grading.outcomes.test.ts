import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidates";
import { reviewMove } from "../../src/features/coach/grading";

function candidate(fen: string, pv: string[], cp = 0, mate?: number) {
  return candidatesFor(fen, [{ rank: 1, depth: 15, cp, mate, pv }])[0];
}

test("move quality uses the mover's perspective for White and Black", () => {
  const white = new Chess();
  const bestWhite = candidate(white.fen(), ["e2e4"], 30);
  const moveWhite = white.move("f3");
  const replyWhite = candidate(white.fen(), ["e7e5"], 200);
  const reviewWhite = reviewMove(moveWhite, bestWhite, replyWhite);
  assert.equal(reviewWhite.label, "Mistake");
  assert.equal(reviewWhite.loss, 2.3);
  const black = new Chess();
  black.move("e4");
  const bestBlack = candidate(black.fen(), ["e7e5"], -20);
  const moveBlack = black.move("f6");
  const replyBlack = candidate(black.fen(), ["d2d4"], 150);
  const reviewBlack = reviewMove(moveBlack, bestBlack, replyBlack);
  assert.equal(reviewBlack.label, "Inaccuracy");
  assert.equal(reviewBlack.loss, 1.3);
});

test("terminal move grades do not require a reply candidate", () => {
  const game = new Chess("7k/6pp/8/8/8/8/6PP/4KR2 w - - 0 1");
  const best = candidate(game.fen(), ["f1f8"], 0, 1);
  const move = game.move("Rf8#");
  assert.equal(reviewMove(move, best).label, "Best move");
  const repeat = new Chess();
  const alternative = candidate(repeat.fen(), ["e2e4"], 120);
  const repeatedMove = repeat.move("Nf3");
  assert.equal(
    reviewMove(repeatedMove, alternative, undefined, true).label,
    "Inaccuracy",
  );
});

test("an alternative checkmate explains the played move instead of the engine's choice", () => {
  const game = new Chess("7k/6pp/8/8/8/8/6PP/K2Q1R2 w - - 0 1");
  const best = candidate(game.fen(), ["d1d8"], 0, 1);
  const move = game.move("Rf8#");
  const review = reviewMove(move, best);
  assert.equal(review.label, "Best move");
  assert.equal(review.loss, null);
  assert.match(review.text, /Rf8# delivers checkmate/);
  assert.doesNotMatch(review.text, /queen|d8|first choice/);
});
