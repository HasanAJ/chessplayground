import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement, StrictMode } from "react";
import { Chess } from "chess.js";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { addStudyMove, createStudy } from "../../src/chess/study";
import { SESSION_KEY } from "../../src/features/game/storage";
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

test("board selection and flipping skip coach, history, and hidden opening work", async (t) => {
  const { dom, root } = createTestRoot(t);
  const document = dom.window.document;
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  const requests: Parameters<AnalysisEngine["analyze"]>[] = [];
  t.mock.method(
    AnalysisEngine.prototype,
    "analyze",
    (...args: Parameters<AnalysisEngine["analyze"]>) => {
      requests.push(args);
      return () => {};
    },
  );
  await act(() => root.render(createElement(App)));
  const click = async (selector: string) => {
    const button = document.querySelector<HTMLButtonElement>(selector);
    assert.ok(button, selector);
    await act(() => button.click());
  };
  await click('[data-square="e2"]');
  await click('[data-square="e4"]');
  await click('[data-square="e7"]');
  await click('[data-square="e5"]');
  await click("#opening-tab");
  await act(async () => {
    await import("../../src/features/openings/OpeningWorkspace");
  });
  assert.equal(document.querySelectorAll(".opening-card").length, 30);
  await click("#play-tab");
  await click(".calculate-button");
  await act(() =>
    requests.at(-1)![1].onComplete([
      { rank: 1, depth: 18, cp: 20, pv: ["g1f3", "b8c6"] },
    ]),
  );
  const moves = t.mock.method(Chess.prototype, "moves");
  const squareText = t.mock.method(String.prototype, "matchAll");
  const openingSearch = t.mock.method(String.prototype, "toLocaleLowerCase");

  await click('[data-square="g1"]');
  assert.ok(document.querySelector('[data-square="g1"].selected-square'));
  assert.ok(document.querySelector('[data-square="f3"] .legal-dot'));
  await click(".flip-board-button");
  await click(".flip-board-button");
  assert.equal(moves.mock.callCount(), 1, "only the selected piece needs legal moves");
  assert.deepEqual(moves.mock.calls[0].arguments, [{ square: "g1", verbose: true }]);
  assert.equal(squareText.mock.callCount(), 0, "coach and history prose must not be rebuilt");
  assert.equal(
    openingSearch.mock.callCount(),
    0,
    "the hidden library must not be filtered again",
  );
  assert.deepEqual(
    Array.from(
      document.querySelectorAll(".move-history .square-reference"),
      (element) => element.textContent,
    ),
    ["e4", "e5"],
  );

  const reference = document.querySelector(".move-history .square-reference")!;
  await act(() =>
    reference.dispatchEvent(
      new dom.window.MouseEvent("mouseover", { bubbles: true }),
    ),
  );
  assert.ok(document.querySelector('[data-square="e4"].reference-square'));
  assert.equal(
    squareText.mock.callCount(),
    0,
    "highlighting a square must not rebuild every reference",
  );
  await act(() =>
    reference.dispatchEvent(
      new dom.window.MouseEvent("mouseout", { bubbles: true }),
    ),
  );
  assert.equal(document.querySelector(".reference-square"), null);

  await click(".calculate-button");
  assert.equal(document.querySelector(".selected-square"), null, "refresh clears selection");
  await click('[data-square="g1"]');
  await click('[data-square="f3"]');
  assert.equal(
    document.querySelector('[data-square="f3"] img')?.getAttribute("src"),
    "/pieces/wN.svg",
  );
  assert.equal(document.querySelector(".selected-square"), null);
  assert.equal(
    openingSearch.mock.callCount(),
    0,
    "playing a move must also leave the hidden library alone",
  );
});

test("automatic reviews wait for the computer reply and yield to requested analysis", async (t) => {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  dom.window.HTMLElement.prototype.animate = () =>
    ({ cancel() {}, onfinish: null }) as unknown as Animation;
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
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
  await act(() => root.render(createElement(App)));
  const click = async (selector: string) => {
    const button = dom.window.document.querySelector<HTMLButtonElement>(selector);
    assert.ok(button, selector);
    await act(() => button.click());
  };
  await click(".computer-toggle");
  await click('[data-square="e2"]');
  await click('[data-square="e4"]');
  assert.equal(requests.length, 1, "the opponent has priority over automatic review");
  assert.equal(requests[0].args[3]?.skill, 7);
  await act(() => {
    requests[0].args[1].onComplete([], "e7e5");
    t.mock.timers.tick(1000);
  });
  assert.equal(requests.length, 2);
  assert.equal(requests[1].args[0], new Chess().fen(), "review still covers the human move");
  assert.equal(requests[1].args[3]?.movetime, 1200);
  await click(".calculate-button");
  assert.equal(requests[1].cancelled, true);
  assert.equal(requests[2].args[3]?.multiPV, 5);
  await act(() =>
    requests[2].args[1].onComplete([
      { rank: 1, depth: 18, cp: 20, pv: ["g1f3", "b8c6"] },
    ]),
  );
  assert.equal(requests.length, 4, "the review resumes when requested analysis finishes");
  assert.equal(requests[3].args[0], requests[1].args[0]);
});
