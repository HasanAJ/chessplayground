import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import App from "../../src/app/App";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { createTestRoot } from "../helpers/dom";

test("Calculate and refresh default to two seconds and three moves", async (t) => {
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
  assert.equal(document.querySelector<HTMLElement>("#analysis-settings")!.hidden, true);
  await act(() => document.querySelector<HTMLButtonElement>(".analysis-settings-trigger")!.click());
  assert.equal(document.querySelector<HTMLElement>("#analysis-settings")!.hidden, false);
  assert.equal(document.querySelector<HTMLInputElement>("#analysis-seconds")!.value, "2");
  assert.equal(document.querySelector<HTMLInputElement>("#analysis-moves")!.value, "3");
  const calculate = async () => {
    const button = document.querySelector<HTMLButtonElement>(".calculate-button")!;
    assert.equal(button.disabled, false);
    await act(() => button.click());
  };
  await calculate();
  assert.equal(document.querySelector<HTMLElement>("#analysis-settings")!.hidden, true);
  assert.deepEqual(requests[0][3], { depth: null, movetime: 2000, multiPV: 3 });
  assert.equal(document.querySelector<HTMLInputElement>("#analysis-seconds")!.matches(":disabled"), true);
  assert.equal(document.querySelector(".coach-status"), null);
  await act(() => requests[0][1].onComplete([
    { rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5"] },
  ], "e2e4"));
  assert.equal(document.querySelector(".best-move-heading")!.textContent, "Pawn from e2 to e4");
  await calculate();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1][3], { depth: null, movetime: 2000, multiPV: 3 });
});

