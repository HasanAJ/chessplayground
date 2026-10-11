import test from "node:test";
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

test("hovered and pinned previews keep the board panel stable without scrolling", async (t) => {
  const { root, dom } = createTestRoot(t);
  Object.defineProperty(dom.window, "matchMedia", {
    value: () => ({ matches: true }),
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
  const left = document.querySelector(".board-panel")!;
  const board = document.getElementById("board")!;
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
    return clone.textContent;
  };
  const initialText = leftText();
  const initialChildren = Array.from(board.children);
  const initialButtonCount = left.querySelectorAll("button").length;
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
    assert.equal(preview.boardPreview, true);
    assert.equal(preview.pinned, action === "click");
    assert.deepEqual(Array.from(board.children), initialChildren);
    assert.equal(
      leftText(),
      initialText,
      "previews must not add board-panel copy",
    );
    assert.equal(left.querySelectorAll("button").length, initialButtonCount);
    assert.equal(left.querySelectorAll(".square").length, 64);
    assert.ok(left.querySelectorAll(".strategy-square").length > 0);
    assert.ok(left.querySelector(".explanation-arrows"));
    assert.equal(
      arrowFrames().length,
      candidates[0].explanationFocus!.arrows.length,
    );
    assert.equal(
      scrolls,
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
    ".coach-preview-exit",
  )!;
  assert.ok(exit.closest(".coach-panel"));
  await act(() => exit.click());
  assert.equal(preview.boardPreview, false);
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
  assert.equal(scrolls, 0);
  assert.equal(preview.boardPreview, false);
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
  await act(() => currentGame.playMove("e2", "e4"));
  assert.deepEqual(
    highlighted(),
    [],
    "changing the position clears old square references",
  );
});
