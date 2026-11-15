import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { materialBalance } from "../../src/chess/material";
import { positionOf } from "../../src/chess/position";

test("the initial position has no missing pieces or material advantage", () => {
  assert.deepEqual(materialBalance(positionOf(new Chess())), {
    missing: { w: [], b: [] },
    difference: 0,
  });
});

test("the mockup position shows the missing pieces and White's two-point lead", () => {
  const game = new Chess("1kr2r2/ppp1q1bp/3ppn2/8/B1P1PQ2/1P2B3/P2P1PPP/3RR1K1 b - - 0 3");
  assert.deepEqual(materialBalance(positionOf(game)), {
    missing: {
      b: [{ type: "b", count: 1 }, { type: "n", count: 1 }, { type: "p", count: 2 }],
      w: [{ type: "n", count: 2 }],
    },
    difference: 2,
  });
});

test("captures, equal exchanges and en passant use the pieces actually on the board", () => {
  const game = new Chess();
  for (const move of ["e4", "d5", "exd5"]) game.move(move);
  assert.equal(materialBalance(positionOf(game)).difference, 1);
  assert.deepEqual(materialBalance(positionOf(game)).missing.b, [{ type: "p", count: 1 }]);
  game.move("Qxd5");
  const exchanged = materialBalance(positionOf(game));
  assert.equal(exchanged.difference, 0);
  assert.deepEqual(exchanged.missing.w, exchanged.missing.b);

  const enPassant = new Chess("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1");
  enPassant.move("exd6");
  const balance = materialBalance(positionOf(enPassant));
  assert.equal(balance.difference, 1);
  assert.deepEqual(balance.missing.b.at(-1), { type: "p", count: 8 });
});

test("promoted pieces count toward the score without negative missing counts", () => {
  const game = new Chess("7k/P7/8/8/8/8/8/3QK3 w - - 0 1");
  const before = materialBalance(positionOf(game));
  game.move("a8=Q+");
  const after = materialBalance(positionOf(game));
  assert.equal(after.difference - before.difference, 8);
  assert.equal(after.missing.w.some(({ type }) => type === "q"), false);
  assert.ok(after.missing.w.every(({ count }) => count > 0));
});

test("draft positions calculate Black's lead and never list missing kings", () => {
  const balance = materialBalance({ a8: { color: "b", type: "r" } });
  assert.equal(balance.difference, -5);
  assert.equal(balance.missing.b.find(({ type }) => type === "r")?.count, 1);
  assert.equal(balance.missing.w.reduce((sum, { count }) => sum + count, 0), 15);
});
