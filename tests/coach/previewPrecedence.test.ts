import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import { START_FEN } from "../../src/domain/chess/position.ts";
import { useBoardPreview } from "../../src/ui/board/useBoardPreview.ts";
import { createTestRoot } from "../helpers/dom.ts";

test("an invalid hover frame cannot hide a valid pinned preview", async (t) => {
  const { root } = createTestRoot(t);
  const [candidate] = candidatesFor(START_FEN, [
    { rank: 1, depth: 10, cp: 20, pv: ["e2e4", "e7e5"] },
  ]);
  let preview!: ReturnType<typeof useBoardPreview>;
  function Harness() {
    preview = useBoardPreview("position", true);
    return null;
  }
  await act(() => root.render(createElement(Harness)));
  await act(() => preview.inspectMove(candidate, 1, "click"));
  await act(() => preview.inspectMove(candidate, 99, "hover"));
  assert.equal(preview.pinned, true);
  assert.equal(preview.inspectionMove?.lan, "e2e4");
  await act(() => preview.clearInspection(candidate, "hover"));
  assert.equal(preview.pinned, true);
});
