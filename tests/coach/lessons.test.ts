import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidates";
import { reviewMove } from "../../src/features/coach/grading";

function review(fen: string, bestMove: string, playedLine: string[]) {
  const best = candidatesFor(fen, [
    { rank: 1, depth: 20, cp: 300, pv: [bestMove] },
  ])[0];
  const played = candidatesFor(fen, [
    { rank: 2, depth: 20, cp: -300, pv: playedLine },
  ])[0];
  assert.ok(played, "the fixture must be a legal line");
  assert.equal(played.continuation.length, playedLine.length);
  return reviewMove(played.move, best, undefined, false, played);
}

test("feedback names the unprotected piece and the actual capture for either side", () => {
  for (const [fen, best, line, square] of [
    ["4k3/8/8/8/8/2b5/1R6/6K1 w - - 0 1", "b2b3", ["g1h1", "c3b2"], "b2"],
    ["6k1/1r6/2B5/8/8/8/8/4K3 b - - 0 1", "b7b6", ["g8h8", "c6b7"], "b7"],
  ] as const) {
    const result = review(fen, best, [...line]);
    assert.match(result.text, new RegExp(`rook on ${square} has no defender`));
    assert.match(result.text, /bishop can take it/);
    assert.equal(result.lesson!.ply, 1);
    assert.ok(result.lesson!.focus!.squares.includes(square));
  }
});

test("feedback does not call a defended capture a free piece or guaranteed loss", () => {
  const result = review("4k3/8/8/8/8/2b5/1R6/1R4K1 w - - 0 1", "b2b3", [
    "g1h1",
    "c3b2",
  ]);
  assert.match(result.text, /may be able to capture back/);
  assert.doesNotMatch(result.text, /no defender|wins|loses|free/);
});

test("a fork lesson highlights both attacked pieces in the position after the reply", () => {
  const result = review("4k3/8/8/8/3n4/8/7P/R3K3 w - - 0 1", "e1f1", [
    "h2h3",
    "d4c2",
  ]);
  assert.match(result.text, /can move to c2 and attack .* at once/);
  assert.match(result.text, /rook on a1/);
  assert.match(result.text, /king on e1/);
  assert.equal(result.lesson!.ply, 2);
  assert.equal(
    new Chess(result.lesson!.candidate.continuation[1].after).get("c2")?.type,
    "n",
  );
  assert.deepEqual(result.lesson!.focus!.arrows, [
    { from: "c2", to: "a1" },
    { from: "c2", to: "e1" },
  ]);
});

test("later captures explain the checking sequence without asserting the exchange is finished", () => {
  const result = review(
    "r3q1k1/p1R5/2p5/2P2Q2/4P3/8/Pb6/2K5 w - - 0 11",
    "c1d2",
    ["c1b2", "e8b8", "b2c1", "b8c7"],
  );
  assert.match(result.text, /queen takes your rook on c7/);
  assert.match(result.text, /Further trades may follow/);
  assert.equal(result.lesson!.ply, 3);
  assert.equal(
    new Chess(result.lesson!.candidate.continuation[2].after).get("c7")?.type,
    "r",
  );
});

test("en passant feedback marks the removed pawn and the diagonal capture path", () => {
  const result = review("4k3/8/8/8/3p4/8/4P2P/4K3 w - - 0 1", "h2h3", [
    "e2e4",
    "d4e3",
  ]);
  assert.match(result.text, /pawn on e4/);
  assert.ok(result.lesson!.focus!.squares.includes("e4"));
  assert.deepEqual(result.lesson!.focus!.arrows, [{ from: "d4", to: "e3" }]);
});

test("a short line without a tactical cause keeps the lesson honest", () => {
  const result = review(new Chess().fen(), "e2e4", ["a2a3"]);
  assert.doesNotMatch(result.text, /no defender|fork|takes your/);
  assert.equal(result.lesson!.kind, "alternative");
  assert.equal(result.lesson!.candidate.move.san, "e4");
});
