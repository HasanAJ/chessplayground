import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { GameStore } from "../../src/application/game/GameStore.ts";
import { SearchScope } from "../../src/application/shared/SearchScope.ts";
import { createStudy, ROOT } from "../../src/domain/chess/study.ts";
import { START_FEN } from "../../src/domain/chess/position.ts";
import { startComputerTurn } from "../../src/application/computer/computer.ts";
import type {
  AnalysisCallbacks,
  AnalysisClient,
} from "../../src/application/ports/analysis.ts";

function engineHarness() {
  const requests: { callbacks: AnalysisCallbacks; cancelled: boolean }[] = [];
  const engine: AnalysisClient = {
    analyze(_fen, callbacks) {
      const request = { callbacks, cancelled: false };
      requests.push(request);
      return () => {
        request.cancelled = true;
      };
    },
  };
  return { engine, requests };
}

test("game commands publish once, branch independently and preserve both variations", () => {
  const game = new GameStore(createStudy(START_FEN));
  let notifications = 0;
  game.subscribe(() => notifications++);
  game.setError(null);
  game.setTool("move");
  assert.equal(
    notifications,
    0,
    "no-op controls do not invalidate the workspace",
  );
  game.playMove("e2", "e4");
  game.playMove("e7", "e5");
  const original = game.getSnapshot();
  game.showHistory(0);
  game.playMove("d2", "d4");
  const branch = game.getSnapshot();
  assert.deepEqual(
    branch.history.map((move) => move.san),
    ["d4"],
  );
  assert.equal(branch.study.nodes.length, 3);
  assert.equal(branch.study.nodes.at(-1)!.parent, ROOT);
  assert.equal(original.history.length, 2);
  assert.equal(original.positionGame.get("e4")?.type, "p");
  game.showHistory(999);
  assert.equal(game.getSnapshot().historyPly, null);
  game.showHistory(-10);
  assert.equal(game.getSnapshot().historyPly, 0);
});

test("promotion and incomplete setup cannot accidentally commit a move", () => {
  const game = new GameStore(createStudy("7k/P7/8/8/8/8/8/7K w - - 0 1"));
  game.playMove("a7", "a8");
  assert.ok(game.getSnapshot().promotion);
  assert.equal(game.getSnapshot().history.length, 0);
  game.playMove("a7", "a8", "k");
  assert.equal(game.getSnapshot().history.length, 0);
  game.playMove("a7", "a8", "n");
  assert.equal(game.getSnapshot().positionGame.get("a8")?.type, "n");
  game.setBoardPosition({}, "w", "");
  assert.equal(game.getSnapshot().playable, false);
  game.playMove("h8", "h7");
  assert.deepEqual(game.getSnapshot().draft?.position, {});
});

test("a synchronous completion cannot hide the cancellation of its next search", () => {
  const cancelled: number[] = [];
  let count = 0;
  const engine: AnalysisClient = {
    analyze(_fen, callbacks) {
      const id = ++count;
      if (id === 1) callbacks.onComplete([]);
      return () => {
        cancelled.push(id);
      };
    },
  };
  const scope = new SearchScope(engine);
  const callbacks: AnalysisCallbacks = {
    onProgress() {},
    onError() {},
    onComplete() {},
  };
  scope.run(START_FEN, {
    ...callbacks,
    onComplete: () => scope.run(START_FEN, callbacks),
  });
  scope.dispose();
  assert.ok(
    cancelled.includes(2),
    "the current search must be cancelled, even with synchronous clients",
  );
});

test("an illegal engine reply fails visibly instead of leaving computer play stuck", () => {
  const { engine, requests } = engineHarness();
  let failed = false,
    moved = false;
  const dispose = startComputerTurn(
    engine,
    new Chess().fen(),
    { rootFen: START_FEN, moves: [] },
    "medium",
    {
      onWaiting() {},
      onMove() {
        moved = true;
      },
      onError() {
        failed = true;
      },
    },
  );
  requests[0].callbacks.onComplete([], "e2e5");
  assert.equal(failed, true);
  assert.equal(moved, false);
  dispose();
  failed = false;
  requests[0].callbacks.onError("stale");
  assert.equal(failed, false);
});
