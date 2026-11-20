import test from "node:test";
import assert from "node:assert/strict";
import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import { betterMoveReason } from "../../src/domain/coach/lessons.ts";
import {
  english,
  languages,
  translator,
  type Language,
} from "../../src/i18n/translate.ts";

const fen = "2k4r/2r2p2/4p3/3nP3/1p1P2p1/1K4B1/1PPR3P/2R5 b - - 0 1";
const kingRoutes = [
  ["c8b7", "c1g1", "b7b6", "g3e1", "b6b5"],
  ["c8d7", "c1g1", "d7c6", "g3e1", "c6b5"],
];
function candidate(position: string, pv: string[]) {
  const [result] = candidatesFor(position, [
    { rank: 1, depth: 23, cp: -50, pv },
  ]);
  assert.ok(result, "the fixture must be a legal continuation");
  assert.equal(result.continuation.length, pv.length);
  return result;
}

test("both king moves explain the goal and defensive job without listing the route", () => {
  for (const pv of kingRoutes) {
    const result = candidate(fen, pv);
    assert.equal(result.title, "Plan to defend your pawn");
    assert.match(
      result.explanation,
      /head toward b5 to help defend your pawn on b4/,
    );
    assert.match(
      result.explanation,
      /knight on d5 is currently its only defender/,
    );
    assert.doesNotMatch(result.explanation, /→/);
    assert.deepEqual(result.explanationFocus?.arrows, [
      { from: "c8", to: pv[0].slice(2) },
    ]);
    assert.ok(result.explanationFocus?.squares.includes("b4"));
    assert.equal(
      betterMoveReason(result, undefined, english),
      result.explanation,
    );
  }
});

test("king plans work for White and translate their goal and defender", () => {
  const whiteFen = "2r5/1ppr3p/1k4b1/1P1p2P1/3Np3/4P3/2R2P2/2K4R w - - 0 1";
  const pv = ["c1d2", "c8g8", "d2c3", "g6e8", "c3b4"];
  for (const language of Object.keys(languages) as Language[]) {
    const translate = translator(language);
    const [result] = candidatesFor(
      whiteFen,
      [{ rank: 1, depth: 23, cp: -50, pv }],
      translate,
    );
    assert.equal(
      result.title,
      translate(
        "coach.explanation.plan.defend.title",
        translate("chess.piece.pawn"),
      ),
    );
    assert.match(result.explanation, /b4/);
    assert.match(result.explanation, /b5/);
    assert.match(result.explanation, /d4/);
    assert.doesNotMatch(result.explanation, /\{\d+\}|→/);
  }
});

test("short lines and unrelated king moves do not invent a defensive plan", () => {
  assert.equal(candidate(fen, kingRoutes[1].slice(0, 2)).explanation, "");
  const noThreat = "2k4r/2r2p2/4p3/3nP3/1p1P2p1/6B1/1PPR3P/K1R5 b - - 0 1";
  assert.equal(candidate(noThreat, kingRoutes[1]).explanation, "");
  const withQueen = fen.replace("2k4r", "q1k4r");
  assert.match(candidate(withQueen, kingRoutes[1]).explanation, /pawn on b4/);
});

test("a plan stops when another piece moves, a pawn is captured, or the king is checked", () => {
  const interrupted = ["c8d7", "c1g1", "h8c8", "g3e1", "d7c6", "g1g3", "c6b5"];
  assert.equal(candidate(fen, interrupted).explanation, "");
  const undefended = fen.replace("3nP3", "4P3");
  const captured = candidate(undefended, [
    "c8d7",
    "b3b4",
    "d7c6",
    "b4a3",
    "c6b5",
  ]);
  assert.doesNotMatch(
    captured.explanation,
    /head toward|follow-up|adds support|→/,
  );
  assert.match(captured.explanation, /Their king can take your pawn on b4/);
  assert.equal(
    candidate("7k/8/7r/1b6/P7/8/8/4K3 w - - 0 1", [
      "e1d2",
      "h6d6",
      "d2c3",
      "d6h6",
      "c3b4",
    ]).explanation,
    "",
  );
});

test("immediate tactics and mating evaluations keep priority over a king plan", () => {
  const check = candidate(
    "2k4r/5p2/4p3/3nP3/1p1P2p1/1K4B1/1P1R3P/2R5 b - - 0 1",
    ["c8b7"],
  );
  assert.equal(check.title, english("coach.explanation.escapeCheck.title"));
  const [mating] = candidatesFor(fen, [
    { rank: 1, depth: 23, mate: -4, pv: kingRoutes[1] },
  ]);
  assert.equal(mating.title, english("coach.explanation.mateDefense.title"));
  assert.doesNotMatch(mating.explanation, /head toward|adds support|→/);
});

