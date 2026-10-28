import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement, useState } from "react";
import { Chess } from "chess.js";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import type { EngineLine } from "../../src/engine/uci";
import { useGameController } from "../../src/features/game/useGameController";
import { useRecommendations } from "../../src/features/coach/useRecommendations";
import { createTestRoot } from "../helpers/dom";

async function mount(t: TestContext) {
  const { root } = createTestRoot(t);
  const requests: {
    args: Parameters<AnalysisEngine["analyze"]>;
    cancelled: boolean;
  }[] = [];
  t.mock.method(
    AnalysisEngine.prototype,
    "analyze",
    (...args: Parameters<AnalysisEngine["analyze"]>) => {
      const request = { args, cancelled: false };
      requests.push(request);
      return () => {
        request.cancelled = true;
      };
    },
  );
  let current!: {
    game: ReturnType<typeof useGameController>;
    recommendations: ReturnType<typeof useRecommendations>;
    setPaused: (value: boolean) => void;
  };
  function Harness() {
    const game = useGameController(() => {});
    const [paused, setPaused] = useState(false);
    const recommendations = useRecommendations(game, paused);
    current = { game, recommendations, setPaused };
    return null;
  }
  await act(() => root.render(createElement(Harness)));
  return {
    read: () => current,
    requests,
    complete: (
      index: number,
      lines: EngineLine[],
      bestMove = lines[0]?.pv[0],
      bestLine?: EngineLine,
    ) => act(() => requests[index].args[1].onComplete(lines, bestMove, bestLine)),
  };
}

const openingLine = { rank: 1, depth: 12, cp: 30, pv: ["e2e4", "e7e5"] };

test("the screenshot keeps Stockfish's ranking and capture warning when reusing a cached calculation", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().game.replaceGame(new Chess("8/8/n5p1/P7/6P1/4BK1k/8/8 b - - 0 1")));
  await act(() => read().recommendations.calculate());
  await complete(0, [
    { rank: 1, depth: 16, cp: -700, pv: ["g6g5", "e3g5", "a6b8", "g5d2"] },
    { rank: 2, depth: 16, cp: -718, pv: ["a6b4", "g4g5"] },
  ], "g6g5");
  assert.equal(read().recommendations.best?.move.san, "g5");
  assert.match(read().recommendations.best!.explanation, /bishop can take your pawn on g5/);
  assert.equal(read().recommendations.analysis?.candidates[0].move.san, "g5");
  await act(() => read().recommendations.clear());
  await act(() => read().recommendations.calculate());
  assert.equal(read().recommendations.best?.move.san, "g5");
  assert.equal(requests.length, 1);
  const best = read().recommendations.best!;
  await act(() => read().game.playMove(best.move.from, best.move.to));
  assert.equal(read().game.history.at(-1)?.san, "g5");
});

test("the final best move replaces an older first choice without another search", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  const finalLine = { rank: 1, depth: 13, cp: 40, pv: ["g1f3", "d7d5"] };
  await complete(0, [
    openingLine,
    { rank: 2, depth: 12, cp: 25, pv: ["g1f3", "g8f6"] },
  ], "g1f3", finalLine);
  assert.equal(read().recommendations.best?.move.san, "Nf3");
  assert.deepEqual(read().recommendations.best?.pv, finalLine.pv);
  assert.equal(read().recommendations.best?.cp, 40);
  assert.equal(read().recommendations.best?.depth, 13);
  assert.deepEqual(read().recommendations.candidates.map((line) => line.move.san), ["Nf3", "e4"]);
  await act(() => read().recommendations.clear());
  await act(() => read().recommendations.calculate());
  assert.equal(read().recommendations.best?.move.san, "Nf3");
  assert.deepEqual(read().recommendations.candidates.map((line) => line.move.san), ["Nf3", "e4"]);
  assert.equal(requests.length, 1);
  assert.deepEqual(requests[0].args[3], { depth: null, movetime: 2000, multiPV: 5 });
});

