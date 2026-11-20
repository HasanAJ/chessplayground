import test from "node:test";
import assert from "node:assert/strict";
import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import { localizeReview, reviewMove } from "../../src/domain/coach/grading.ts";
import type { EngineLine } from "../../src/domain/analysis/lines.ts";
import { catalogs, translator } from "../../src/i18n/translate.ts";

const blackFen = "rnb1kbnr/pp6/8/8/3P4/8/PPP1PP2/RNBQK3 b Qkq - 0 1";
const winningLine = ["h8h1", "e1d2", "h1d1", "d2d1"];
const bishopLine = ["f8e7", "d1d3"];

function review(
  fen = blackFen,
  best: Partial<EngineLine> = {},
  played: Partial<EngineLine> = {},
  drawn = false,
) {
  const [alternative, chosen] = candidatesFor(fen, [
    { rank: 1, depth: 20, cp: 563, pv: winningLine, ...best },
    { rank: 2, depth: 20, cp: -158, pv: bishopLine, ...played },
  ]);
  return reviewMove(chosen.move, alternative, undefined, drawn, chosen);
}

test("the bishop move misses the rook's winning tactic for either color", () => {
  for (const [result, whiteScore] of [
    [review(), 1.58],
    [
      review(
        "rnbqk3/ppp1pp2/8/3p4/8/8/PP6/RNB1KBNR w KQq - 0 1",
        { pv: ["h1h8", "e8d7", "h8d8", "d7d8"] },
        { pv: ["f1e2", "d8d6"] },
      ),
      -1.58,
    ],
  ] as const) {
    assert.equal(result.label, "Miss");
    assert.match(result.text, /missed a chance to win material/);
    assert.equal(result.lesson?.kind, "alternative");
    assert.equal(result.evaluation.whiteScore, whiteScore);
  }
});

test("a missed winning tactic requires a serious loss of chances", () => {
  for (const [cp, label] of [
    [200, "Inaccuracy"],
    [170, "Miss"],
  ] as const) {
    const result = review(undefined, { cp: 310 }, { cp });
    assert.equal(result.label, label);
  }
});

test("a later material loss in a long engine line does not hide the missed rook tactic", () => {
  // Stockfish's completed comparison continues well beyond the missed queen win.
  const result = review(
    undefined,
    {},
    {
      cp: -209,
      pv: [
        "f8e7",
        "d1d3",
        "h8h1",
        "e1d2",
        "b8c6",
        "d3g6",
        "e8f8",
        "c2c3",
        "c8h3",
        "d2c2",
        "a8c8",
        "c1h6",
        "g8h6",
        "g6h6",
        "f8g8",
        "e2e4",
        "c6e5",
        "d4e5",
      ],
    },
  );
  assert.equal(result.played?.materialLoss, 3);
  assert.equal(result.label, "Miss");
});

test("hanging material keeps the normal error grade despite an available winning tactic", () => {
  for (const [cp, label] of [
    [170, "Mistake"],
    [0, "Blunder"],
  ] as const) {
    const hanging = review(
      undefined,
      { cp: 310 },
      { cp, pv: ["f8a3", "b2a3"] },
    );
    assert.equal(hanging.label, label);
    assert.doesNotMatch(hanging.text, /missed a chance to win material/);
  }
});

test("allowing forced mate remains a blunder despite an available win", () => {
  const mated = review(undefined, {}, { cp: undefined, mate: -3 });
  assert.equal(mated.label, "Blunder");
  assert.match(mated.text, /opponent can force checkmate/);
});

test("losing a mating opportunity is a Miss, including when the move draws", () => {
  const fen = "7k/6pp/8/8/8/8/6PP/K2Q1R2 w - - 0 1";
  for (const drawn of [false, true]) {
    const result = review(
      fen,
      { mate: 1, cp: undefined, pv: ["f1f8"] },
      { cp: 0, pv: ["d1a4", "g7g6"] },
      drawn,
    );
    assert.equal(result.label, "Miss");
    assert.match(result.text, /misses a forced checkmate/);
    if (drawn) assert.match(result.text, /ends the game in a draw/);
  }
});

test("passing up mate in one is a Miss even when the mover stays overwhelmingly ahead", () => {
  for (const [fen, mate, move] of [
    ["rnbqkbnr/ppppppp1/8/8/8/8/PPPPPP2/RNBQK3 b Qkq - 0 1", "h8h1", "d7d5"],
    ["rnbqk3/pppppp2/8/8/8/8/PPPPPPP1/RNBQKBNR w KQq - 0 1", "h1h8", "d2d4"],
  ]) {
    const result = review(
      fen,
      { mate: 1, cp: undefined, pv: [mate] },
      { cp: 2952, pv: [move] },
    );
    assert.equal(result.label, "Miss");
    assert.match(result.text, /misses a forced checkmate/);
    assert.equal(result.lesson?.kind, "alternative");
  }
});

