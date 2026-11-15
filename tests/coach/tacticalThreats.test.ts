import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { tacticalThreats } from "../../src/features/coach/tacticalThreats";
import { english } from "../../src/i18n/translate";

test("quiet moves skip legal-move generation when there is no new piece threat", (t) => {
  const move = new Chess().move("e4");
  const moves = t.mock.method(Chess.prototype, "moves");

  assert.equal(tacticalThreats(move, english), undefined);
  assert.equal(moves.mock.callCount(), 0);
});

test("a fork checks only the attacking piece and reuses its legal moves for both targets", (t) => {
  const move = new Chess("7k/8/8/8/3n4/8/8/R3Q1K1 b - - 0 1").move("Nc2");
  const moves = t.mock.method(Chess.prototype, "moves");
  const threat = tacticalThreats(move, english)!;

  assert.equal(threat.text, "Their knight on c2 attacks your queen on e1 and your rook on a1.");
  assert.deepEqual(threat.focus.arrows, [
    { from: "c2", to: "e1" },
    { from: "c2", to: "a1" },
  ]);
  assert.equal(moves.mock.callCount(), 1);
  assert.deepEqual(moves.mock.calls[0].arguments, [{ square: "c2", verbose: true }]);
});

test("a discovered attack checks each involved attacker without generating unrelated moves", (t) => {
  const move = new Chess("1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ1P/P2P1PP1/3RR1K1 b - - 0 3").move("Nd5");
  const moves = t.mock.method(Chess.prototype, "moves");
  const threat = tacticalThreats(move, english)!;

  assert.match(threat.text, /knight on d5 attacks your bishop on e3/);
  assert.match(threat.text, /rook on f8 against your queen on f3/);
  assert.equal(moves.mock.callCount(), 2);
  assert.deepEqual(
    new Set(moves.mock.calls.map((call) => call.arguments[0])),
    new Set([{ square: "d5", verbose: true }, { square: "f8", verbose: true }]),
  );
});