test("a newly discovered final move uses its own line even outside the completed candidates", async (t) => {
  const { read, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await complete(0, [openingLine], "c2c4", {
    rank: 1, depth: 13, cp: 45, pv: ["c2c4", "g8f6"],
  });
  assert.equal(read().recommendations.best?.move.san, "c4");
  assert.deepEqual(read().recommendations.candidates.map((line) => line.move.san), ["c4", "e4"]);
  assert.deepEqual(read().recommendations.best?.continuation.map((move) => move.san), ["c4", "Nf6"]);
  assert.equal(read().recommendations.analysis?.state, "ready");
});

test("an unchanged final choice retains alternatives from the completed depth", async (t) => {
  const { read, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await complete(0, [
    openingLine,
    { rank: 2, depth: 12, cp: 25, pv: ["d2d4", "d7d5"] },
  ], "e2e4", openingLine);
  assert.deepEqual(read().recommendations.candidates.map((line) => line.move.san), ["e4", "d4"]);
  assert.deepEqual(read().recommendations.candidates.map((line) => line.depth), [12, 12]);
});

test("an unchanged best move keeps its newer score and useful completed alternatives", async (t) => {
  const { read, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  const finalLine = { ...openingLine, depth: 13, cp: -50, pv: ["e2e4", "c7c5"] };
  await complete(0, [
    openingLine,
    { rank: 2, depth: 12, cp: 25, pv: ["d2d4", "d7d5"] },
  ], "e2e4", finalLine);
  assert.equal(read().recommendations.best?.cp, -50);
  assert.deepEqual(read().recommendations.best?.pv, finalLine.pv);
  assert.equal(read().recommendations.best?.depth, 13);
  assert.deepEqual(read().recommendations.candidates.map((line) => line.move.san), ["e4", "d4"]);
});

test("the default search retains all five starting-position options when the best line deepens", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await complete(0, [
    { rank: 1, depth: 17, cp: 23, pv: ["e2e4", "e7e5"] },
    { rank: 2, depth: 17, cp: 20, pv: ["d2d4", "d7d5"] },
    { rank: 3, depth: 17, cp: 20, pv: ["g1f3", "d7d5"] },
    { rank: 4, depth: 17, cp: 13, pv: ["e2e3", "e7e5"] },
    { rank: 5, depth: 17, cp: 11, pv: ["c2c4", "e7e5"] },
  ], "e2e4", { rank: 1, depth: 18, cp: 32, pv: ["e2e4", "c7c5"] });
  assert.deepEqual(read().recommendations.candidates.map((line) => line.move.san), ["e4", "d4", "Nf3", "e3", "c4"]);
  assert.equal(read().recommendations.best?.cp, 32);
  assert.deepEqual(read().recommendations.best?.pv, ["e2e4", "c7c5"]);
  assert.equal(requests.length, 1, "retaining the alternatives adds no searches");
});

test("position changes cancel a running search and ignore its late result", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await act(() => read().game.playMove("e2", "e4"));
  assert.equal(requests[0].cancelled, true);
  assert.equal(read().recommendations.requested, false);
  await act(() => read().recommendations.calculate());
  await complete(0, [{ ...openingLine, depth: 24 }]);
  assert.equal(read().recommendations.best, undefined);
  assert.equal(read().recommendations.thinking, true);
  await complete(1, [{ rank: 1, depth: 12, cp: -30, pv: ["e7e5", "g1f3"] }]);
  assert.equal(read().recommendations.best?.move.san, "e5");
  await act(() => read().game.newGame());
  await act(() => read().recommendations.calculate());
  assert.equal(requests.length, 3, "the canceled result did not enter the cache");
});

test("a missing or illegal final line reports an error instead of suggesting another move", async (t) => {
  const { read, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await complete(0, [openingLine], "c2c4");
  assert.equal(read().recommendations.best, undefined);
  assert.equal(read().recommendations.analysis?.state, "error");
  await act(() => read().recommendations.calculate());
  await complete(1, [openingLine], "c2c5", {
    rank: 1, depth: 13, cp: 45, pv: ["c2c5"],
  });
  assert.equal(read().recommendations.best, undefined);
  assert.equal(read().recommendations.analysis?.state, "error");
  await act(() => read().recommendations.calculate());
  await complete(2, [openingLine]);
  assert.equal(read().recommendations.best?.move.san, "e4");
});

test("completed calculations parse each continuation once and repeated Calculate reuses the result", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  const calls = t.mock.method(Chess.prototype, "move");
  await complete(0, [openingLine]);
  assert.equal(calls.mock.callCount(), openingLine.pv.length);
  const best = read().recommendations.best;
  assert.equal(best?.move.san, "e4");
  await act(() => read().recommendations.clear());
  await act(() => read().recommendations.calculate());
  await act(() => read().recommendations.calculate());
  assert.equal(requests.length, 1);
  assert.equal(read().recommendations.best, best);
  assert.equal(read().recommendations.thinking, false);
  assert.equal(calls.mock.callCount(), openingLine.pv.length);
});

test("returning to history or starting the same game reuses completed searches without auto-calculating", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await complete(0, [openingLine]);
  await act(() => read().game.playMove("e2", "e4"));
  assert.equal(read().recommendations.requested, false);
  await act(() => read().recommendations.calculate());
  await complete(1, [{ rank: 1, depth: 13, cp: 0, pv: ["e7e5", "g1f3"] }]);
  const blackBest = read().recommendations.best;
  await act(() => read().game.showHistory(0));
  assert.equal(read().recommendations.requested, false);
  await act(() => read().recommendations.calculate());
  assert.equal(read().recommendations.best?.move.san, "e4");
  await act(() => read().game.showHistory(1));
  await act(() => read().recommendations.calculate());
  assert.equal(read().recommendations.best, blackBest);
  await act(() => read().game.newGame());
  await act(() => read().recommendations.calculate());
  assert.equal(read().recommendations.best?.move.san, "e4");
  assert.equal(requests.length, 2);
});

