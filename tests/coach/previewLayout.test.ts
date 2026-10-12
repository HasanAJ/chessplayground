import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import { BoardPanel } from "../../src/features/board/BoardPanel";
import { useBoardInteractions } from "../../src/features/board/useBoardInteractions";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { SquareHighlightProvider } from "../../src/features/board/SquareHighlight";
import { useComputerSettings } from "../../src/features/computer/useComputerOpponent";
import { useGameController } from "../../src/features/game/useGameController";
import { candidatesFor } from "../../src/features/coach/candidates";
import { CoachPanel } from "../../src/features/coach/CoachPanel";
import { useCoachPresentation } from "../../src/features/coach/useCoachPresentation";
import type { Recommendations } from "../../src/features/coach/useRecommendations";
import { createTestRoot } from "../helpers/dom";

async function renderWorkspace(t: TestContext) {
  const { root, dom } = createTestRoot(t);
  let mobile = true;
  Object.defineProperty(dom.window, "matchMedia", {
    value: (query: string) => ({
      matches: query === "(max-width: 900px)" && mobile,
    }),
  });
  let scrolls = 0;
  dom.window.HTMLElement.prototype.scrollIntoView = () => scrolls++;
  const candidates = candidatesFor(new Chess().fen(), [
    { rank: 1, depth: 15, cp: 30, pv: ["g1f3", "d7d5"] },
  ]);
  let preview!: ReturnType<typeof useBoardPreview>;
  let currentGame!: ReturnType<typeof useGameController>;
  function Harness() {
    const computer = useComputerSettings();
    const game = useGameController(computer.disable);
    currentGame = game;
    preview = useBoardPreview(game.analysisKey, game.playable);
    const board = useBoardInteractions(game, preview, computer, false);
    const recommendations: Recommendations = {
      candidates,
      best: candidates[0],
      thinking: false,
      requested: true,
      current: true,
      analysis: {
        key: game.analysisKey,
        candidates,
        depth: 15,
        state: "ready",
      },
      continuity: false,
      calculate() {},
      clear() {},
    };
    const presentation = useCoachPresentation(game, recommendations, preview);
    return createElement(
      SquareHighlightProvider,
      { positionKey: game.analysisKey, children: null },
      createElement(BoardPanel, {
        game,
        board,
        preview,
        computer,
        analysis: recommendations,
        highlights: presentation,
        onNewGame() {},
        onShowHistory() {},
      }),
      createElement(CoachPanel, {
        game,
        board,
        preview,
        computer,
        opponent: { turn: false, busy: false, state: "idle", retry() {} },
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
    clone.querySelector(".mobile-coach-summary")?.remove();
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
  const link = document.querySelector<HTMLButtonElement>(".explanation-link")!;
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
    assert.deepEqual(Array.from(board.children), initialChildren);
    assert.equal(
      leftText(),
      initialText,
      "previews must not replace the board or its controls",
    );
    assert.equal(
      left.querySelectorAll(".board-preview-controls button").length,
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
  assert.doesNotMatch(
    document.body.textContent!,
    /Scores use pawn units|Tap underlined chess terms/,
  );

  const source = document.querySelector<HTMLElement>(
    '.strategy-card > .move-description [data-square-reference="g1"]',
  )!;
  const destination = document.querySelector<HTMLElement>(
    '.strategy-card > .move-description [data-square-reference="f3"]',
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
  const { dom, boardPanel, candidates } = view;
  const liveFen = view.game.fen;
  await act(() =>
    boardPanel.querySelector<HTMLButtonElement>(".mobile-coach-summary .plan-preview")!.click(),
  );
  assert.equal(view.preview.pinned, true);
  assert.equal(view.preview.inspection?.ply, 2);
  const previous = boardPanel.querySelector<HTMLButtonElement>(
    '[aria-label="Previous preview move"]',
  )!;
  const next = boardPanel.querySelector<HTMLButtonElement>(
    '[aria-label="Next preview move"]',
  )!;
  assert.equal(next.disabled, true);
  await act(() => previous.click());
  assert.equal(view.preview.inspection?.ply, 1);
  assert.equal(previous.disabled, true);
  await act(() => next.click());
  assert.equal(view.preview.inspection?.ply, 2);
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
  await act(() => view.preview.clearPreview());
  view.setMobile(false);
  await act(() => view.preview.inspectMove(candidates[0], 1, "click"));
  assert.equal(view.scrolls, 1, "desktop previews preserve scroll position");
  await act(() => view.preview.clearPreview());
  assert.equal(view.game.fen, liveFen);
  assert.equal(view.game.history.length, 0);
});

test("position editing and analysis disclosures preserve the game until a move is played", async (t) => {
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

  const more = document.querySelector<HTMLButtonElement>(".analysis-details-toggle")!;
  await act(() => more.click());
  assert.equal(more.getAttribute("aria-expanded"), "true");
  assert.ok(document.querySelector(".additional-analysis.is-open"));
  await act(() => more.click());
  assert.equal(more.getAttribute("aria-expanded"), "false");
  assert.equal(view.game.fen, liveFen);
  assert.equal(view.game.history.length, 0);

  await act(() => more.click());
  await act(() =>
    boardPanel.querySelector<HTMLButtonElement>(".mobile-coach-summary .primary-button")!.click(),
  );
  assert.equal(view.game.history.at(-1)?.san, "Nf3");
  assert.equal(more.getAttribute("aria-expanded"), "false");
});
