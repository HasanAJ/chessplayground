import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BestMoveContent } from "../../src/ui/coach/BestMoveContent.tsx";
import { recommendedCandidates } from "../../src/domain/coach/candidates.ts";
import { translator } from "../../src/i18n/translate.ts";
import { reviewMove } from "../../src/domain/coach/grading.ts";

const SCREENSHOT_FEN = "8/8/n5p1/P7/6P1/4BK1k/8/8 b - - 0 1";
const pawnPush = {
  rank: 1,
  depth: 16,
  cp: -700,
  pv: ["g6g5", "e3g5", "a6b8", "g5d2", "h3h4", "f3f4"],
};
const knightMove = {
  rank: 2,
  depth: 16,
  cp: -718,
  pv: ["a6b4", "g4g5"],
};

test("the screenshot position explains Bxg5 without overriding Stockfish's ranking", () => {
  const evaluated = candidatesFor(SCREENSHOT_FEN, [
    pawnPush,
    knightMove,
    { rank: 3, depth: 16, cp: -718, pv: ["h3h4", "f3f4"] },
  ]);
  assert.equal(
    evaluated[0].explanation,
    "Your pawn on g5 blocks their pawn on g4 from advancing. Their bishop can take your pawn on g5.",
  );
  assert.deepEqual(evaluated[0].explanationFocus?.arrows, [
    { from: "g6", to: "g5" },
    { from: "e3", to: "g5" },
  ]);
  const recommended = recommendedCandidates(evaluated);
  assert.deepEqual(
    recommended.map((candidate) => candidate.move.san),
    ["g5", "Nb4", "Kh4"],
  );
  assert.equal(recommended[0].score, "+7.00");
  assert.equal(
    evaluated[0].move.san,
    "g5",
    "preserve the engine ranking for grading and cached results",
  );
});

test("capture replies preserve the engine ranking from White's perspective", () => {
  const evaluated = candidatesFor("8/8/4bk1K/6p1/p7/N5P1/8/8 w - - 0 1", [
    { rank: 1, depth: 16, cp: -700, pv: ["g3g4", "e6g4"] },
    { rank: 2, depth: 16, cp: -718, pv: ["a3b5", "g5g4"] },
  ]);
  assert.equal(recommendedCandidates(evaluated)[0].move.san, "g4");
  assert.match(
    evaluated[0].explanation,
    /Their bishop can take your pawn on g4/,
  );
  assert.equal(evaluated[0].whiteScore, -7);
});

test("missing replies do not invent a capture", () => {
  const candidate = candidatesFor(SCREENSHOT_FEN, [
    { ...pawnPush, pv: ["g6g5"] },
  ])[0];
  assert.doesNotMatch(candidate.explanation, /bishop can take/);
});

test("equal queen trades describe the capture and recapture in plain language", () => {
  for (const [fen, pv, square] of [
    ["8/k5q1/8/8/8/8/6Q1/7K b - - 0 1", ["g7g2", "h1g2"], "g2"],
    ["7k/6q1/8/8/8/8/6Q1/7K w - - 0 1", ["g2g7", "h8g7"], "g7"],
  ] as const) {
    const candidate = candidatesFor(fen, [
      { rank: 1, depth: 18, cp: 0, pv: [...pv] },
    ])[0];
    const expected = `Your queen takes their queen on ${square} and gives check. Their king can take your queen in return.`;
    assert.equal(candidate.explanation, expected);
    const reply = candidatesFor(candidate.move.after, [
      { rank: 1, depth: 17, cp: 0, pv: [pv[1]] },
    ])[0];
    const review = reviewMove(candidate.move, candidate, reply);
    assert.equal(review.label, "Best move");
    assert.equal(review.text, expected);
  }
});

test("losing exchanges describe the capture and recapture without a generic warning", () => {
  const candidate = candidatesFor("7k/p5r1/8/8/8/8/6Q1/7K w - - 0 1", [
    { rank: 1, depth: 18, cp: -400, pv: ["g2g7", "h8g7"] },
  ])[0];
  assert.equal(
    candidate.explanation,
    "Your queen takes their rook on g7 and gives check. Their king can take your queen in return.",
  );
});

test("an invalid continuation tail is rejected while its legal capture reply remains", () => {
  const candidate = candidatesFor(SCREENSHOT_FEN, [
    { ...pawnPush, pv: ["g6g5", "e3g5", "a6a8"] },
  ])[0];
  assert.deepEqual(
    candidate.continuation.map((move) => move.lan),
    ["g6g5", "e3g5"],
  );
  assert.match(candidate.explanation, /Their bishop can take your pawn/);
});

test("a mating sacrifice describes the forced mate instead of the recapture", () => {
  const evaluated = candidatesFor("5r1k/6pp/7N/3Q4/8/8/8/K7 w - - 0 1", [
    { rank: 1, depth: 16, mate: 2, pv: ["d5g8", "f8g8", "h6f7"] },
    { rank: 2, depth: 16, mate: 4, pv: ["d5e4", "g7g6"] },
  ]);
  assert.equal(evaluated[0].continuation.at(-1)?.san, "Nf7#");
  assert.equal(recommendedCandidates(evaluated)[0], evaluated[0]);
  assert.match(
    evaluated[0].explanation,
    /Giving up your queen on g8 keeps a forced checkmate in 2 moves/,
  );
  assert.doesNotMatch(evaluated[0].explanation, /Their rook can take/);
});

test("en passant and promotion replies identify the piece and captured square", () => {
  const enPassant = candidatesFor("4k3/8/8/8/3p4/8/4P3/4K3 w - - 0 1", [
    { rank: 1, depth: 16, cp: -100, pv: ["e2e4", "d4e3"] },
  ])[0];
  assert.match(enPassant.explanation, /can take your pawn on e4/);
  assert.ok(enPassant.explanationFocus?.squares.includes("e4"));
  const promotion = candidatesFor("1r5k/P7/8/8/8/8/8/4K3 w - - 0 1", [
    { rank: 1, depth: 16, cp: -500, pv: ["a7a8q", "b8a8"] },
  ])[0];
  assert.match(
    promotion.explanation,
    /promotes to a queen on a8.*Their rook can take your queen on a8/,
  );
  const compensated = candidatesFor("7r/P5k1/8/8/8/8/8/4K2R w - - 0 1", [
    { rank: 1, depth: 16, cp: 300, pv: ["a7a8q", "h8h1"] },
  ])[0];
  assert.match(compensated.explanation, /promotes to a queen/);
  assert.match(compensated.explanation, /take your rook on h1/);
});

test("the best-move card shows the capture before Play without opening the preview", () => {
  const candidate = candidatesFor(SCREENSHOT_FEN, [pawnPush])[0];
  const html = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: false,
      preview: null,
      onInspect() {},
      onClearInspection() {},
      onPlay() {},
    }),
  );
  const text = html.replace(/<[^>]*>/g, "");
  assert.match(text, /Their bishop can take your pawn on g5.*Play/s);
  for (const language of ["de", "es", "it", "fr"] as const) {
    const localized = candidatesFor(
      SCREENSHOT_FEN,
      [pawnPush],
      translator(language),
    )[0];
    assert.notEqual(localized.explanation, candidate.explanation);
    assert.match(localized.explanation, /g5/);
    assert.doesNotMatch(localized.explanation, /\{\d+\}|Their bishop/);
  }
});