test("client inputs control the search and display more than five moves", async (t) => {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  const requests: Parameters<AnalysisEngine["analyze"]>[] = [];
  t.mock.method(AnalysisEngine.prototype, "analyze", (...args: typeof requests[number]) => {
    requests.push(args);
    return () => {};
  });
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  await act(() => document.querySelector<HTMLButtonElement>(".analysis-settings-trigger")!.click());
  const input = async (id: string, value: string) => act(() => {
    const field = document.querySelector<HTMLInputElement>(id)!;
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!
      .set!.call(field, value);
    field.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
  const button = () => document.querySelector<HTMLButtonElement>(".calculate-button")!;
  for (const [id, value] of [
    ["#analysis-seconds", ""],
    ["#analysis-seconds", "0"],
    ["#analysis-seconds", "61"],
    ["#analysis-seconds", "1.2"],
  ]) {
    await input(id, value);
    assert.equal(button().disabled, true);
    assert.equal(
      document.querySelector("#analysis-seconds-error")!.textContent,
      "Time must be 0.5–60 seconds, in steps of 0.5.",
    );
    assert.equal(document.querySelector("#analysis-moves-error"), null);
    assert.equal(document.querySelector("#analysis-moves")!.getAttribute("aria-invalid"), "false");
    await act(() => button().click());
  }
  await input("#analysis-seconds", "4.5");
  assert.equal(document.querySelector("#analysis-seconds-error"), null);
  for (const value of ["0", "1.5", "11"]) {
    await input("#analysis-moves", value);
    assert.equal(button().disabled, true);
    assert.equal(
      document.querySelector("#analysis-moves-error")!.textContent,
      "Moves must be a whole number from 1 to 10.",
    );
    assert.equal(document.querySelector("#analysis-seconds-error"), null);
    assert.equal(document.querySelector("#analysis-seconds")!.getAttribute("aria-invalid"), "false");
  }
  await input("#analysis-seconds", "0");
  assert.equal(document.querySelectorAll(".analysis-settings-error").length, 2);
  await input("#analysis-moves", "10");
  assert.ok(document.querySelector("#analysis-seconds-error"));
  assert.equal(document.querySelector("#analysis-moves-error"), null);
  await input("#analysis-seconds", "4.5");
  await input("#analysis-moves", "8");
  assert.equal(button().disabled, false);
  assert.equal(document.querySelector(".analysis-settings-error"), null);
  assert.equal(requests.length, 0, "editing does not start a search");
  await act(() => button().click());
  assert.deepEqual(requests[0][3], { depth: null, movetime: 4500, multiPV: 8 });
  const lines = ["e2e4", "d2d4", "g1f3", "c2c4", "b1c3", "e2e3", "g2g3", "b2b3"]
    .map((move, index) => ({ rank: index + 1, depth: 16, cp: 30 - index, pv: [move] }));
  await act(() => requests[0][1].onComplete(lines, "e2e4"));
  assert.equal(document.querySelectorAll(".candidate-card").length, 7);
  assert.equal(document.querySelector<HTMLInputElement>("#analysis-seconds")!.matches(":disabled"), false);
  await act(() => button().click());
  assert.deepEqual(requests[1][3], { depth: null, movetime: 4500, multiPV: 8 });
});

test("computer and analysis settings open separately and dismiss accessibly", async (t) => {
  const { dom, root } = createTestRoot(t);
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  const computerTrigger = document.querySelector<HTMLButtonElement>(".computer-settings-trigger")!;
  const analysisTrigger = document.querySelector<HTMLButtonElement>(".analysis-settings-trigger")!;
  const computerPanel = document.querySelector<HTMLElement>("#computer-settings")!;
  const analysisPanel = document.querySelector<HTMLElement>("#analysis-settings")!;
  const computerToggle = document.querySelector<HTMLButtonElement>(".computer-toggle")!;
  assert.ok(computerTrigger.closest(".computer-control-group")!.contains(computerToggle));
  assert.equal(computerTrigger.closest(".coach-toolbar"), analysisTrigger.closest(".coach-toolbar"));
  assert.ok(computerTrigger.closest(".coach-header")!.querySelector(".coach-heading"));
  assert.equal(computerPanel.hidden, true);
  assert.equal(analysisPanel.hidden, true);
  await act(() => computerTrigger.click());
  assert.equal(computerTrigger.getAttribute("aria-expanded"), "true");
  assert.equal(computerPanel.hidden, false);
  assert.equal(computerToggle.getAttribute("aria-checked"), "false", "opening settings does not enable the opponent");
  await act(() => analysisTrigger.click());
  assert.equal(computerPanel.hidden, true);
  assert.equal(analysisPanel.hidden, false);
  await act(() => document.querySelector<HTMLButtonElement>("#analysis-settings .primary-button")!.click());
  assert.equal(analysisPanel.hidden, true);
  assert.equal(document.activeElement, analysisTrigger);
  await act(() => analysisTrigger.click());
  await act(() => document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape" })));
  assert.equal(analysisPanel.hidden, true);
  assert.equal(document.activeElement, analysisTrigger);
  await act(() => analysisTrigger.click());
  await act(() => computerTrigger.click());
  assert.equal(analysisPanel.hidden, true);
  assert.equal(computerPanel.hidden, false);
  await act(() => document.querySelector<HTMLButtonElement>('[aria-label="Close computer settings"]')!.click());
  assert.equal(document.activeElement, computerTrigger);
  await act(() => analysisTrigger.click());
  await act(() => document.body.dispatchEvent(new dom.window.MouseEvent("pointerdown", { bubbles: true })));
  assert.equal(analysisPanel.hidden, true);
});

test("clearing the board preserves the coach welcome while calculation stays disabled", async (t) => {
  for (const scenario of ["new game", "analysis after a move", "finished game"]) {
    await t.test(scenario, async (t) => {
      const { dom, root } = createTestRoot(t);
      dom.window.HTMLElement.prototype.scrollIntoView = () => {};
      if (scenario === "finished game")
        dom.window.localStorage.setItem(
          "tempo-position",
          "7k/6Q1/6K1/8/8/8/8/8 b - - 0 1",
        );
      t.mock.method(
        AnalysisEngine.prototype,
        "analyze",
        () => () => {},
      );
      await act(() => root.render(createElement(App)));
      const document = dom.window.document;
      if (scenario === "analysis after a move") {
        for (const square of ["e2", "e4"])
          await act(() =>
            document.querySelector<HTMLButtonElement>(`#board [data-square="${square}"]`)!.click(),
          );
        await act(() =>
          document.querySelector<HTMLButtonElement>(".calculate-button")!.click(),
        );
      }
      await act(() =>
        document.querySelector<HTMLButtonElement>('[aria-label="Clear board"]')!.click(),
      );

      assert.ok(document.querySelector("#coach .coach-welcome"));
      assert.equal(
        document.querySelector<HTMLButtonElement>(".calculate-button")!.disabled,
        true,
      );
    });
  }
});
