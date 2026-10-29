import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { moveDescription } from "../../src/chess/moves";
import { candidatesFor } from "../../src/features/coach/candidatePresentation";
import { BestMoveContent } from "../../src/features/coach/BestMoveContent";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { createTestRoot } from "../helpers/dom";

test("the best-move card has one descriptive title followed by the reason", () => {
  const candidate = candidatesFor(new Chess().fen(), [
    { rank: 1, depth: 15, pv: ["g1f3", "d7d5"] },
  ])[0];
  const html = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: false,
      preview: null,
      onInspect() {},
      onClearInspection() {},
      onPlay() {},
    }),
  );
  const text = html.replace(/<[^>]*>/g, "");
  const heading = html.match(/<h3\b[^>]*>(.*?)<\/h3>/s)![1].replace(/<[^>]*>/g, "");
  assert.equal(heading, "Knight from g1 to f3");
  assert.match(html, /class="move-strategy-tag"[^>]*>Bring another piece into play<\/span>/);
  assert.match(text, /attacks d4 and e5, helping you control the center/);
  assert.deepEqual(candidate.explanationFocus?.arrows, [
    { from: "f3", to: "d4" },
    { from: "f3", to: "e5" },
  ]);
});

test("move titles keep only the original piece and from/to squares for special moves", () => {
  const cases = [
    [
      "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
      "O-O",
      "King from e1 to g1",
    ],
    [
      "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
      "O-O-O",
      "King from e8 to c8",
    ],
    [
      "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
      "exd6",
      "Pawn from e5 to d6",
    ],
    [
      "4k3/8/8/8/3Pp3/8/8/4K3 b - d3 0 1",
      "exd3",
      "Pawn from e4 to d3",
    ],
    [
      "7k/P7/6K1/8/8/8/8/8 w - - 0 1",
      "a8=Q#",
      "Pawn from a7 to a8",
    ],
    ["7k/P7/8/8/8/8/8/4K3 w - - 0 1", "a8=N", "Pawn from a7 to a8"],
    ["8/k5q1/8/8/8/8/6Q1/7K b - - 0 1", "Qxg2+", "Queen from g7 to g2"],
  ] as const;
  for (const [fen, san, expected] of cases)
    assert.equal(moveDescription(new Chess(fen).move(san)), expected);
});

test("explanation highlights follow the actual checking pieces and defense", () => {
  const discovered = candidatesFor("4k3/8/8/8/8/8/4N3/K3R3 w - - 0 1", [
    { rank: 1, depth: 12, pv: ["e2c3"] },
  ])[0];
  assert.deepEqual(discovered.explanationFocus?.arrows, [
    { from: "e1", to: "e8" },
  ]);
  const defended = candidatesFor(
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    [{ rank: 1, depth: 12, pv: ["d2d3"] }],
  )[0];
  assert.deepEqual(defended.explanationFocus?.arrows, [
    { from: "d3", to: "e4" },
  ]);
  const openFile = candidatesFor("4k3/8/8/8/8/8/8/R3K3 w - - 0 1", [
    { rank: 1, depth: 12, pv: ["a1a2"] },
  ])[0];
  assert.equal(openFile.explanationFocus?.squares.length, 8);
  assert.match(openFile.explanation, /column/);
});

test("explanation previews pin the right board, survive blur, and clear on Escape and position changes", async (t) => {
  const { root, dom } = createTestRoot(t);
  const candidate = candidatesFor(new Chess().fen(), [
    { rank: 1, depth: 15, pv: ["g1f3", "d7d5"] },
  ])[0];
  let preview!: ReturnType<typeof useBoardPreview>;
  let key = "start";
  function Harness() {
    preview = useBoardPreview(key, true);
    return createElement(
      "section",
      null,
      createElement(BestMoveContent, {
        candidate,
        forcedMove: false,
        preview: preview.inspection,
        onInspect: preview.inspectMove,
        onClearInspection: preview.clearInspection,
        onPlay() {},
      }),
      createElement("button", { id: "outside" }, "Outside"),
    );
  }
  await act(() => root.render(createElement(Harness)));
  const link =
    dom.window.document.querySelector<HTMLButtonElement>(".plan-preview")!;
  await act(() =>
    preview.inspectMove(candidate, 1, "hover", candidate.explanationFocus),
  );
  await act(() => {
    link.focus();
    link.click();
  });
  await act(() => dom.window.document.getElementById("outside")!.focus());
  assert.equal(
    preview.pinned,
    true,
    "clicking an already hovered explanation must still pin it",
  );
  assert.equal(preview.previewGame?.get("f3")?.type, "n");
  assert.equal(preview.previewGame?.get("g1"), undefined);
  assert.equal(preview.inspection?.focus, candidate.explanationFocus);
  assert.equal(link.getAttribute("aria-expanded"), "true");
  await act(() => preview.inspectMove(candidate, 2, "click"));
  await act(() =>
    link.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true })),
  );
  assert.equal(preview.inspection?.ply, 2, "hovering Close must preserve the selected step");
  await act(() => link.focus());
  assert.equal(preview.inspection?.ply, 2, "focusing Close must preserve the selected step");
  await act(() =>
    dom.window.document.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Escape" }),
    ),
  );
  assert.equal(preview.inspection, null);
  await act(() => link.click());
  assert.equal(preview.inspection, null, "closing exploration clears its preview");
  await act(() => link.click());
  assert.equal(preview.pinned, true);
  key = "different-position";
  await act(() => root.render(createElement(Harness)));
  assert.equal(preview.inspection, null);
});