test("hanging a rook instead of mating is at least a Mistake, even while still winning", () => {
  for (const [fen, mate, pv] of [
    [
      "rnbqkbn1/ppp1ppp1/8/3p4/1P6/P6r/3PPP2/R1BQK3 b Qq - 0 1",
      "h3h1",
      ["h3f3", "e2f3"],
    ],
    [
      "r1bqk3/3ppp2/p6R/1p6/3P4/8/PPP1PPP1/RNBQKBN1 w Qq - 0 1",
      "h6h8",
      ["h6f6", "e7f6"],
    ],
  ] as const) {
    for (const [cp, label] of [
      [1475, "Mistake"],
      [0, "Blunder"],
    ] as const) {
      const result = review(
        fen,
        { mate: 1, cp: undefined, pv: [mate] },
        { cp, pv: [...pv] },
      );
      assert.equal(result.label, label);
      assert.match(result.text, /rook on f[36]/);
      assert.equal(result.lesson?.kind, "consequence");
    }
  }
});

test("a slower forced mate keeps its positive grade when mate in one was available", () => {
  const result = review(
    "7k/6pp/8/8/8/8/6PP/K2Q1R2 w - - 0 1",
    { mate: 1, cp: undefined, pv: ["f1f8"] },
    {
      mate: 3,
      cp: undefined,
      pv: ["d1d4", "h7h6", "f1f7", "h8h7", "d4g7"],
    },
  );
  assert.equal(result.label, "Excellent move");
  assert.equal(result.lesson, undefined);
});

test("retaining a winning advantage does not become a Miss", () => {
  const result = review(undefined, { cp: 900 }, { cp: 300 });
  assert.equal(result.label, "Blunder");
  assert.doesNotMatch(result.text, /misses/);
});

test("equal trades and an omitted recapture do not establish a missed material win", () => {
  const fen = "6k1/8/8/8/3b4/4q3/4Q3/6K1 w - - 0 1";
  for (const pv of [["e2e3"], ["e2e3", "d4e3"]]) {
    const result = review(fen, { pv }, { pv: ["g1h1"] });
    assert.equal(result.label, "Blunder");
  }
  // Winning the queen for a rook still counts when the PV ends before Kxd1.
  assert.equal(
    review(undefined, { pv: winningLine.slice(0, 3) }).label,
    "Miss",
  );
});

test("counter-recaptures preserve the missed material win at every exchange cutoff", () => {
  for (const [fen, exchange, played] of [
    [
      "6k1/q3b3/pp6/8/8/8/4Q3/4R1K1 w - - 0 1",
      ["e2e7", "a7e7", "e1e7"],
      ["g1h1", "a7b7"],
    ],
    [
      "4r1k1/4q3/8/8/8/PP6/Q3B3/6K1 b - - 0 1",
      ["e7e2", "a2e2", "e8e2"],
      ["g8h8", "a2b2"],
    ],
  ] as const) {
    for (let length = 1; length <= exchange.length; length++) {
      const result = review(
        fen,
        { cp: 556, pv: exchange.slice(0, length) },
        { cp: 0, pv: [...played] },
      );
      assert.equal(result.label, "Miss", `${fen}: exchange cutoff ${length}`);
      assert.match(result.text, /missed a chance to win material/);
    }
  }
});

test("an escaped knight threat cannot turn a later pawn loss into a grading error", () => {
  const fen = "rnb1kbnr/pp6/6n1/8/3P4/8/PPP1PP2/RNBQK3 b Qkq - 0 1";
  const best = {
    cp: 677,
    pv: ["h8h1", "e1d2", "f8h6", "e2e3", "h1d1", "d2d1"],
  };
  const beforeEscape = [
    "f8e7",
    "d1d3",
    "e8f7",
    "b1d2",
    "g8f6",
    "d2f1",
    "b8c6",
    "c1d2",
    "c8e6",
    "c2c3",
    "e7d6",
    "e1c1",
    "c6e7",
    "d2g5",
  ];
  for (const pv of [
    beforeEscape,
    [...beforeEscape, "f6g8", "d3b5", "g6f4", "b5b7"],
    ["f8e7", "d1d3", "g6h4"],
    ["f8e7", "d1d3", "g6h4", "d3b3", "c8e6", "b3b7"],
  ]) {
    const result = review(fen, best, { cp: 268, pv });
    assert.equal(result.played?.continuation.length, pv.length);
    assert.equal(result.label, "Miss");
    assert.equal(result.evaluation.whiteScore, -2.68);
  }
});

test("a forcing fork that wins a rook remains a blunder", () => {
  const result = review(
    "rnb1kbnr/pp6/6r1/3N4/3P4/8/PPP1PP2/RNBQK3 b Qkq - 0 1",
    {},
    { pv: ["f8e7", "d5c7", "e8f8", "c7a8"] },
  );
  assert.equal(result.label, "Blunder");
  assert.match(result.text, /knight on c7 attacks/);
});

test("an illegal continuation cannot supply evidence for a missed winning tactic", () => {
  const result = review(undefined, { pv: ["h8h1", "e1d2", "h1d1", "a1a8"] });
  assert.equal(result.best.continuation.length, 3);
  assert.equal(result.label, "Blunder");
});

test("cached Miss reviews translate without changing the grade, evaluation or winning line", () => {
  const original = review();
  for (const language of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const localized = localizeReview(original, translator(language));
    assert.equal(localized.label, "Miss");
    assert.deepEqual(localized.evaluation, original.evaluation);
    assert.deepEqual(localized.best.pv, winningLine);
    assert.notEqual(localized.text, original.text);
  }
});
