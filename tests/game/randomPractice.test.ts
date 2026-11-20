import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import { practicePositions } from "../../src/content/practice/positions.ts";
import { AnalysisEngine } from "../../src/infrastructure/stockfish/AnalysisEngine.ts";
import { SESSION_KEY } from "../../src/infrastructure/persistence/session.ts";
import { usePlayWorkspace } from "../../src/ui/game/usePlayWorkspace.ts";
import { createTestRoot } from "../helpers/dom.ts";

async function mount(t: TestContext) {
  const { root, dom } = createTestRoot(t);
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
  let workspace!: ReturnType<typeof usePlayWorkspace>;
  function Harness() {
    workspace = usePlayWorkspace(true);
    return null;
  }
  await act(() => root.render(createElement(Harness)));
  return { read: () => workspace, dom, requests };
}

test("random practice replaces the session, clears analysis and previews, and saves the new starting position", async (t) => {
  const { read, dom, requests } = await mount(t);
  await act(() => read().calculateBestMoves());
  await act(() =>
    requests[0].args[1].onComplete(
      [{ rank: 1, depth: 15, cp: 30, pv: ["g1f3", "d7d5"] }],
      "g1f3",
    ),
  );
  await act(() => read().presentation.startHints());
  await act(() =>
    read().preview.inspectMove(read().recommendations.best!, 1, "click"),
  );
  const oldStudy = read().game.study.id;
  const recent: string[] = [];
  for (let index = 0; index < 8; index++) {
    await act(() => read().randomPosition());
    const state = read();
    const position = practicePositions.find((p) => p.fen === state.game.fen)!;
    assert.ok(position);
    assert.equal(recent.includes(position.id), false);
    recent.push(position.id);
    if (recent.length > 5) recent.shift();
    assert.notEqual(state.game.study.id, oldStudy);
    assert.equal(state.game.history.length, 0);
    assert.equal(state.game.study.rootFen, position.fen);
    assert.equal(state.preview.boardPreview, false);
    assert.equal(state.presentation.hinting, false);
    assert.equal(state.recommendations.requested, false);
    assert.equal(state.computer.enabled, false);
    assert.equal(
      JSON.parse(dom.window.localStorage.getItem(SESSION_KEY)!).rootFen,
      position.fen,
    );
  }
  const before = read().game.fen;
  const move = read().game.analysisGame.moves({ verbose: true })[0];
  await act(() => read().game.playMove(move.from, move.to, move.promotion));
  assert.notEqual(read().game.fen, before);
  assert.equal(read().game.history.length, 1);
});

test("random practice preserves computer settings, cancels its previous turn, and lets the human move first", async (t) => {
  const { read, requests } = await mount(t);
  await act(() => {
    read().computer.setSide("b");
    read().computer.setDifficulty("hard");
    read().computer.setEnabled(true);
  });
  assert.equal(read().opponent.turn, true);
  const pending = requests.at(-1)!;
  await act(() => read().randomPosition());
  assert.equal(pending.cancelled, true);
  assert.equal(read().computer.enabled, true);
  assert.equal(read().computer.side, "b");
  assert.equal(read().computer.difficulty, "hard");
  assert.equal(read().game.analysisGame.turn(), "b");
  assert.equal(read().opponent.turn, false);
  const move = read()
    .game.analysisGame.moves({ verbose: true })
    .find((move) => !new Chess(move.after).isGameOver())!;
  await act(() => read().game.playMove(move.from, move.to, move.promotion));
  assert.equal(read().opponent.turn, true);
  assert.equal(requests.at(-1)!.args[0], read().game.fen);
  assert.equal(requests.at(-1)!.args[2]!.rootFen, read().game.study.rootFen);
});