test("the same continuation logic explains knight, bishop, rook, queen, and pawn maneuvers", () => {
  const fixtures = [
    {
      fen: "7k/8/8/5r2/8/8/3N4/K7 w - - 0 1",
      pv: ["d2f1", "h8g8", "f1g3"],
      piece: "knight",
      target: "rook on f5",
    },
    {
      fen: "7k/r7/8/8/8/8/8/2B4K w - - 0 1",
      pv: ["c1d2", "h8g8", "d2e3"],
      piece: "bishop",
      target: "rook on a7",
    },
    {
      fen: "7k/8/6q1/8/8/8/8/R6K w - - 0 1",
      pv: ["a1a2", "h8h7", "a2g2"],
      piece: "rook",
      target: "queen on g6",
    },
    {
      fen: "7k/7r/8/8/8/8/8/K2Q4 w - - 0 1",
      pv: ["d1e2", "h8g8", "e2h5"],
      piece: "queen",
      target: "rook on h7",
    },
    {
      fen: "7k/8/1r6/8/8/8/P7/K7 w - - 0 1",
      pv: ["a2a4", "h8g8", "a4a5"],
      piece: "pawn",
      target: "rook on b6",
    },
  ];
  for (const fixture of fixtures) {
    const result = candidate(fixture.fen, fixture.pv);
    assert.equal(result.title, "Maneuver toward an attack", fixture.piece);
    assert.ok(
      result.explanation.includes(
        `Your ${fixture.piece} can head toward ${result.continuation.at(-1)!.to}`,
      ),
    );
    assert.ok(result.explanation.includes(`attack their ${fixture.target}`));
    assert.doesNotMatch(result.explanation, /→/);
  }
});

test("maneuvers can add defense to a rook, not just a pawn", () => {
  const result = candidate("6k1/8/8/r6R/8/8/3N4/1K6 w - - 0 1", [
    "d2f1",
    "g8f8",
    "f1g3",
  ]);
  assert.equal(result.title, "Plan to defend your rook");
  assert.match(result.explanation, /knight can head toward g3/);
  assert.match(result.explanation, /defend your rook on h5/);
  assert.doesNotMatch(result.explanation, /only defender/);
});

test("quiet preparations explain later captures, checks, and promotions without promising them", () => {
  const capture = candidate("7k/r7/8/8/8/8/8/R6K w - - 0 1", [
    "a1a2",
    "h8g8",
    "a2a7",
  ]);
  assert.equal(capture.title, "Prepare a capture");
  assert.doesNotMatch(capture.explanation, /→|possible continuation/);
  assert.match(capture.explanation, /rook takes their rook on a7/);
  const check = candidate("7k/8/8/8/8/8/8/R6K w - - 0 1", [
    "a1a2",
    "h8g8",
    "a2g2",
  ]);
  assert.equal(check.title, "Prepare a check");
  assert.match(check.explanation, /rook gives check/);
  assert.doesNotMatch(check.explanation, /→|possible continuation/);
  const promotion = candidate("8/7k/P7/8/8/8/8/K7 w - - 0 1", [
    "a6a7",
    "h7h6",
    "a7a8q",
  ]);
  assert.equal(promotion.title, "Prepare a promotion");
  assert.match(promotion.explanation, /pawn promotes to a queen/);
  assert.doesNotMatch(promotion.explanation, /→|possible continuation/);
});

test("a suggested move does not inherit a later attack by a different piece", () => {
  const result = candidate("7k/8/8/5r2/8/8/3N3P/K7 w - - 0 1", [
    "h2h3",
    "h8g8",
    "d2f1",
    "g8h8",
    "f1g3",
  ]);
  assert.equal(result.explanation, "");
});

test("pinned pieces do not receive unsupported attack or defense plans", () => {
  for (const [fen, pv] of [
    ["7k/6n1/8/8/8/8/8/r3R2K w - - 0 1", ["e1f1", "h8h7", "f1g1"]],
    ["8/4n2k/6N1/8/8/8/8/r3R2K w - - 0 1", ["e1f1", "h7h6", "f1g1"]],
  ] as const) {
    const result = candidate(fen, [...pv]);
    assert.equal(result.title, "Put your rook on an open file");
    assert.equal(
      result.explanation,
      english("coach.explanation.openFile.text", "f"),
    );
  }
});
