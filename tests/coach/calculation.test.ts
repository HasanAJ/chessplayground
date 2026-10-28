import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { createTestRoot } from "../helpers/dom";

test("Calculate and refresh use the two-second search without a mode selector", async (t) => {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  const requests: Parameters<AnalysisEngine["analyze"]>[] = [];
  t.mock.method(AnalysisEngine.prototype, "analyze", (...args: typeof requests[number]) => {
    requests.push(args);
    return () => {};
  });
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  assert.equal(document.querySelector(".search-mode-control"), null);
  const calculate = async () => {
    const button = document.querySelector<HTMLButtonElement>(".calculate-button")!;
    assert.equal(button.disabled, false);
    await act(() => button.click());
  };
  await calculate();
  assert.deepEqual(requests[0][3], { depth: null, movetime: 2000, multiPV: 5 });
  assert.equal(document.querySelector(".coach-status"), null);
  await act(() => requests[0][1].onComplete([
    { rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5"] },
  ], "e2e4"));
  assert.equal(document.querySelector(".best-move-heading")!.textContent, "Pawn from e2 to e4");
  await calculate();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1][3], { depth: null, movetime: 2000, multiPV: 5 });
});
