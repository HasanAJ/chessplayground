import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { AnalysisEngine } from "../../src/infrastructure/stockfish/AnalysisEngine.ts";
import { LanguageProvider } from "../../src/i18n/LanguageProvider.tsx";
import { notice } from "../../src/i18n/notices.ts";
import App from "../../src/ui/shell/App.tsx";
import { createTestRoot } from "../helpers/dom.ts";

async function mount(t: TestContext, mobile = false) {
  const { root, dom } = createTestRoot(t);
  const scrolls: string[] = [];
  dom.window.HTMLElement.prototype.scrollIntoView = function () {
    scrolls.push(this.id);
  };
  if (mobile)
    Object.defineProperty(dom.window, "matchMedia", {
      value: () => ({ matches: true }),
      configurable: true,
    });
  dom.window.localStorage.setItem("tempo-analytics-consent-v1", "denied");
  const requests: Parameters<AnalysisEngine["analyze"]>[] = [];
  t.mock.method(
    AnalysisEngine.prototype,
    "analyze",
    (...args: Parameters<AnalysisEngine["analyze"]>) => {
      requests.push(args);
      return () => {};
    },
  );
  await act(() =>
    root.render(
      createElement(LanguageProvider, { children: createElement(App) }),
    ),
  );
  const document = dom.window.document;
  const click = async (selector: string) => {
    const button = document.querySelector<HTMLButtonElement>(selector);
    assert.ok(button, selector);
    assert.equal(button.disabled, false, selector);
    await act(() => button.click());
  };
  const complete = (pv = ["g1f3", "d7d5"]) =>
    act(() =>
      requests.at(-1)![1].onComplete(
        [
          { rank: 1, depth: 15, cp: 30, pv },
          { rank: 2, depth: 15, cp: 20, pv: ["d2d4", "d7d5"] },
        ],
        pv[0],
      ),
    );
  return { dom, document, click, complete, requests, scrolls };
}

test("focused hints navigate and translate without exposing moves or repeating the search", async (t) => {
  const { dom, document, click, complete, requests } = await mount(t);
  const assertFindAvailable = () => {
    const find = document.querySelector<HTMLButtonElement>(
      ".calculation-controls .calculate-button",
    )!;
    assert.equal(find.textContent, "Find the best moves");
    assert.equal(find.disabled, false);
  };
  await click(".hint-button");
  assertFindAvailable();
  await complete();
  const hint = () => document.querySelector(".hint-card")!;
  assert.doesNotMatch(
    hint().querySelector(".hint-description")!.textContent!,
    /knight|g1|f3|d4/,
  );
  assert.equal(document.querySelector(".best-move-heading"), null);
  assert.equal(document.querySelector(".alternative-moves"), null);
  assert.equal(document.querySelector(".move-arrow"), null);
  assertFindAvailable();
  await act(() =>
    hint().dispatchEvent(
      new dom.window.MouseEvent("mouseover", { bubbles: true }),
    ),
  );
  assert.equal(document.querySelector(".move-arrow"), null);
  const next = hint().querySelector<HTMLButtonElement>(".hint-next")!;
  const previous = hint().querySelector<HTMLButtonElement>(".hint-previous")!;
  const label = () => hint().querySelector(".hint-label")!.textContent;
  assert.equal(label(), "Hint 1 of 3");
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, false);
  await act(() => next.focus());
  await act(() => next.click());
  assert.equal(label(), "Hint 2 of 3");
  assert.match(
    hint().querySelector(".hint-description")!.textContent!,
    /d4 and e5/,
  );
  assert.equal(hint().querySelectorAll(".hint-progress .is-reached").length, 2);
  assert.match(hint().textContent!, /knight move/);
  assert.doesNotMatch(hint().textContent!, /g1|f3/);
  await act(() => next.click());
  assert.match(hint().textContent!, /Consider your knight on g1/);
  assert.doesNotMatch(hint().textContent!, /d4|e5/);
  assert.doesNotMatch(hint().textContent!, /f3/);
  assert.equal(label(), "Hint 3 of 3");
  assert.equal(next.disabled, true);
  assert.equal(document.querySelector(".move-arrow"), null);

  const language = document.querySelector<HTMLSelectElement>(
    ".language-selector select",
  )!;
  await act(() => {
    language.value = "de";
    language.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  });
  assert.match(hint().textContent!, /Springer auf g1/);
  assert.equal(
    label(),
    "Tipp 3 von 3",
    "the current hint survives translation",
  );
  assert.equal(document.querySelector(".best-move-heading"), null);
  assert.equal(requests.length, 1, "translation reuses the analysis");
  await act(() => previous.click());
  assert.equal(label(), "Tipp 2 von 3");
  assert.match(
    hint().querySelector(".hint-description")!.textContent!,
    /d4.*e5/,
  );
  assert.doesNotMatch(hint().textContent!, /g1|f3/);
  assert.equal(next.disabled, false);
  await act(() => previous.click());
  assert.equal(label(), "Tipp 1 von 3");
  assert.equal(previous.disabled, true);
  assert.equal(requests.length, 1, "navigation reuses the analysis");
});