test("identical FENs with different move histories do not share cached analysis", async (t) => {
  const { read, requests, complete } = await mount(t);
  for (const [from, to] of [
    ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"],
  ] as const)
    await act(() => read().game.playMove(from, to));
  await act(() => read().recommendations.calculate());
  await complete(0, [openingLine]);
  const fen = read().game.fen;
  await act(() => read().game.replaceGame(new Chess(fen)));
  assert.equal(read().game.fen, fen);
  await act(() => read().recommendations.calculate());
  assert.equal(requests.length, 2);
  assert.equal(requests[0].args[2]!.moves.length, 4);
  assert.equal(requests[1].args[2]!.moves.length, 0);
});

test("pausing cancels pending searches and late results cannot populate the cache", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await act(() => read().setPaused(true));
  assert.equal(requests[0].cancelled, true);
  await complete(0, [openingLine]);
  assert.equal(read().recommendations.best, undefined);
  await act(() => read().setPaused(false));
  assert.equal(requests.length, 2);
  await complete(1, [openingLine]);
  await act(() => read().setPaused(true));
  await act(() => read().setPaused(false));
  assert.equal(requests.length, 2);
  assert.equal(read().recommendations.best?.move.san, "e4");
});

test("failed searches and illegal engine continuations remain retryable", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await act(() => requests[0].args[1].onError("Engine unavailable"));
  assert.equal(read().recommendations.analysis?.state, "error");
  await act(() => read().recommendations.calculate());
  await complete(1, [{ ...openingLine, pv: ["e2e5"] }]);
  assert.equal(read().recommendations.analysis?.state, "error");
  await act(() => read().recommendations.calculate());
  await complete(2, [openingLine]);
  assert.equal(requests.length, 3);
  assert.equal(read().recommendations.best?.move.san, "e4");
});

test("an explicit refresh replaces a cached result with a new search", async (t) => {
  const { read, requests, complete } = await mount(t);
  await act(() => read().recommendations.calculate());
  await complete(0, [openingLine]);
  await act(() => read().recommendations.calculate(true));
  assert.equal(requests.length, 2);
  assert.equal(read().recommendations.thinking, true);
  await complete(1, [{ ...openingLine, depth: 18, cp: 25 }]);
  await act(() => read().recommendations.calculate());
  assert.equal(requests.length, 2);
  assert.equal(read().recommendations.best?.depth, 18);
  assert.equal(read().recommendations.best?.cp, 25);
});
