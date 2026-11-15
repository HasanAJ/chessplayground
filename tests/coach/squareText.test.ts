import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import {
  SquareHighlightProvider,
  SquareText,
  useHighlightedSquare,
  useHighlightedMove,
} from "../../src/ui/board/SquareHighlight.tsx";
import { createTestRoot } from "../helpers/dom.ts";

test("square references preserve prose and recognize coordinates, captures, disambiguation and promotion", async (t) => {
  const { root, dom } = createTestRoot(t);
  const text =
    "King e1 to g1, rook h1 to f1. Nf3, Nbd2, R1e2, exd5, Qh4#, e8=Q+. Ignore a0, i4, a9 and abc3.";
  await act(() => root.render(createElement(SquareText, { text })));
  assert.equal(dom.window.document.getElementById("root")!.textContent, text);
  assert.deepEqual(
    Array.from(
      dom.window.document.querySelectorAll(".square-reference"),
      (el) => [el.textContent, el.getAttribute("data-square-reference")],
    ),
    [
      ["e1", "e1"],
      ["g1", "g1"],
      ["h1", "h1"],
      ["f1", "f1"],
      ["Nf3", "f3"],
      ["Nbd2", "d2"],
      ["R1e2", "e2"],
      ["exd5", "d5"],
      ["Qh4#", "h4"],
      ["e8=Q+", "e8"],
    ],
  );
});

test("move references clear on Escape, replacement, and a change of position", async (t) => {
  const { root, dom } = createTestRoot(t);
  let positionKey = "position";
  let move = new Chess().move("Nf3");
  function Probe() {
    return createElement("output", null, useHighlightedMove()?.lan);
  }
  function Harness() {
    return createElement(
      SquareHighlightProvider,
      { positionKey, children: null },
      createElement(SquareText, { text: "Nf3", move }),
      createElement(Probe),
    );
  }
  await act(() => root.render(createElement(Harness)));
  const document = dom.window.document;
  const hover = () =>
    act(() =>
      document
        .querySelector(".square-reference")!
        .dispatchEvent(
          new dom.window.MouseEvent("mouseover", { bubbles: true }),
        ),
    );
  const highlighted = () => document.querySelector("output")!.textContent;
  await hover();
  assert.equal(highlighted(), "g1f3");
  await act(() =>
    document.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Escape" }),
    ),
  );
  assert.equal(highlighted(), "");
  await hover();
  move = new Chess("4k3/8/8/8/8/8/3N4/4K3 w - - 0 1").move("Nf3");
  await act(() => root.render(createElement(Harness)));
  assert.equal(
    highlighted(),
    "",
    "a replacement move clears the old path even when the text is unchanged",
  );
  await hover();
  assert.equal(highlighted(), "d2f3");
  positionKey = "next-position";
  await act(() => root.render(createElement(Harness)));
  assert.equal(highlighted(), "");
});

test("removing or replacing highlighted text clears it without clearing another reference", async (t) => {
  const { root, dom } = createTestRoot(t);
  let shown = true;
  let text = "e4";
  function Probe() {
    return createElement("output", null, useHighlightedSquare());
  }
  function Harness() {
    return createElement(
      SquareHighlightProvider,
      { positionKey: "position", children: null },
      shown && createElement(SquareText, { text }),
      createElement(SquareText, { text: "d5", focusable: false }),
      createElement(Probe),
    );
  }
  await act(() => root.render(createElement(Harness)));
  const document = dom.window.document;
  const hover = async (square: string) =>
    act(() =>
      document
        .querySelector(`[data-square-reference="${square}"]`)!
        .dispatchEvent(
          new dom.window.MouseEvent("mouseover", { bubbles: true }),
        ),
    );
  await hover("e4");
  assert.equal(document.querySelector("output")!.textContent, "e4");
  text = "c4";
  await act(() => root.render(createElement(Harness)));
  assert.equal(document.querySelector("output")!.textContent, "");
  await hover("d5");
  shown = false;
  await act(() => root.render(createElement(Harness)));
  assert.equal(document.querySelector("output")!.textContent, "d5");
  assert.equal(
    document
      .querySelector('[data-square-reference="d5"]')!
      .hasAttribute("tabindex"),
    false,
  );
});
