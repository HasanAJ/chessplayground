import test from "node:test";
import assert from "node:assert/strict";
import { candidatesFor } from "../../src/features/coach/candidates";

const DEMO_FEN =
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";

test("English explanation identifies defense of an attacked central pawn", () => {
  const candidate = candidatesFor(DEMO_FEN, [
    { rank: 1, depth: 15, cp: 25, pv: ["d2d3", "f8c5", "b1c3"] },
  ])[0];
  assert.equal(candidate.move.san, "d3");
  assert.equal(candidate.title, "Support your center");
  assert.match(candidate.explanation, /defends the pawn on e4/);
  assert.match(candidate.reply, /bishop to c5/);
  assert.deepEqual(
    candidate.continuation.map((move) => move.san),
    ["d3", "Bc5", "Nc3"],
  );
  assert.equal(candidate.score, "+0.25");
});

test("joint attacks and castling explanations are grounded in the board", () => {
  const attack = candidatesFor(DEMO_FEN, [
    { rank: 1, depth: 12, cp: 0, pv: ["f3g5"] },
  ])[0];
  assert.equal(attack.title, "Build pressure on f7");
  const castle = candidatesFor(DEMO_FEN, [
    { rank: 1, depth: 12, cp: 0, pv: ["e1g1"] },
  ])[0];
  assert.match(castle.title, /Castle/);
  assert.equal(castle.move.san, "O-O");
});

test("en passant explains the actual captured pawn square", () => {
  const fen = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1";
  const candidate = candidatesFor(fen, [
    { rank: 1, depth: 12, cp: 100, pv: ["e5d6"] },
  ])[0];
  assert.match(candidate.explanation, /pawn on d5 en passant, landing on d6/);
});

test("discovered checks identify the checking rook rather than the moved knight", () => {
  const candidate = candidatesFor("4k3/8/8/8/8/8/4N3/K3R3 w - - 0 1", [
    { rank: 1, depth: 12, cp: 0, pv: ["e2c3", "e8d8"] },
  ])[0];
  assert.equal(candidate.move.san, "Nc3+");
  assert.match(candidate.explanation, /rook on e1 gives check/);
  assert.doesNotMatch(
    candidate.explanation,
    /knight gives check|knight on c3 gives check/,
  );
});

test("promotion checkmate identifies the new queen", () => {
  const candidate = candidatesFor("7k/P7/6K1/8/8/8/8/8 w - - 0 1", [
    { rank: 1, depth: 12, mate: 1, pv: ["a7a8q"] },
  ])[0];
  assert.equal(candidate.move.san, "a8=Q#");
  assert.match(candidate.explanation, /pawn promotes to a queen on a8/);
  assert.match(candidate.explanation, /queen on a8 delivers checkmate/);
  assert.doesNotMatch(candidate.explanation, /pawn on a8 delivers/);
});

test("double checks identify both checking pieces", () => {
  const candidate = candidatesFor("4k3/8/8/8/8/8/4B3/K3R3 w - - 0 1", [
    { rank: 1, depth: 12, cp: 0, pv: ["e2b5"] },
  ])[0];
  assert.match(candidate.explanation, /bishop on b5/);
  assert.match(candidate.explanation, /rook on e1/);
  assert.match(candidate.explanation, /give check/);
});

test("a discovered checking capture attributes check to the rook", () => {
  const candidate = candidatesFor("4k3/8/8/8/8/2p5/4N3/K3R3 w - - 0 1", [
    { rank: 1, depth: 12, cp: 0, pv: ["e2c3"] },
  ])[0];
  assert.match(candidate.explanation, /knight takes the pawn on c3/);
  assert.match(candidate.explanation, /rook on e1 gives check/);
});

test("quiet moves name the destination without inventing a strategic reason", () => {
  for (const [fen, uci, destination] of [
    ["4k3/8/8/8/8/P7/8/R3K3 w - - 0 1", "a1a2", "a2"],
    ["4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "e1d1", "d1"],
    ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "a2a3", "a3"],
  ]) {
    const candidate = candidatesFor(fen, [{ rank: 1, depth: 15, cp: 0, pv: [uci] }])[0];
    assert.ok(candidate.title.includes(destination));
    assert.equal(candidate.explanation, "");
  }
});
