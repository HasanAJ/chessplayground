import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import type { EngineLine } from "../../src/engine/uci";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { BoardPanel } from "../../src/features/board/BoardPanel";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { SquareHighlightProvider } from "../../src/features/board/SquareHighlight";
import { useComputerSettings } from "../../src/features/computer/useComputerSettings";
import { useGameController } from "../../src/features/game/useGameController";
import { candidatesFor } from "../../src/features/coach/candidates";
import { CoachPanel } from "../../src/features/coach/CoachPanel";
import { useCoachPresentation } from "../../src/features/coach/useCoachPresentation";
import type { Recommendations } from "../../src/features/coach/useRecommendations";
import { createTestRoot } from "../helpers/dom";

async function renderWorkspace(
  t: TestContext,
  fen = new Chess().fen(),
  lines: EngineLine[] = [{ rank: 1, depth: 15, cp: 30, pv: ["g1f3", "d7d5"] }],
) {
  const { root, dom } = createTestRoot(t);
  dom.window.localStorage.setItem("tempo-position", fen);
  let mobile = true;
  Object.defineProperty(dom.window, "matchMedia", {
    value: (query: string) => ({
      matches: query === "(max-width: 900px)" && mobile,
    }),
  });
  let scrolls = 0;
  dom.window.HTMLElement.prototype.scrollIntoView = () => scrolls++;
  const candidates = candidatesFor(fen, lines);
  let preview!: ReturnType<typeof useBoardPreview>;
  let currentGame!: ReturnType<typeof useGameController>;
  let currentComputer!: ReturnType<typeof useComputerSettings>;
  function Harness() {
    const computer = useComputerSettings();
    currentComputer = computer;
    const game = useGameController(computer.disable);
    currentGame = game;
    preview = useBoardPreview(game.analysisKey, game.playable);
    const botTurn =
      computer.enabled &&
      !computer.open &&
      !game.reviewing &&
      game.positionGame.turn() !== computer.side;
    const recommendations: Recommendations = {
      candidates,
      best: candidates[0],
      thinking: false,
      requested: true,
      current: true,
      analysis: {
        key: game.analysisKey,
        candidates,
        best: candidates[0],
        language: "en",
        state: "ready",
      },
      calculate() {},
      clear() {},
    };
    const presentation = useCoachPresentation(game, recommendations, preview);
    return createElement(
      SquareHighlightProvider,
      { positionKey: game.analysisKey, children: null },
      createElement(BoardPanel, {
        game,
        onDraggingChange() {},
        selectionReset: 0,
        preview,
        computer,
        botTurn,
        analysis: recommendations,
        highlights: presentation,
        onNewGame() {},
        onShowHistory() {},
      }),
      createElement(CoachPanel, {
        game,
        onPlayMove(from, to, promotion) {
          if (botTurn) return;
          preview.clearPreview();
          game.playMove(from, to, promotion);
        },
        preview,
        computer,
        opponent: { turn: botTurn, busy: false, state: "idle", retry() {} },
        recommendations,
        presentation,
        feedback: null,
        feedbackPly: 0,
        onReviewRetry() {},
        onCalculate() {},
        onNewGame() {},
        onShowHistory() {},
      }),
    );
  }
  await act(() => root.render(createElement(Harness)));
  const document = dom.window.document;
  const boardPanel = document.querySelector(".board-panel")!;
  const board = document.getElementById("board")!;
  return {
    dom,
    document,
    boardPanel,
    board,
    candidates,
    get game() {
      return currentGame;
    },
    get computer() {
      return currentComputer;
    },
    get preview() {
      return preview;
    },
    get scrolls() {
      return scrolls;
    },
    setMobile(value: boolean) {
      mobile = value;
    },
  };
}

