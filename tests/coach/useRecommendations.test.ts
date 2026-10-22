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
    complete: (index: number, lines: EngineLine[]) =>
      act(() => requests[index].args[1].onComplete(lines)),
  };
}

const openingLine = { rank: 1, depth: 12, cp: 30, pv: ["e2e4", "e7e5"] };

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
