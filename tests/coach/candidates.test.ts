import test from "node:test";
import assert from "node:assert/strict";
import { Chess, type Square } from "chess.js";
import { START_FEN } from "../../src/chess/position";
import { candidatesFor } from "../../src/features/coach/candidates";

const DEMO_FEN =
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";

test("continuation frames can be visited in either direction without changing the game", () => {
  const game = new Chess(START_FEN);
  game.move("e4");
  const root = game.fen();
  const candidate = candidatesFor(root, [
    { rank: 1, depth: 12, cp: 0, pv: ["e7e5", "g1f3", "b8c6"] },
  ])[0];
  const [first, second, third] = candidate.continuation;
  assert.equal(first.color, "b");
  assert.equal(first.before, root);
  assert.equal(second.before, first.after);
  assert.equal(third.before, second.after);
  assert.equal(new Chess(third.after).get("c6")?.type, "n");
  assert.equal(new Chess(second.after).get("c6"), undefined);
  assert.equal(new Chess(first.after).get("f3"), undefined);
  assert.equal(game.fen(), root);
  assert.deepEqual(game.history(), ["e4"]);
});

test("continuation frames include castling, en passant and promotion board changes", () => {
  for (const { fen, uci, occupied, empty } of [
    {
      fen: DEMO_FEN,
      uci: "e1g1",
      occupied: { g1: "k", f1: "r" },
      empty: ["e1", "h1"],
    },
    {
      fen: "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
      uci: "e5d6",
      occupied: { d6: "p" },
      empty: ["e5", "d5"],
    },
    {
      fen: "7k/P7/8/8/8/8/8/4K3 w - - 0 1",
      uci: "a7a8n",
      occupied: { a8: "n" },
      empty: ["a7"],
    },
  ]) {
    const candidate = candidatesFor(fen, [
      { rank: 1, depth: 12, cp: 0, pv: [uci] },
    ])[0];
    const after = new Chess(candidate.continuation[0].after);
    for (const [square, type] of Object.entries(occupied)) {
      assert.equal(after.get(square as Square)?.type, type);
    }
    for (const square of empty)
      assert.equal(after.get(square as Square), undefined);
    assert.equal(candidate.continuation[0].before, new Chess(fen).fen());
  }
});

test("continuation previews stop before an illegal later move", () => {
  const candidate = candidatesFor(START_FEN, [
    { rank: 1, depth: 12, cp: 0, pv: ["e2e4", "e7e5", "g1g5"] },
  ])[0];
  assert.deepEqual(
    candidate.continuation.map((move) => move.san),
    ["e4", "e5"],
  );
  assert.doesNotThrow(() => new Chess(candidate.continuation.at(-1)!.after));
});

test("scores consistently use White’s perspective for both centipawns and mate", () => {
  const blackFen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
  const candidate = candidatesFor(blackFen, [
    { rank: 1, depth: 12, cp: 40, pv: ["e7e5"] },
  ])[0];
  assert.equal(candidate.whiteScore, -0.4);
  assert.equal(candidate.score, "−0.40");
  const mate = candidatesFor(blackFen, [
    { rank: 1, depth: 12, mate: 3, pv: ["e7e5"] },
  ])[0];
  assert.equal(mate.score, "−M3");
});

test("invalid engine PVs are excluded and truncated continuations remain legal", () => {
  assert.equal(
    candidatesFor(START_FEN, [{ rank: 1, depth: 12, cp: 0, pv: ["e2e5"] }])
      .length,
    0,
  );
  const candidate = candidatesFor(START_FEN, [
    { rank: 1, depth: 12, cp: 0, pv: ["e2e4", "e7e4"] },
  ]);
  assert.equal(candidate.length, 0);
});
