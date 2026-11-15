import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { tacticalThreats } from "../../src/domain/coach/tacticalThreats.ts";
import { english } from "../../src/i18n/translate.ts";

test("quiet moves do not invent a new piece threat", () => {
  const move = new Chess().move("e4");
  assert.equal(tacticalThreats(move, english), undefined);
});

test("fork threats name and highlight both attacked pieces", () => {
  const move = new Chess("7k/8/8/8/3n4/8/8/R3Q1K1 b - - 0 1").move("Nc2");
  const threat = tacticalThreats(move, english)!;

  assert.equal(
    threat.text,
    "Their knight on c2 attacks your queen on e1 and your rook on a1.",
  );
  assert.deepEqual(threat.focus.arrows, [
    { from: "c2", to: "e1" },
    { from: "c2", to: "a1" },
  ]);
});

test("discovered attacks identify the moved piece and uncovered attacker", () => {
  const move = new Chess(
    "1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ1P/P2P1PP1/3RR1K1 b - - 0 3",
  ).move("Nd5");
  const threat = tacticalThreats(move, english)!;

  assert.match(threat.text, /knight on d5 attacks your bishop on e3/);
  assert.match(threat.text, /rook on f8 against your queen on f3/);
});