test("retries keep answers hidden, while a new position resets the current hint", async (t) => {
  const { document, click, complete, requests } = await mount(t);
  await click(".hint-button");
  await act(() => requests[0][1].onError(notice("engine.error.load")));
  assert.ok(document.querySelector(".engine-error"));
  await click(".engine-error .primary-button");
  await complete();
  assert.ok(document.querySelector(".hint-description"));
  assert.equal(document.querySelector(".best-move-heading"), null);
  await click(".hint-next");
  await click(".hint-next");
  assert.match(
    document.querySelector(".hint-description")!.textContent!,
    /knight on g1/,
  );
  assert.equal(document.querySelector(".move-arrow"), null);
  await click(".new-game-button");
  assert.equal(document.querySelector(".hint-card"), null);
  await click(".hint-button");
  await complete();
  assert.equal(
    document.querySelector(".hint-label")!.textContent,
    "Hint 1 of 3",
  );
  assert.doesNotMatch(
    document.querySelector(".hint-description")!.textContent!,
    /g1|f3/,
  );
});

test("an unexplained quiet move shows the useful piece clue without filler or an empty next step", async (t) => {
  const { document, click, complete } = await mount(t);
  await click(".hint-button");
  await complete(["a2a3"]);
  assert.match(
    document.querySelector(".hint-description")!.textContent!,
    /Consider your pawn on a2/,
  );
  assert.equal(document.querySelector(".hint-next"), null);
  assert.equal(document.querySelector(".hint-previous"), null);
  assert.equal(document.querySelector(".hint-label"), null);
  assert.equal(document.querySelector(".hint-progress"), null);
  assert.equal(document.querySelector(".best-move-heading"), null);
  assert.equal(document.querySelector(".move-arrow"), null);
});

for (const ready of [false, true])
  test(`revealing a ${ready ? "ready" : "pending"} hint resets selection and returns to the coach without another search`, async (t) => {
    const { document, click, complete, requests, scrolls } = await mount(
      t,
      true,
    );
    await click(".hint-button");
    if (ready) await complete();
    await click('#play-workspace [data-square="b1"]');
    assert.ok(document.querySelector(".selected-square"));
    assert.deepEqual(scrolls, ["coach"]);
    await click(".calculation-controls .calculate-button");
    if (!ready) await complete();
    assert.equal(requests.length, 1);
    assert.equal(document.querySelector(".hint-card"), null);
    assert.equal(document.querySelector(".selected-square"), null);
    assert.ok(document.querySelector(".move-arrow line"));
    assert.match(
      document.querySelector(".best-move-heading")!.textContent!,
      /g1.*f3/,
    );
    assert.deepEqual(scrolls, ["coach", "coach"]);
  });
