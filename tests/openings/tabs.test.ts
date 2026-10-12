import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { SESSION_KEY } from "../../src/chess/study";
import { createTestRoot } from "../helpers/dom";

test("opening lessons preserve the saved game and cancel a pending computer move until Play resumes", async (t) => {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const requests: {
    callbacks: Parameters<AnalysisEngine["analyze"]>[1];
    options: Parameters<AnalysisEngine["analyze"]>[3];
    cancelled: boolean;
  }[] = [];
  t.mock.method(
    AnalysisEngine.prototype,
    "analyze",
    (...[, callbacks, , options]: Parameters<AnalysisEngine["analyze"]>) => {
      const request = { callbacks, options, cancelled: false };
      requests.push(request);
      return () => {
        request.cancelled = true;
      };
    },
  );
  dom.window.HTMLElement.prototype.animate = () =>
    ({ cancel() {}, onfinish: null }) as unknown as Animation;
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  const click = async (selector: string) => {
    const button = document.querySelector<HTMLButtonElement>(selector);
    assert.ok(button, selector);
    await act(() => button.click());
  };
  await click(".computer-toggle");
  await click('#play-workspace [data-square="e2"]');
  await click('#play-workspace [data-square="e4"]');
  const saved = dom.window.localStorage.getItem(SESSION_KEY);
  const bot = requests.find((request) => request.options?.skill !== undefined)!;
  assert.ok(bot);
  await act(() => bot.callbacks.onComplete([], "e7e5")); // Finished search, still waiting to move.
  await click("#opening-tab");
  await act(async () => {
    await import("../../src/features/openings/OpeningWorkspace");
  });
  assert.equal(bot.cancelled, true);
  assert.equal(document.getElementById("play-workspace")!.hidden, true);
  await click('[data-opening="wayward-rook"]');
  await click(".opening-forward");
  await click(".opening-forward");
  await act(() => t.mock.timers.tick(5000));
  assert.equal(dom.window.localStorage.getItem(SESSION_KEY), saved);
  assert.equal(
    document.querySelector('#play-workspace [data-square="e5"] img'),
    null,
  );
  const count = requests.length;
  await click(".opening-forward");
  assert.equal(
    requests.length,
    count,
    "lesson moves must not request engine analysis",
  );
  await click("#play-tab");
  assert.equal(document.getElementById("play-workspace")!.hidden, false);
  const resumed = requests
    .filter((request) => request.options?.skill !== undefined)
    .at(-1)!;
  assert.notEqual(resumed, bot);
  await act(() => {
    resumed.callbacks.onComplete([], "e7e5");
    t.mock.timers.tick(1000);
  });
  assert.equal(
    document
      .querySelector('#play-workspace [data-square="e5"] img')!
      .getAttribute("src"),
    "/pieces/bP.svg",
  );
  await click("#opening-tab");
  assert.equal(
    document.querySelector(".opening-progress span")!.textContent,
    "Step 3 of 7",
  );
});

test("workspace tabs support arrow keys without also advancing the opening lesson", async (t) => {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  const play = document.getElementById("play-tab")!;
  await act(() =>
    play.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      }),
    ),
  );
  await act(async () => {
    await import("../../src/features/openings/OpeningWorkspace");
  });
  assert.equal(document.activeElement?.id, "opening-tab");
  await act(() =>
    document
      .querySelector<HTMLButtonElement>('[data-opening="wayward-rook"]')!
      .click(),
  );
  const opening = document.getElementById("opening-tab")!;
  await act(() =>
    opening.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
      }),
    ),
  );
  assert.equal(document.activeElement?.id, "play-tab");
  assert.equal(
    document.querySelector(".opening-progress span")!.textContent,
    "Step 0 of 7",
  );
});
