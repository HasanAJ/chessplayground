import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement, useState } from "react";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { useMoveReview } from "../../src/features/coach/useMoveReview";
import { useGameController } from "../../src/features/game/useGameController";
import { createTestRoot } from "../helpers/dom";

test("pausing reviews cancels stale results, resumes the move, and retains completed feedback", async (t) => {
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
    review: ReturnType<typeof useMoveReview>;
    setPaused: (paused: boolean) => void;
  };
  function Harness() {
    const game = useGameController(() => {});
    const [paused, setPaused] = useState(true);
    const review = useMoveReview(game, game.history.length, 0, paused);
    current = { game, review, setPaused };
    return null;
  }
  await act(() => root.render(createElement(Harness)));
  await act(() => current.game.playMove("e2", "e4"));
  assert.equal(requests.length, 0);
  await act(() => current.setPaused(false));
  assert.equal(requests.length, 1);
  await act(() => current.setPaused(true));
  assert.equal(requests[0].cancelled, true);
  const best = { rank: 1, depth: 18, cp: 20, pv: ["e2e4", "e7e5"] };
  await act(() => requests[0].args[1].onComplete([best]));
  assert.equal(requests.length, 1, "a canceled result cannot start a reply search");
  assert.equal(current.review?.state, "thinking");
  await act(() => current.setPaused(false));
  assert.equal(requests.length, 2);
  await act(() => requests[1].args[1].onComplete([best]));
  assert.equal(requests.length, 3);
  await act(() =>
    requests[2].args[1].onComplete([
      { rank: 1, depth: 18, cp: -20, pv: ["e7e5", "g1f3"] },
    ]),
  );
  assert.equal(current.review?.state, "ready");
  const completed = current.review;
  await act(() => current.setPaused(true));
  assert.equal(current.review, completed);
  await act(() => current.setPaused(false));
  assert.equal(current.review, completed);
  assert.equal(requests.length, 3, "cached feedback does not need another search");
});
