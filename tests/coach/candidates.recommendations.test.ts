import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { START_FEN } from "../../src/chess/position";
import {
  recommendedCandidates,
} from "../../src/features/coach/candidates";
import { candidatesFor } from "../../src/features/coach/candidatePresentation";
import { type EngineLine } from "../../src/engine/uci";

function candidates(
  scores: Pick<EngineLine, "cp" | "mate">[],
  fen = START_FEN,
) {
  const moves = new Chess(fen).moves({ verbose: true });
  const result = candidatesFor(
    fen,
    scores.map((score, index) => ({
      rank: index + 1,
      depth: 15,
      ...score,
      pv: [moves[index].lan],
    })),
  );
  assert.equal(result.length, scores.length);
  return result;
}

test("recommendations keep close alternatives and exclude a drop beyond half a pawn", () => {
  const evaluated = candidates([100, 70, 50, 49, -200].map((cp) => ({ cp })));
  assert.deepEqual(
    recommendedCandidates(evaluated).map((move) => move.rank),
    [1, 2, 3],
  );
  assert.equal(evaluated.length, 5); // Full engine results remain available for validation.
});

test("recommendations evaluate alternatives from Black's perspective", () => {
  const game = new Chess();
  game.move("e4");
  const result = recommendedCandidates(
    candidates(
      [40, 10, -20, -300].map((cp) => ({ cp })),
      game.fen(),
    ),
  );
  assert.deepEqual(
    result.map((move) => move.rank),
    [1, 2],
  );
  assert.deepEqual(
    result.map((move) => move.whiteScore),
    [-0.4, -0.1],
  );
});

test("up to five worthwhile options retain their ranking and continuations", () => {
  const evaluated = candidates([30, 25, 20, 15, 10, 5].map((cp) => ({ cp })));
  const result = recommendedCandidates(evaluated);
  assert.deepEqual(result, evaluated.slice(0, 5));
  assert.equal(result[4].continuation[0].lan, evaluated[4].move.lan);
});

test("a clear best move is shown alone, even when several other moves are legal", () => {
  const evaluated = candidates([0, -100, -250].map((cp) => ({ cp })));
  const result = recommendedCandidates(evaluated);
  assert.deepEqual(result, [evaluated[0]]);
  assert.ok(new Chess().moves().length > 1, "one recommendation does not mean one legal move");
});

test("a losing position still shows the best defense and comparable alternatives", () => {
  const evaluated = candidates([-800, -830, -900].map((cp) => ({ cp })));
  assert.deepEqual(
    recommendedCandidates(evaluated).map((move) => move.rank),
    [1, 2],
  );
  assert.deepEqual(recommendedCandidates([]), []);
});

test("winning mating lines exclude moves that give up mate or allow mate", () => {
  const evaluated = candidates([
    { mate: 2 },
    { mate: 5 },
    { cp: 1000 },
    { mate: -2 },
  ]);
  assert.deepEqual(
    recommendedCandidates(evaluated).map((move) => move.rank),
    [1, 2],
  );
  const avoidableMate = candidates([{ cp: -900 }, { mate: -10 }]);
  assert.deepEqual(recommendedCandidates(avoidableMate), [avoidableMate[0]]);
});

test("when mate is unavoidable, weaker defenses are omitted", () => {
  const evaluated = candidates([{ mate: -5 }, { mate: -5 }, { mate: -2 }]);
  assert.deepEqual(
    recommendedCandidates(evaluated).map((move) => move.rank),
    [1, 2],
  );
});

test("a position with only one legal move retains its best defense", () => {
  const game = new Chess("7k/4K3/5B2/8/8/8/8/7R b - - 0 1");
  const best = candidatesFor(game.fen(), [
    { rank: 1, depth: 15, mate: -1, pv: ["h8g8", "h1h8"] },
  ])[0];
  assert.deepEqual(recommendedCandidates([best]), [best]);
  assert.equal(game.moves().length, 1);
});

test("newer best scores do not change qualification against the completed comparison", () => {
  const evaluated = candidates([30, 25, -30, -100].map((cp) => ({ cp })));
  for (const cp of [150, -50]) {
    const latest = candidatesFor(START_FEN, [{ ...evaluated[0], depth: 16, cp }])[0];
    assert.deepEqual(recommendedCandidates(evaluated, latest), [latest, evaluated[1]]);
  }
});

test("a final choice outside the completed batch keeps four alternatives and no duplicates", () => {
  const evaluated = candidates([30, 25, 20, 15, 10, 5].map((cp) => ({ cp })));
  const latest = candidatesFor(START_FEN, [{ ...evaluated[5], rank: 1, depth: 16, cp: 40 }])[0];
  assert.deepEqual(recommendedCandidates(evaluated.slice(0, 5), latest), [latest, ...evaluated.slice(0, 4)]);
  assert.deepEqual(recommendedCandidates(evaluated, latest), [latest, ...evaluated.slice(0, 4)]);
});

test("a newer mating result still excludes alternatives that give up or allow mate", () => {
  const evaluated = candidates([{ cp: 30 }, { cp: 20 }, { mate: 4 }, { mate: -2 }]);
  const latest = candidatesFor(START_FEN, [{ ...evaluated[0], depth: 16, cp: undefined, mate: 3 }])[0];
  assert.deepEqual(recommendedCandidates(evaluated, latest), [latest, evaluated[2]]);
  const losing = candidates([{ mate: -5 }, { mate: -5 }, { mate: -2 }]);
  const avoidsMate = candidatesFor(START_FEN, [{ ...losing[0], depth: 16, cp: -900, mate: undefined }])[0];
  assert.deepEqual(recommendedCandidates(losing, avoidsMate), [avoidsMate]);
});
