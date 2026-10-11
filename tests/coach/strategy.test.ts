import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidates";
import { strategyInsight } from "../../src/features/coach/strategy";

function candidate(fen: string, pv: string[], cp = 0, mate?: number) {
  return candidatesFor(fen, [{ rank: 1, depth: 15, cp, mate, pv }])[0];
}

test("plan changes identify new threats and highlight concrete squares", () => {
  const game = new Chess("4k3/8/8/8/8/8/q7/R3K3 b Q - 0 1");
  const move = game.move("Qb2");
  const best = candidate(game.fen(), ["a1b1"], -200);
  const insight = strategyInsight(game, best, undefined, move);
  assert.match(insight.change!, /Qb2/);
  assert.ok(insight.squares.includes("b1"));
  assert.ok(insight.facts.some((fact) => /material balance/.test(fact)));
});

test("key squares include the center squares described in the plan", () => {
  const game = new Chess();
  game.move("e4");
  game.move("e5");
  const insight = strategyInsight(game, candidate(game.fen(), ["b1c3"]));
  assert.ok(insight.facts.some((fact) => /cover d5 in the center/.test(fact)));
  assert.ok(insight.squares.includes("d5"));
});

test("general material commentary does not invent key squares", () => {
  const game = new Chess("4k3/8/8/8/8/8/8/R3K3 w - - 0 1");
  const insight = strategyInsight(game, candidate(game.fen(), ["a1a2"]));
  assert.deepEqual(insight.squares, []);
});

test("a blocking move also highlights the checked king mentioned in the explanation", () => {
  const game = new Chess("4k3/3b4/8/8/8/8/R7/K7 w - - 0 1");
  const move = game.move("Re2+");
  const insight = strategyInsight(
    game,
    candidate(game.fen(), ["d7e6"]),
    undefined,
    move,
  );
  assert.match(insight.change!, /king in check/);
  assert.ok(insight.squares.includes("e8"));
});

test("key squares include a recent capture even when the recommendation moves elsewhere", () => {
  const game = new Chess("4k3/8/8/8/2n5/8/1P6/4K1N1 b - - 0 1");
  const move = game.move("Nxb2");
  const insight = strategyInsight(
    game,
    candidate(game.fen(), ["g1f3"]),
    undefined,
    move,
  );
  assert.match(insight.change!, /taken your pawn with Nxb2/);
  assert.ok(insight.squares.includes("b2"));
});

test("strategy does not present an unfinished exchange as a material sacrifice", () => {
  const game = new Chess();
  game.move("e4");
  game.move("e5");
  game.move("Nf3");
  const best = candidate(
    game.fen(),
    ["b8c6", "d2d4", "e5d4", "f3d4", "g8f6", "d4c6"],
    -30,
  );
  const insight = strategyInsight(game, best);
  assert.ok(insight.facts.some((fact) => /exchange may continue/.test(fact)));
  assert.ok(insight.facts.every((fact) => !/gives up 3/.test(fact)));
});

test("recommended promotions name the piece that attacks from the promotion square", () => {
  for (const [promotion, name, fen] of [
    ["q", "queen", "7k/P7/6K1/8/8/8/8/8 w - - 0 1"],
    ["r", "rook", "7k/P7/6K1/8/8/8/8/8 w - - 0 1"],
    ["b", "bishop", "7k/P7/2r5/8/8/8/8/4K3 w - - 0 1"],
    ["n", "knight", "7k/P7/1r6/8/8/8/8/4K3 w - - 0 1"],
  ]) {
    const game = new Chess(fen);
    const insight = strategyInsight(
      game,
      candidate(game.fen(), [`a7a8${promotion}`]),
    );
    assert.ok(
      insight.facts.some((fact) =>
        fact.includes(`under attack from your ${name}.`),
      ),
      `${name} promotion should identify the promoted attacker`,
    );
  }
});

test("plan changes name the opponent's promoted piece on its new square", () => {
  for (const [promotion, name] of [
    ["q", "queen"],
    ["r", "rook"],
    ["b", "bishop"],
    ["n", "knight"],
  ]) {
    const game = new Chess("8/Pp6/2k5/8/8/8/7p/4K3 w - - 0 8");
    const move = game.move(`a8=${promotion.toUpperCase()}`);
    const insight = strategyInsight(
      game,
      candidate(game.fen(), ["c6c5"]),
      undefined,
      move,
    );
    assert.ok(insight.change?.startsWith(`Their ${name} is now on a8.`));
  }
});
