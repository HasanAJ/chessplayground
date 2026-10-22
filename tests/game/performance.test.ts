import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement, StrictMode } from "react";
import { Chess } from "chess.js";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { addStudyMove, createStudy, SESSION_KEY } from "../../src/chess/study";
import { createTestRoot } from "../helpers/dom";

test("playing a long game applies only the new move, including automatic review", async (t) => {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  t.mock.method(AnalysisEngine.prototype, "analyze", () => () => {});
  const game = new Chess();
  let study = createStudy(game.fen());
  const moves = (
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O " +
    "h3 Nb8 d4 Nbd7 Nbd2 Bb7 Bc2 Re8 Nf1 Bf8 Ng3 g6 a4 c5 d5 c4 " +
    "b4 cxb3 Bxb3 Nc5 Bc2 Bg7 Be3 Rc8"
  ).split(" ");
  for (const san of moves) {
    const move = game.move(san);
    study = addStudyMove(study, study.tipId, move.lan);
  }
  dom.window.localStorage.setItem(SESSION_KEY, JSON.stringify(study));
  await act(() =>
    root.render(createElement(StrictMode, null, createElement(App))),
  );
  const next = game.move("Qd2");
  const moveCalls = t.mock.method(Chess.prototype, "move");
  const historyCalls = t.mock.method(Chess.prototype, "history");
  const clickSquare = async (square: string) => {
    const button = dom.window.document.querySelector<HTMLButtonElement>(
      `#play-workspace [data-square="${square}"]`,
    );
    assert.ok(button);
    await act(() => button.click());
  };

  await clickSquare(next.from);
  assert.equal(moveCalls.mock.callCount(), 0, "selection must not replay moves");
  await clickSquare(next.to);
  assert.equal(
    moveCalls.mock.callCount(),
    1,
    "the board should apply one move and the review should reuse its snapshot",
  );
  assert.equal(
    historyCalls.mock.callCount(),
    0,
    "normal moves must not traverse the full history",
  );
  assert.equal(dom.window.localStorage.getItem("tempo-position"), next.after);
  const saved = JSON.parse(dom.window.localStorage.getItem(SESSION_KEY)!);
  assert.equal(saved.nodes.length, moves.length + 1);
  assert.equal(saved.nodes.at(-1).uci, next.lan);
  assert.equal(
    dom.window.document.querySelectorAll(".move-history button").length,
    moves.length + 2,
  );
});