test("the board turn selector follows the displayed position and preserves editing safeguards", async (t) => {
  const view = await renderWorkspace(t);
  const { dom, document, boardPanel, candidates } = view;
  const select = boardPanel.querySelector<HTMLSelectElement>(
    '.board-toolbar select[aria-label="Who plays next"]',
  )!;
  const choose = async (color: "w" | "b") => {
    await act(() => {
      select.value = color;
      select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
  };
  assert.ok(select);
  assert.equal(document.querySelector(".coach-panel .turn-select"), null);
  assert.equal(select.selectedOptions[0].textContent, "White to move");
  const liveFen = view.game.fen;
  await act(() => view.preview.inspectMove(candidates[0], 1, "click"));
  assert.equal(select.value, "b");
  assert.equal(select.disabled, true);
  assert.ok(select.parentElement!.classList.contains("is-black"));
  assert.equal(view.game.fen, liveFen);
  await act(() => view.preview.clearPreview());
  assert.equal(select.value, "w");
  assert.equal(select.disabled, false);

  await choose("b");
  assert.equal(view.game.positionGame.turn(), "b");
  assert.equal(select.selectedOptions[0].textContent, "Black to move");
  await choose("w");
  await act(() => view.game.playMove("e2", "e4"));
  assert.equal(select.value, "b");
  assert.ok(select.title.includes("clears the move history"));
  await choose("w");
  assert.equal(view.game.history.length, 0);
  assert.equal(view.game.positionGame.get("e4")?.type, "p");
  assert.equal(select.parentElement!.classList.contains("is-black"), false);

  await act(() => {
    view.computer.setSide("b");
    view.computer.setEnabled(true);
  });
  assert.equal(
    select.disabled,
    true,
    "the computer turn cannot be changed mid-search",
  );
  await act(() => view.computer.setOpen(true));
  assert.equal(
    select.disabled,
    false,
    "pausing the computer allows position editing",
  );
  await act(() => view.game.setBoardPosition({}, "b", ""));
  await choose("w");
  assert.equal(view.game.draft?.turn, "w");
});

test("hovered and pinned previews preserve board structure and square highlights", async (t) => {
  const view = await renderWorkspace(t);
  const { dom, document, boardPanel: left, board, candidates } = view;
  const coordinateLabels = () => ({
    ranks: left.querySelector(".rank-labels")!.textContent,
    files: left.querySelector(".file-labels")!.textContent,
  });
  assert.deepEqual(coordinateLabels(), {
    ranks: "87654321",
    files: "abcdefgh",
  });
  assert.equal(
    left.querySelectorAll(".square .rank-labels, .square .file-labels").length,
    0,
    "coordinate labels must sit outside the piece squares",
  );
  const leftText = () => {
    const clone = left.cloneNode(true) as Element;
    clone.querySelector(".eval-number")!.remove();
    clone.querySelector(".board-preview-controls")?.remove();
    return clone.textContent;
  };
  const initialText = leftText();
  const initialChildren = Array.from(board.children);
  const initialToolbar = left.querySelector(".board-toolbar")!.textContent;
  const arrowFrames = () =>
    Array.from(left.querySelectorAll(".move-arrow line"), (line) =>
      ["x1", "y1", "x2", "y2"].map((attribute) =>
        Number(line.getAttribute(attribute)),
      ),
    );
  const initialArrows = arrowFrames();
  assert.equal(initialArrows.length, 1);
  assert.equal(
    left.querySelector(".move-arrow line")!.getAttribute("marker-end"),
    "url(#arrowhead)",
  );
  const link = document.querySelector<HTMLButtonElement>(".strategy-card .plan-preview")!;
  for (const action of ["hover", "click"] as const) {
    await act(() => {
      if (action === "hover")
        link.dispatchEvent(
          new dom.window.MouseEvent("mouseover", { bubbles: true }),
        );
      else link.click();
    });
    assert.equal(view.preview.boardPreview, true);
    assert.equal(view.preview.pinned, action === "click");
    assert.equal(document.querySelectorAll(".best-move-heading").length, 1);
    assert.deepEqual(Array.from(board.children), initialChildren);
    assert.equal(
      leftText(),
      initialText,
      "previews must not replace the board or its controls",
    );
    assert.equal(
      left.querySelectorAll(".board-preview-actions > button").length,
      action === "click" ? 3 : 0,
    );
    assert.equal(left.querySelector(".board-toolbar")!.textContent, initialToolbar);
    assert.equal(left.querySelectorAll(".square").length, 64);
    assert.ok(left.querySelectorAll(".strategy-square").length > 0);
    assert.ok(left.querySelector(".explanation-arrows"));
    assert.equal(
      arrowFrames().length,
      candidates[0].explanationFocus!.arrows.length,
    );
    assert.equal(
      view.scrolls,
      0,
      "preview interactions must preserve the scroll position",
    );
  }
  const previewArrows = arrowFrames();
  const flip = left.querySelector<HTMLButtonElement>(".flip-board-button")!;
  await act(() => flip.click());
  assert.deepEqual(coordinateLabels(), {
    ranks: "12345678",
    files: "hgfedcba",
  });
  arrowFrames().forEach((coordinates, arrow) =>
    coordinates.forEach((value, coordinate) =>
      assert.ok(
        Math.abs(value - (800 - previewArrows[arrow][coordinate])) < 1e-9,
        "flipping the board must rotate every explanation arrow",
      ),
    ),
  );
  await act(() => flip.click());
  const exit = document.querySelector<HTMLButtonElement>(
    ".board-preview-controls .preview-return",
  )!;
  await act(() => exit.click());
  assert.equal(view.preview.boardPreview, false);
  assert.equal(left.querySelector(".board-preview-controls"), null);
  assert.equal(left.querySelector(".explanation-arrows"), null);
  assert.deepEqual(arrowFrames(), initialArrows);
  assert.equal(leftText(), initialText);
  const source = document.querySelector<HTMLElement>(
    '.best-move-heading [data-square-reference="g1"]',
  )!;
  const destination = document.querySelector<HTMLElement>(
    '.best-move-heading [data-square-reference="f3"]',
  )!;
  const highlighted = () =>
    Array.from(left.querySelectorAll(".reference-square"), (square) =>
      square.getAttribute("data-square"),
    );
  await act(() => source.focus());
  assert.deepEqual(highlighted(), ["g1"]);
  await act(() =>
    destination.dispatchEvent(
      new dom.window.MouseEvent("mouseover", { bubbles: true }),
    ),
  );
  assert.deepEqual(highlighted(), ["f3"]);
  assert.deepEqual(Array.from(board.children), initialChildren);
  assert.equal(leftText(), initialText);
  assert.equal(view.scrolls, 0);
  assert.equal(view.preview.boardPreview, false);
  await act(() =>
    destination.dispatchEvent(
      new dom.window.MouseEvent("mouseout", {
        bubbles: true,
        relatedTarget: source,
      }),
    ),
  );
  assert.deepEqual(
    highlighted(),
    ["g1"],
    "leaving a hover restores the focused square",
  );
  await act(() => flip.click());
  assert.deepEqual(
    highlighted(),
    ["g1"],
    "flipping preserves the referenced square",
  );
  await act(() =>
    document.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Escape" }),
    ),
  );
  assert.deepEqual(highlighted(), []);
  await act(() =>
    destination.dispatchEvent(
      new dom.window.MouseEvent("mouseover", { bubbles: true }),
    ),
  );
  await act(() => view.game.playMove("e2", "e4"));
  assert.deepEqual(
    highlighted(),
    [],
    "changing the position clears old square references",
  );
});

test("mobile preview controls navigate without changing the game and reveal an offscreen board", async (t) => {
  const view = await renderWorkspace(t);
  const { dom, document, boardPanel, candidates } = view;
  const liveFen = view.game.fen;
  await act(() =>
    document.querySelector<HTMLButtonElement>(".strategy-card .plan-preview")!.click(),
  );
  assert.equal(view.preview.pinned, true);
  assert.equal(view.preview.inspection?.ply, 1);
  const previous = boardPanel.querySelector<HTMLButtonElement>(
    '[aria-label="Previous preview move"]',
  )!;
  const next = boardPanel.querySelector<HTMLButtonElement>(
    '[aria-label="Next preview move"]',
  )!;
  assert.equal(previous.disabled, true);
  await act(() => next.click());
  assert.equal(view.preview.inspection?.ply, 2);
  assert.equal(next.disabled, true);
  await act(() => previous.click());
  assert.equal(view.preview.inspection?.ply, 1);
  assert.equal(
    view.preview.inspection?.focus,
    candidates[0].explanationFocus,
    "returning to the first step restores its explanation arrows",
  );
  await act(() =>
    boardPanel.querySelector<HTMLButtonElement>(".preview-return")!.click(),
  );
  assert.equal(boardPanel.querySelector(".board-preview-controls"), null);
  assert.equal(view.preview.boardPreview, false);
  assert.equal(view.scrolls, 0, "a visible board does not need scrolling");

  boardPanel.querySelector(".board-with-eval")!.getBoundingClientRect = () =>
    new dom.window.DOMRect(0, -100, 320, 324);
  await act(() => view.preview.inspectMove(candidates[0], 1, "hover"));
  assert.equal(view.scrolls, 0, "hover previews must never scroll the page");
  await act(() => view.preview.inspectMove(candidates[0], 1, "click"));
  assert.equal(view.scrolls, 1, "a pinned mobile preview reveals an offscreen board");
  const controls = boardPanel.querySelector(".board-preview-controls");
  const controlsText = controls!.textContent;
  await act(() => view.preview.inspectMove(candidates[0], 2, "hover"));
  assert.equal(view.preview.inspection?.ply, 2);
  assert.equal(view.preview.pinnedInspection?.ply, 1);
  assert.equal(boardPanel.querySelector(".board-preview-controls"), controls);
  assert.equal(controls!.textContent, controlsText);
  assert.equal(view.scrolls, 1, "hovering over a pinned preview must not scroll");
  await act(() => view.preview.inspectMove(candidates[0], 0, "hover"));
  assert.equal(view.preview.pinned, true);
  assert.equal(view.scrolls, 1, "restoring a pinned preview must not scroll");
  await act(() => view.preview.clearPreview());
  assert.equal(view.preview.pinnedInspection, null);
  view.setMobile(false);
  await act(() => view.preview.inspectMove(candidates[0], 1, "click"));
  assert.equal(view.scrolls, 1, "desktop previews preserve scroll position");
  await act(() => view.preview.clearPreview());
  assert.equal(view.game.fen, liveFen);
  assert.equal(view.game.history.length, 0);
});

test("position editing preserves the game until a suggested move is played", async (t) => {
  const view = await renderWorkspace(t);
  const { document, boardPanel } = view;
  const liveFen = view.game.fen;
  const edit = boardPanel.querySelector<HTMLButtonElement>(".position-editor-toggle")!;
  for (const id of edit.getAttribute("aria-controls")!.split(" "))
    assert.ok(document.getElementById(id), "every controlled editor region must exist");
  await act(() => edit.click());
  assert.equal(edit.getAttribute("aria-expanded"), "true");
  await act(() =>
    boardPanel.querySelector<HTMLButtonElement>('[aria-label="Place White knight"]')!.click(),
  );
  assert.equal(view.game.tool, "wn");
  await act(() => edit.click());
  assert.equal(edit.getAttribute("aria-expanded"), "false");
  assert.equal(view.game.tool, "move");

  assert.equal(view.game.fen, liveFen);
  assert.equal(view.game.history.length, 0);

  await act(() =>
    document.querySelector<HTMLButtonElement>(".strategy-card .primary-button")!.click(),
  );
  assert.equal(view.game.history.at(-1)?.san, "Nf3");
});

test("ready analysis keeps refresh secondary and alternatives visible; collapsing a move clears its preview", async (t) => {
  const view = await renderWorkspace(t, new Chess().fen(), [
    { rank: 1, depth: 15, cp: 30, pv: ["g1f3", "d7d5"] },
    { rank: 2, depth: 15, cp: 20, pv: ["e2e4", "e7e5"] },
  ]);
  const { document } = view;
  const refresh = document.querySelector<HTMLButtonElement>(".calculate-button")!;
  assert.equal(refresh.getAttribute("aria-label"), "Refresh analysis");
  assert.equal(refresh.closest(".coach-header-actions")?.parentElement?.className, "coach-header");
  assert.equal(document.querySelector(".calculation-controls"), null);
  assert.equal(refresh.classList.contains("primary-button"), false);
  const score = document.querySelector(".strategy-card .suggested-move-header .score-pill")!;
  assert.equal(score.textContent, "+0.30");
  assert.equal(score.getAttribute("aria-label"), "Position score: +0.30");
  assert.equal(document.querySelector(".strategy-card .candidate-piece img")!.getAttribute("src"), "/pieces/wN.svg");
  assert.equal(document.querySelector(".position-details"), null);
  const alternatives = document.querySelector<HTMLElement>(".alternative-moves")!;
  assert.equal(alternatives.querySelector("h3")!.textContent, "Other good moves");
  assert.equal(alternatives.querySelectorAll(".candidate-toggle").length, 1);
  assert.equal(alternatives.querySelector(".candidate-title")!.textContent, "Pawn from e2 to e4");
  assert.equal(alternatives.querySelector(".move-strategy-tag")!.textContent, "Claim the center");
  assert.equal(alternatives.querySelector(".candidate-piece img")!.getAttribute("src"), "/pieces/wP.svg");
  assert.match(alternatives.querySelector(".candidate-toggle")!.getAttribute("aria-label")!, /Position score: \+0\.20/);
  await act(() => document.querySelector<HTMLButtonElement>(".candidate-toggle")!.click());
  const explore = document.querySelector<HTMLButtonElement>(".candidate-body .plan-preview")!;
  await act(() => explore.click());
  assert.equal(view.preview.pinnedInspection?.candidate, view.candidates[1]);
  assert.equal(refresh.disabled, true, "refresh stays unavailable during a board preview");
  await act(() => document.querySelectorAll<HTMLButtonElement>(".candidate-body .continuation-moves button")[1].click());
  assert.equal(view.preview.pinnedInspection?.ply, 2);
  assert.equal(view.game.history.length, 0);
  await act(() => document.querySelector<HTMLButtonElement>(".candidate-toggle")!.click());
  assert.equal(view.preview.boardPreview, false, "collapsed move details must not leave a hidden preview pinned");
  assert.equal(alternatives.querySelectorAll(".candidate-toggle").length, 1);
});

test("quiet pawn suggestions retain action tags alongside specific strategy tags", async (t) => {
  const game = new Chess();
  game.move("e4");
  const view = await renderWorkspace(t, game.fen(), [
    { rank: 1, depth: 18, cp: -32, pv: ["e7e6"] },
    { rank: 2, depth: 18, cp: -33, pv: ["e7e5"] },
    { rank: 3, depth: 18, cp: -35, pv: ["c7c5"] },
    { rank: 4, depth: 18, cp: -41, pv: ["c7c6"] },
    { rank: 5, depth: 18, cp: -43, pv: ["d7d6"] },
  ]);
  assert.equal(view.document.querySelector(".strategy-card .move-strategy-tag")!.textContent, "Advance your pawn to e6");
  assert.equal(view.document.querySelector(".strategy-card > p"), null);
  assert.deepEqual(Array.from(view.document.querySelectorAll(".candidate-card .move-strategy-tag"), (tag) => tag.textContent), [
    "Claim the center", "Advance your pawn to c5", "Advance your pawn to c6", "Advance your pawn to d6",
  ]);
});

test("capture and check details stay outside move titles in cards and previews", async (t) => {
  const view = await renderWorkspace(t, "8/k5q1/8/8/8/8/6Q1/7K b - - 0 1", [
    { rank: 1, depth: 18, cp: -24, pv: ["g7f7"] },
    { rank: 2, depth: 18, cp: -26, pv: ["g7g2", "h1g2"] },
  ]);
  const { document } = view;
  assert.equal(document.querySelector(".candidate-title")!.textContent, "Queen from g7 to g2");
  assert.equal(document.querySelector(".candidate-card .move-strategy-tag")!.textContent, "Capture with check");
  await act(() => document.querySelector<HTMLButtonElement>(".candidate-toggle")!.click());
  const explanation = document.querySelector(".candidate-body .move-explanation")!;
  assert.match(explanation.textContent!, /queen takes their queen on g2/);
  assert.match(explanation.textContent!, /gives check/);
  await act(() => document.querySelector<HTMLButtonElement>(".candidate-body .plan-preview")!.click());
  assert.equal(document.querySelector(".continuation-description")!.textContent, "Queen from g7 to g2");
  assert.equal(document.querySelector(".board-preview-controls > p")!.textContent, "Queen from g7 to g2");
});

test("only check and undefended attacks show warnings above the suggested move", async (t) => {
  const cases = [
    { name: "check", fen: "k3r3/8/8/8/1b6/8/8/4K3 w - - 0 1", pv: ["e1f1"], prominent: true },
    { name: "undefended", fen: "4r2k/1b6/8/8/4Q3/8/8/6K1 w - - 0 1", pv: ["e4f4"], prominent: true },
    { name: "defended", fen: "4r2k/8/8/8/4P3/3P4/8/6K1 w - - 0 1", pv: ["g1f1"], prominent: false },
    { name: "Black", fen: "7k/8/8/4q3/8/8/8/4R2K b - - 0 1", pv: ["e5f5"], prominent: true },
  ];
  for (const fixture of cases) await t.test(fixture.name, async (t) => {
    const view = await renderWorkspace(t, fixture.fen, [{ rank: 1, depth: 15, cp: 450, pv: fixture.pv }]);
    const warnings = view.document.querySelectorAll(".strategy-warning");
    assert.equal(warnings.length, fixture.prominent ? 1 : 0);
    if (fixture.prominent)
      assert.ok(warnings[0].compareDocumentPosition(view.document.querySelector(".strategy-card")!) & 4);
  });
});

test("calculating on mobile reveals the coach; desktop calculation preserves the viewport", async (t) => {
  const { root, dom } = createTestRoot(t);
  let mobile = true;
  const scrolled: string[] = [];
  Object.defineProperty(dom.window, "matchMedia", {
    value: (query: string) => ({ matches: query === "(max-width: 900px)" && mobile }),
  });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {
    scrolled.push(this.id);
  };
  let callbacks!: Parameters<AnalysisEngine["analyze"]>[1];
  t.mock.method(AnalysisEngine.prototype, "analyze", (_fen: string, next: typeof callbacks) => {
    callbacks = next;
    return () => {};
  });
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  const clickCalculate = () => document.querySelector<HTMLButtonElement>(".calculate-button")!.click();
  await act(clickCalculate);
  assert.deepEqual(scrolled, ["coach"]);
  assert.equal(document.querySelector(".score-pill"), null);
  assert.equal(document.querySelector<HTMLButtonElement>(".refresh-analysis")!.disabled, true);
  assert.equal(document.querySelector(".calculation-controls"), null);
  await act(() => callbacks.onComplete([{ rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5"] }]));
  assert.equal(document.querySelectorAll(".best-move-heading").length, 1);
  assert.equal(document.querySelector(".refresh-analysis")!.getAttribute("aria-label"), "Refresh analysis");
  mobile = false;
  await act(clickCalculate);
  assert.equal(document.querySelector<HTMLButtonElement>(".refresh-analysis")!.disabled, true);
  assert.equal(document.querySelector(".calculation-controls"), null);
  assert.deepEqual(scrolled, ["coach"], "desktop refresh should not move the viewport");
});

test("the suggestion, board arrow, exploration, and Play use the engine's final move", async (t) => {
  const { root, dom } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  const requests: Parameters<AnalysisEngine["analyze"]>[] = [];
  t.mock.method(AnalysisEngine.prototype, "analyze", (...args: Parameters<AnalysisEngine["analyze"]>) => {
    requests.push(args);
    return () => {};
  });
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  const click = async (selector: string) => {
    const button = document.querySelector<HTMLButtonElement>(selector);
    assert.ok(button, selector);
    await act(() => button.click());
  };
  await click(".calculate-button");
  await act(() => requests[0][1].onComplete([
    { rank: 1, depth: 12, cp: 30, pv: ["e2e4", "e7e5"] },
    { rank: 2, depth: 12, cp: 25, pv: ["g1f3", "g8f6"] },
    { rank: 3, depth: 12, cp: 20, pv: ["d2d4", "d7d5"] },
    { rank: 4, depth: 12, cp: 18, pv: ["c2c4", "e7e5"] },
    { rank: 5, depth: 12, cp: 15, pv: ["e2e3", "e7e5"] },
  ], "g1f3", { rank: 1, depth: 13, cp: 40, pv: ["g1f3", "d7d5"] }));
  assert.equal(document.querySelector(".best-move-heading")?.textContent, "Knight from g1 to f3");
  assert.equal(document.querySelector(".score-pill")?.textContent, "+0.40");
  assert.deepEqual(Array.from(document.querySelectorAll(".candidate-title"), (title) => title.textContent), [
    "Pawn from e2 to e4", "Pawn from d2 to d4", "Pawn from c2 to c4", "Pawn from e2 to e3",
  ]);
  assert.equal(document.querySelector(".move-arrow line")?.getAttribute("x1"), "650");
  assert.equal(document.querySelector(".move-arrow line")?.getAttribute("y1"), "750");
  await click(".strategy-card .plan-preview");
  assert.ok(document.querySelector('[data-square="f3"] img[src="/pieces/wN.svg"]'));
  assert.match(document.querySelector(".continuation-moves")?.textContent ?? "", /d5/);
  assert.equal((document.querySelector(".move-history")?.textContent ?? "").includes("Nf3"), false);
  await click(".preview-return");
  await click('[aria-label="Play best move Nf3"]');
  assert.ok(document.querySelector('[data-square="f3"] img[src="/pieces/wN.svg"]'));
  assert.equal(document.querySelector('[data-square="g1"] img'), null);
  assert.match(document.querySelector(".move-history")?.textContent ?? "", /Nf3/);
  assert.equal(document.querySelector(".best-move-heading"), null);
  assert.equal(document.querySelector(".score-pill"), null);
});
