import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import type { EngineLine } from "../../src/engine/uci";
import { createTestRoot } from "../helpers/dom";

async function mount(t: TestContext) {
  const { root, dom } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  dom.window.HTMLElement.prototype.animate = () =>
    ({ cancel() {}, onfinish: null }) as unknown as Animation;
  const requests: Parameters<AnalysisEngine["analyze"]>[] = [];
  t.mock.method(AnalysisEngine.prototype, "analyze", (...args: typeof requests[number]) => {
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
  return {
    document,
    requests,
    click,
    async complete(index: number, lines: EngineLine[], bestMove?: string) {
      await act(() => requests[index][1].onComplete(lines, bestMove));
    },
    bar: () => document.querySelector(".eval-number")!.textContent,
    reviewScore: () => document.querySelector(".feedback-position-score strong")?.textContent,
  };
}

test("reviews update the card and bar without another search; calculated scores take priority", async (t) => {
  const view = await mount(t);
  const { document, requests, click, complete, bar, reviewScore } = view;
  assert.equal(bar(), "—");
  await click('[data-square="e2"]');
  await click('[data-square="e4"]');
  assert.equal(bar(), "—");
  assert.equal(reviewScore(), undefined);
  await complete(0, [{ rank: 1, depth: 18, cp: 60, pv: ["e2e4", "e7e5"] }]);
  await complete(1, [{ rank: 1, depth: 18, cp: -37, pv: ["e7e5", "g1f3"] }]);
  assert.equal(reviewScore(), "+0.37", "use the resulting position, not the initial +0.60");
  assert.equal(document.querySelector(".feedback-position-score span")!.textContent, "Position score");
  assert.equal(document.querySelector(".feedback-heading .score-pill"), null);
  assert.ok(document.querySelector(".feedback-body > .feedback-position-score"));
  assert.equal(bar(), "+0.4");
  assert.equal(document.querySelector(".eval-track")!.getAttribute("aria-label"), "White evaluation +0.37");
  assert.ok(parseFloat(document.querySelector<HTMLElement>(".eval-white")!.style.height) > 50);
  assert.equal(requests.length, 2, "the existing review searches supply both scores");

  await click(".calculate-button");
  assert.equal(bar(), "+0.4", "retain the matching review while calculating");
  assert.equal(document.querySelector(".move-feedback"), null);
  await complete(2, [{ rank: 1, depth: 24, cp: -73, pv: ["e7e5", "g1f3"] }]);
  assert.equal(bar(), "+0.7");
  assert.equal(requests.length, 3);
  await click(".strategy-card .plan-preview");
  assert.equal(bar(), "—");
  assert.equal(document.querySelector(".eval-track")!.getAttribute("aria-label"), "Evaluation paused during board preview");
  await click(".preview-return");
  assert.equal(bar(), "+0.7");

  await click('[data-square="e7"]');
  await click('[data-square="e5"]');
  assert.equal(bar(), "—", "a new position cannot inherit the old score");
  assert.equal(reviewScore(), undefined);
  await complete(3, [{ rank: 1, depth: 18, cp: 30, pv: ["e7e6", "d2d4"] }]);
  await complete(4, [
    { rank: 1, depth: 20, cp: 30, pv: ["e7e6", "d2d4"] },
    { rank: 2, depth: 20, cp: 20, pv: ["e7e5"] },
  ]);
  assert.equal(reviewScore(), "−0.20", "the played line supplies a score even without a reply preview");
  assert.equal(bar(), "−0.2");
  assert.ok(parseFloat(document.querySelector<HTMLElement>(".eval-white")!.style.height) < 50);
  assert.equal(requests.length, 5);

  await click('[aria-label="Previous game move"]');
  assert.equal(bar(), "+0.4", "history restores the review for the selected position");
  assert.equal(requests.length, 5);
  await click('[aria-label="Previous game move"]');
  assert.equal(bar(), "—");
  await click('[aria-label="Next game move"]');
  assert.equal(bar(), "+0.4");
  await click('[aria-label="New game"]');
  assert.equal(bar(), "—");
  assert.equal(document.querySelector(".move-feedback"), null);
  assert.equal(requests.length, 5);
});

test("retained human feedback does not score the board after a computer reply", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const { document, requests, click, complete, bar, reviewScore } = await mount(t);
  await click(".computer-toggle");
  await click('[data-square="e2"]');
  await click('[data-square="e4"]');
  await complete(0, [], "e7e5");
  await act(() => t.mock.timers.tick(1000));
  await complete(1, [{ rank: 1, depth: 18, cp: 20, pv: ["e2e4", "c7c5"] }]);
  await complete(2, [{ rank: 1, depth: 18, cp: 90, pv: ["c7c5", "g1f3"] }]);
  assert.equal(reviewScore(), "−0.90");
  assert.equal(bar(), "—", "the human review belongs to the preceding position");
  assert.equal(document.querySelector(".feedback-context")!.textContent, "Your last move");
  assert.equal(requests.length, 3);
  await click('[aria-label="Previous game move"]');
  assert.equal(bar(), "−0.9", "the same cached score applies when its position is selected");
  await click('[aria-label="Next game move"]');
  assert.equal(bar(), "—");
  assert.equal(requests.length, 3, "showing scores adds no engine searches");
});
