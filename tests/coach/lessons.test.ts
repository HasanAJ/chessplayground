import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidatePresentation";
import { reviewMove } from "../../src/features/coach/grading";
import { tacticalThreats } from "../../src/features/coach/tacticalThreats";
import { lessonWalkthrough } from "../../src/features/coach/lessonWalkthrough";
import { english, translator } from "../../src/i18n/translate";

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
  assert.match(result.text, /knight on c2 attacks/);
  assert.match(result.text, /rook on a1/);
  assert.match(result.text, /king on e1/);
  assert.equal(result.lesson!.ply, 1);
  assert.equal(
    new Chess(result.lesson!.candidate.continuation[1].after).get("c2")?.type,
    "n",
  );
  assert.deepEqual(result.lesson!.walkthrough!.steps[1].focus!.arrows, [
    { from: "c2", to: "e1" },
    { from: "c2", to: "a1" },
  ]);
});

test("later captures explain the checking sequence without asserting the exchange is finished", () => {
  const result = review(
    "r3q1k1/p1R5/2p5/2P2Q2/4P3/8/Pb6/2K5 w - - 0 11",
    "c1d2",
    ["c1b2", "e8b8", "b2c1", "b8c7"],
  );
  assert.match(result.text, /queen on b8 attacks your king on b2 and your rook on c7/);
  assert.equal(result.lesson!.ply, 1);
  assert.equal(result.lesson!.walkthrough!.capturePly, 4);
  assert.match(result.lesson!.walkthrough!.outcome!, /give up 2 more points/);
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

test("the h3 lesson explains the discovered attack and follows the bishop exchange through its recapture", () => {
  const result = review(
    "1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ2/P2P1PPP/3RR1K1 w - - 4 3",
    "f3e2",
    ["h2h3", "f6d5", "f3e2", "d5e3", "e2e3"],
  );
  assert.match(result.text, /knight on d5 attacks your bishop on e3/);
  assert.match(result.text, /opens an attack by their rook on f8 against your queen on f3/);
  assert.match(result.bestReason!, /queen to e2, avoiding the attack after Nd5/);
  const walkthrough = result.lesson!.walkthrough!;
  assert.deepEqual(walkthrough.steps[1].focus!.arrows, [
    { from: "f8", to: "f3" },
    { from: "d5", to: "e3" },
  ]);
  assert.equal(walkthrough.capturePly, 4);
  assert.equal(walkthrough.endPly, 5);
  assert.equal(walkthrough.outcome, "The exchanges shown are equal in material.");
  assert.doesNotMatch(result.text, /loses|wins|give up|takes your/);
});

test("a fork lesson works when Black is the player being reviewed", () => {
  const result = review("r3k3/7p/8/3N4/8/8/8/4K3 b - - 0 1", "e8f8", ["h7h6", "d5c7"]);
  assert.match(result.text, /knight on c7 attacks your king on e8 and your rook on a8/);
  assert.deepEqual(result.lesson!.walkthrough!.steps[1].focus!.arrows, [
    { from: "c7", to: "e8" },
    { from: "c7", to: "a8" },
  ]);
});

test("a pinned attacker does not produce an unsupported capture threat", () => {
  const move = new Chess("4k3/4r3/2N5/8/8/8/8/K3R3 b - - 0 1").move("Re6");
  assert.equal(tacticalThreats(move, english), undefined);
});

test("threat analysis handles a double pawn move that permits en passant", () => {
  const move = new Chess("4k3/4p3/8/3P4/8/8/8/4K3 b - - 0 1").move("e5");
  assert.match(move.after, / e6 /);
  assert.equal(tacticalThreats(move, english), undefined);
});

test("a castling rook's attack is attributed to the rook that moved", () => {
  const move = new Chess("5n1k/8/8/8/8/8/8/4K2R w K - 0 1").move("O-O");
  const threat = tacticalThreats(move, english)!;
  assert.equal(threat.text, "Their rook on f1 attacks your knight on f8.");
  assert.deepEqual(threat.focus.arrows, [{ from: "f1", to: "f8" }]);
});

test("an unrelated equal exchange is not used as the reason for the grade", () => {
  const result = review(new Chess().fen(), "g1f3", ["e2e4", "e7e5", "d2d4", "e5d4", "d1d4"]);
  assert.doesNotMatch(result.text, /captures|takes your|loses|wins/);
  assert.equal(result.lesson!.walkthrough!.outcome, "The exchanges shown are equal in material.");
});

test("a truncated line warns about the recapture instead of implying the exchange is over", () => {
  const fen = "1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ2/P2P1PPP/3RR1K1 w - - 4 3";
  const played = candidatesFor(fen, [{
    rank: 1, depth: 20, cp: -300,
    pv: ["h2h3", "f6d5", "f3e2", "d5e3", "e2e9"],
  }])[0];
  assert.equal(played.continuation.length, 4);
  assert.equal(played.materialLoss, undefined);
  const walkthrough = lessonWalkthrough(played, english);
  assert.match(walkthrough.outcome!, /In the moves shown.*3 more points/);
  assert.match(walkthrough.outcome!, /recapture is still possible/);
});

test("an intermediate check and king response do not hide a later recapture", () => {
  const result = review("r3k3/8/8/8/8/3B4/7P/R1R3K1 w - - 0 1", "a1a2", [
    "h2h3", "a8a1", "d3b5", "e8f8", "c1a1",
  ]);
  assert.equal(result.lesson!.walkthrough!.endPly, 5);
  assert.equal(result.lesson!.walkthrough!.outcome, "The exchanges shown are equal in material.");
});

test("the reviewed Stockfish stalemate line reports the draw instead of its material loss", () => {
  const fen = "7k/7b/6R1/3PP3/3PKB2/4PP2/P5Q1/8 w - - 0 1";
  const best = candidatesFor(fen, [{
    rank: 1, depth: 20, mate: 4,
    pv: ["e4f5", "h7g6", "f5g6", "h8g8", "g2g5", "g8f8", "g5d8"],
  }])[0];
  const played = candidatesFor(fen, [{
    rank: 2, depth: 20, cp: 0, pv: ["a2a3", "h7g6", "g2g6"],
  }])[0];
  const result = reviewMove(played.move, best, undefined, false, played);
  assert.equal(result.label, "Blunder");
  assert.equal(new Chess(played.continuation[2].after).isStalemate(), true);
  assert.equal(result.lesson!.walkthrough!.endPly, 3);
  for (const language of ["en", "de", "es", "fr", "it"] as const) {
    const t = translator(language);
    const walkthrough = lessonWalkthrough(played, t);
    assert.equal(walkthrough.outcome, t("game.ending.stalemate"));
    assert.doesNotMatch(walkthrough.outcome!, /points of material|recapture/);
  }
});

test("a quiet stalemate remains reachable beyond the usual two-move preview", () => {
  const result = review("8/5K1k/8/6Q1/8/8/P7/8 w - - 0 1", "g5h5", [
    "a2a3", "h7h8", "g5g6",
  ]);
  assert.equal(result.lesson!.kind, "consequence");
  assert.equal(result.lesson!.walkthrough!.endPly, 3);
  assert.equal(result.lesson!.walkthrough!.outcome, english("game.ending.stalemate"));
});

test("other terminal draws also take precedence over the exchange balance", () => {
  const played = candidatesFor("7k/6q1/8/8/8/8/6Q1/2B4K w - - 0 1", [{
    rank: 1, depth: 20, cp: 0, pv: ["g2g7", "h8g7"],
  }])[0];
  assert.equal(new Chess(played.continuation[1].after).isInsufficientMaterial(), true);
  assert.equal(lessonWalkthrough(played, english).outcome, english("game.ending.insufficientMaterial"));
});

test("material summaries count promotions and describe gains from the reviewed player's side", () => {
  for (const [fen, line] of [
    ["4k3/8/8/8/8/8/p7/4K2R w - - 0 1", ["h1h2", "a2a1q"]],
    ["4k2r/P7/8/8/8/8/8/4K3 b - - 0 1", ["h8h7", "a7a8q"]],
  ] as const) {
    const played = candidatesFor(fen, [{ rank: 1, depth: 20, cp: -800, pv: [...line] }])[0];
    assert.match(lessonWalkthrough(played, english).outcome!, /give up 8 more points/);
  }
});

test("tactical annotations, outcomes, and alternative reasons translate with the review", () => {
  const fen = "1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ2/P2P1PPP/3RR1K1 w - - 4 3";
  const best = candidatesFor(fen, [{ rank: 1, depth: 20, cp: 300, pv: ["f3e2"] }])[0];
  const played = candidatesFor(fen, [{ rank: 2, depth: 20, cp: -300, pv: ["h2h3", "f6d5", "f3e2", "d5e3", "e2e3"] }])[0];
  for (const language of ["de", "es", "fr", "it"] as const) {
    const t = translator(language);
    const result = reviewMove(played.move, best, undefined, false, played, t);
    assert.notEqual(result.text, reviewMove(played.move, best, undefined, false, played).text);
    assert.match(result.bestReason!, /e2.*Nd5/);
    assert.equal(result.lesson!.walkthrough!.outcome, t("coach.lesson.material.equal"));
    assert.doesNotMatch(result.lesson!.walkthrough!.steps[1].text!, /\{\d+\}|Their|Moving the/);
  }
});
