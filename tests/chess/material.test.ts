import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import {
  materialBalance,
  pieceValues,
} from "../../src/domain/chess/material.ts";
import { positionOf } from "../../src/domain/chess/position.ts";

test("the initial position has no missing pieces or material advantage", () => {
  assert.deepEqual(materialBalance(positionOf(new Chess())), {
    missing: { w: [], b: [] },
    difference: 0,
  });
});

test("the mockup position shows the missing pieces and White's two-point lead", () => {
  const game = new Chess(
    "1kr2r2/ppp1q1bp/3ppn2/8/B1P1PQ2/1P2B3/P2P1PPP/3RR1K1 b - - 0 3",
  );
  assert.deepEqual(materialBalance(positionOf(game)), {
    missing: {
      b: [
        { type: "b", count: 1 },
        { type: "n", count: 1 },
        { type: "p", count: 2 },
      ],
      w: [{ type: "n", count: 2 }],
    },
    difference: 2,
  });
});

test("captures, equal exchanges and en passant use the pieces actually on the board", () => {
  const game = new Chess();
  const currentBalance = () =>
    materialBalance(positionOf(game), game.history({ verbose: true }));
  for (const move of ["e4", "d5", "exd5"]) game.move(move);
  assert.equal(currentBalance().difference, 1);
  assert.deepEqual(currentBalance().missing.b, [{ type: "p", count: 1 }]);
  game.move("Qxd5");
  const exchanged = currentBalance();
  assert.equal(exchanged.difference, 0);
  assert.deepEqual(exchanged.missing.w, exchanged.missing.b);

  const enPassant = new Chess("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1");
  enPassant.move("exd6");
  const balance = materialBalance(
    positionOf(enPassant),
    enPassant.history({ verbose: true }),
  );
  assert.equal(balance.difference, 1);
  assert.deepEqual(balance.missing.b.at(-1), { type: "p", count: 8 });
});

test("promotions change the score without inventing a pawn capture, and promoted pieces can be captured", () => {
  for (const color of ["w", "b"] as const) {
    for (const promotion of ["q", "r", "b", "n"] as const) {
      const game = new Chess(
        color === "w"
          ? "1r5k/P7/8/8/8/8/8/3QK3 w - - 0 1"
          : "3qk3/8/8/8/8/8/p7/1R5K b - - 0 1",
      );
      const rank = color === "w" ? "8" : "1";
      const balance = () =>
        materialBalance(positionOf(game), game.history({ verbose: true }));
      const before = balance();
      game.move({
        from: color === "w" ? "a7" : "a2",
        to: `a${rank}`,
        promotion,
      });
      const promoted = balance();
      assert.deepEqual(promoted.missing, before.missing);
      assert.equal(
        promoted.difference - before.difference,
        (color === "w" ? 1 : -1) * (pieceValues[promotion] - 1),
      );
      game.move({ from: `b${rank}`, to: `a${rank}` });
      const captured = balance();
      assert.deepEqual(
        captured.missing[color].find(({ type }) => type === "p"),
        before.missing[color].find(({ type }) => type === "p"),
      );
      assert.equal(
        captured.missing[color].find(({ type }) => type === promotion)?.count,
        (before.missing[color].find(({ type }) => type === promotion)?.count ??
          0) + 1,
      );
      assert.equal(
        captured.difference - promoted.difference,
        (color === "w" ? -1 : 1) * pieceValues[promotion],
      );
    }
  }
});

test("an extra queen in an imported position does not hide a recorded queen capture", () => {
  const game = new Chess("Qr5k/8/8/8/8/8/8/3QK3 b - - 0 1");
  game.move("Rxa8");
  const balance = materialBalance(
    positionOf(game),
    game.history({ verbose: true }),
  );
  assert.deepEqual(
    balance.missing.w.find(({ type }) => type === "q"),
    { type: "q", count: 1 },
  );
  assert.equal(balance.difference, 4);
});

test("draft positions calculate Black's lead and never list missing kings", () => {
  const balance = materialBalance({ a8: { color: "b", type: "r" } });
  assert.equal(balance.difference, -5);
  assert.equal(balance.missing.b.find(({ type }) => type === "r")?.count, 1);
  assert.equal(
    balance.missing.w.reduce((sum, { count }) => sum + count, 0),
    15,
  );
});
