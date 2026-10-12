import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import OpeningWorkspace from "../../src/features/openings/OpeningWorkspace";
import { LanguageProvider } from "../../src/i18n/LanguageProvider";
import { LanguageSelector } from "../../src/i18n/LanguageSelector";
import { lessonMoves, openings } from "../../src/features/openings/lessons";
import { motifs } from "../../src/features/openings/content";
import { createTestRoot } from "../helpers/dom";

async function mount(t: TestContext) {
  const { dom, root } = createTestRoot(t);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  const render = async (active = true) => {
    await act(() =>
      root.render(
        createElement(LanguageProvider, {
          children: [
            createElement(LanguageSelector, { key: "language" }),
            createElement(OpeningWorkspace, { key: "openings", active }),
          ],
        }),
      ),
    );
  };
  await render();
  const document = dom.window.document;
  const click = async (selector: string) => {
    const button = document.querySelector<HTMLButtonElement>(selector);
    assert.ok(button, selector);
    await act(() => button.click());
  };
  const key = async (key: string, target: Element = document.body) => {
    await act(() =>
      target.dispatchEvent(
        new dom.window.KeyboardEvent("keydown", { key, bubbles: true }),
      ),
    );
  };
  const position = () =>
    Array.from(document.querySelectorAll(".opening-board [data-square]")).map(
      (square) => [
        square.getAttribute("data-square"),
        square.querySelector("img")?.getAttribute("src"),
      ],
    );
  return { dom, document, render, click, key, position };
}

test("the plan, temptation and defence appear once throughout both walkthroughs", async (t) => {
  const view = await mount(t);
  const lesson = openings.find((lesson) => lesson.id === "queens-gambit")!;
  const motif = motifs[lesson.motif];
  await view.click('[data-opening="queens-gambit"]');
  assert.equal(
    view.document.querySelector(".opening-lesson-header p")!.textContent,
    motif.title.en,
  );
  for (const branch of ["trap", "defense"] as const) {
    await view.click(`[data-opening-branch="${branch}"]`);
    assert.match(
      view.document.querySelector(".opening-step-card")!.textContent!,
      branch === "trap" ? /tempting reply/ : /avoids the immediate trap/,
    );
    const total = lessonMoves(lesson, branch).length;
    for (let step = 0; step <= total; step++) {
      const paragraphs = Array.from(
        view.document.querySelectorAll(".opening-workspace p"),
        (paragraph) => paragraph.textContent,
      );
      for (const copy of [motif.plan.en, motif.temptation.en, motif.defense.en])
        assert.equal(paragraphs.filter((text) => text === copy).length, 1);
      if (step < total) await view.click(".opening-forward");
    }
    assert.equal(
      view.document.querySelector<HTMLButtonElement>(".opening-forward")!
        .disabled,
      true,
    );
    assert.equal(
      view.document.querySelectorAll(".opening-complete p").length,
      1,
    );
  }
});

test("the read-only attack board follows one ply, marks the bait, and shows the actual reward", async (t) => {
  const view = await mount(t);
  await view.click('[data-opening="wayward-rook"]');
  const board = view.document.querySelector(".opening-board")!;
  const initial = view.position();
  assert.equal(board.querySelectorAll("[data-square]").length, 64);
  assert.equal(board.querySelectorAll("button, [draggable=true]").length, 0);
  assert.equal(
    view.document.querySelector<HTMLButtonElement>(".opening-nav-button")!
      .disabled,
    true,
  );
  await act(() => {
    board
      .querySelector('[data-square="e2"]')!
      .dispatchEvent(
        new view.dom.window.MouseEvent("click", { bubbles: true }),
      );
    board
      .querySelector('[data-square="e4"]')!
      .dispatchEvent(new view.dom.window.Event("drop", { bubbles: true }));
  });
  assert.deepEqual(view.position(), initial);
  await view.click(".opening-forward");
  assert.match(
    view.document.querySelector(".opening-step-card h3")!.textContent!,
    /1\. e4/,
  );
  assert.match(
    board.querySelector('[data-square="e4"] img')!.getAttribute("src")!,
    /wP/,
  );
  await view.click(".opening-forward");
  assert.match(
    view.document.querySelector(".opening-step-card h3")!.textContent!,
    /1… e5/,
  );
  await view.click(".opening-nav-button");
  assert.match(
    view.document.querySelector(".opening-step-card h3")!.textContent!,
    /1\. e4/,
  );
  await view.click(".opening-nav-button");
  await view.key("ArrowLeft");
  assert.deepEqual(view.position(), initial);
  for (let index = 0; index < 4; index++) await view.key("ArrowRight");
  assert.match(
    view.document.querySelector(".opening-step-card.is-temptation")!
      .textContent!,
    /2… g6/,
  );
  assert.match(
    view.document.querySelector(".opening-stage")!.textContent!,
    /tempting reply/,
  );
  assert.ok(board.querySelector('[data-square="e5"].strategy-square'));
  assert.equal(board.querySelector('[data-square="h8"].strategy-square'), null);
  assert.ok(
    board.querySelector('.opening-arrows line[data-from="h5"][data-to="e5"]'),
  );
  await view.key("ArrowRight");
  assert.ok(
    board.querySelector('.opening-arrows line[data-from="e5"][data-to="h8"]'),
  );
  for (let index = 0; index < 8; index++) await view.key("ArrowRight");
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Step 7 of 7",
  );
  assert.equal(
    view.document.querySelector<HTMLButtonElement>(".opening-forward")!
      .disabled,
    true,
  );
  assert.match(
    board.querySelector('[data-square="h8"] img')!.getAttribute("src")!,
    /wQ/,
  );
  assert.match(
    view.document.querySelector(".opening-complete")!.textContent!,
    /rook and pawn/,
  );
  await view.click(".opening-restart");
  assert.deepEqual(view.position(), initial);
  assert.equal(view.document.querySelector(".opening-complete"), null);
});

test("checkmate stays in the move explanation with one restart control", async (t) => {
  const view = await mount(t);
  const lesson = openings.find((lesson) => lesson.id === "danish")!;
  await view.click('[data-opening="danish"]');
  assert.deepEqual(
    Array.from(
      view.document.querySelectorAll(".opening-lesson-meta > span"),
      (label) => label.textContent,
    ),
    ["Intermediate", "White"],
  );
  for (const _move of lessonMoves(lesson, "trap")) await view.key("ArrowRight");
  assert.match(
    view.document.querySelector(".opening-step-card")!.textContent!,
    /Nd5 mates the exposed king on e7/,
  );
  assert.ok(view.document.querySelector(".opening-board .king-in-check"));
  assert.equal(view.document.querySelector(".opening-complete"), null);
  assert.equal(
    view.document.querySelectorAll('button[aria-label="Restart"]').length,
    1,
  );
  assert.equal(
    view.document.querySelector<HTMLButtonElement>(".opening-forward")!
      .disabled,
    true,
  );
  await view.click(".opening-restart");
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    `Step 0 of ${lessonMoves(lesson, "trap").length}`,
  );
});

test("switching to defence resets the walkthrough, uses a different reply and clears square highlights", async (t) => {
  const view = await mount(t);
  await view.click('[data-opening="wayward-rook"]');
  for (let index = 0; index < 7; index++) await view.key("ArrowRight");
  await act(() =>
    view.document
      .querySelector<HTMLElement>('.opening-plan [data-square-reference="h8"]')!
      .focus(),
  );
  assert.ok(view.document.querySelector(".reference-square"));
  await view.click('[data-opening-branch="defense"]');
  assert.equal(view.document.querySelector(".reference-square"), null);
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Step 0 of 8",
  );
  assert.equal(
    view.document
      .querySelector('[data-opening-branch="defense"]')!
      .getAttribute("aria-pressed"),
    "true",
  );
  for (let index = 0; index < 4; index++) await view.key("ArrowRight");
  assert.match(
    view.document.querySelector(".opening-step-card h3")!.textContent!,
    /2… Nc6/,
  );
  assert.equal(view.document.querySelector(".is-temptation"), null);
  for (let index = 0; index < 4; index++) await view.key("ArrowRight");
  assert.match(
    view.document.querySelector(".opening-complete h3")!.textContent!,
    /trap is avoided/,
  );
  assert.match(
    view.document
      .querySelector('.opening-board [data-square="h8"] img')!
      .getAttribute("src")!,
    /bR/,
  );
  await view.click('[data-opening-branch="trap"]');
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Step 0 of 7",
  );
});

test("keyboard navigation pauses with the tab and leaves input controls alone", async (t) => {
  const view = await mount(t);
  await view.click('[data-opening="wayward-rook"]');
  await view.key("ArrowRight");
  const position = view.position();
  await view.render(false);
  await view.key("ArrowRight");
  assert.deepEqual(view.position(), position);
  await view.render(true);
  await view.key("ArrowRight", view.document.querySelector("select")!);
  assert.deepEqual(view.position(), position);
  await view.key("ArrowRight");
  assert.notDeepEqual(view.position(), position);
});

test("square references highlight the board on hover and focus and clear when the position changes", async (t) => {
  const view = await mount(t);
  await view.click('[data-opening="wayward-rook"]');
  const initial = view.position();
  const reference = (scope: string, square: string) => {
    const element = view.document.querySelector<HTMLElement>(
      `${scope} [data-square-reference="${square}"]`,
    );
    assert.ok(element, `${scope}: ${square}`);
    return element;
  };
  const hover = async (element: HTMLElement) =>
    act(() =>
      element.dispatchEvent(
        new view.dom.window.MouseEvent("mouseover", { bubbles: true }),
      ),
    );
  const leave = async (element: HTMLElement) =>
    act(() =>
      element.dispatchEvent(
        new view.dom.window.MouseEvent("mouseout", {
          bubbles: true,
          relatedTarget: view.document.body,
        }),
      ),
    );
  const highlighted = () =>
    Array.from(
      view.document.querySelectorAll(".opening-board .reference-square"),
      (square) => square.getAttribute("data-square"),
    );
  const intro = reference(".opening-plan", "e5");
  await hover(intro);
  assert.deepEqual(highlighted(), ["e5"]);
  await leave(intro);
  assert.deepEqual(highlighted(), []);
  await act(() => reference(".opening-plan", "h8").focus());
  assert.deepEqual(highlighted(), ["h8"]);
  await hover(intro);
  assert.deepEqual(highlighted(), ["e5"]);
  await leave(intro);
  assert.deepEqual(highlighted(), ["h8"]);
  assert.deepEqual(view.position(), initial);
  await view.click(".opening-board-toolbar button");
  assert.deepEqual(highlighted(), ["h8"]);
  assert.equal(
    view.document
      .querySelector(".opening-board .square")!
      .getAttribute("data-square"),
    "h1",
  );
  await view.key("Escape");
  assert.deepEqual(highlighted(), []);
  await hover(intro);
  await view.click(".opening-forward");
  assert.deepEqual(highlighted(), []);
  await hover(reference(".opening-step-card h3", "e4"));
  assert.deepEqual(highlighted(), ["e4"]);
  await hover(reference(".opening-move-description", "e2"));
  assert.deepEqual(highlighted(), ["e2"]);
  await view.render(false);
  assert.deepEqual(highlighted(), []);
  await view.render(true);
  assert.deepEqual(highlighted(), []);
  for (let index = 0; index < 8; index++) await view.key("ArrowRight");
  await hover(reference(".opening-plan", "h8"));
  assert.deepEqual(highlighted(), ["h8"]);
  await view.click(".opening-back");
  await view.click('[data-opening="wayward-rook"]');
  assert.deepEqual(highlighted(), []);
});

test("Black attacks face Black, flip preserves progress, and the library restores focus", async (t) => {
  const view = await mount(t);
  await view.click('[data-opening="stafford"]');
  assert.deepEqual(
    Array.from(
      view.document.querySelectorAll(".opening-lesson-meta > span"),
      (label) => label.textContent,
    ),
    ["Beginner", "Black"],
  );
  assert.equal(
    view.document
      .querySelector(".opening-board .square")!
      .getAttribute("data-square"),
    "h1",
  );
  await view.click(".opening-forward");
  await view.click(".opening-board-toolbar button");
  assert.equal(
    view.document
      .querySelector(".opening-board .square")!
      .getAttribute("data-square"),
    "a8",
  );
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Step 1 of 16",
  );
  await view.click(".opening-back");
  assert.equal(
    view.document.activeElement?.getAttribute("data-opening"),
    "stafford",
  );
  await view.click('[data-opening="wayward-rook"]');
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Step 0 of 7",
  );
});

test("level, colour and goal filters combine with search while retaining the editorial order", async (t) => {
  const view = await mount(t);
  const total = view.document.querySelectorAll(".opening-card").length;
  assert.equal(total, openings.length);
  assert.match(
    view.document.querySelector(".opening-library-summary")!.textContent!,
    /editorial ranking/,
  );
  const filter = async (selector: string, value: string) => {
    const select = view.document.querySelector<HTMLSelectElement>(selector)!;
    await act(() => {
      select.value = value;
      select.dispatchEvent(
        new view.dom.window.Event("change", { bubbles: true }),
      );
    });
  };
  await filter(".opening-filter select", "beginner");
  await filter(".opening-side-filter select", "b");
  await filter(".opening-theme-filter select", "mate");
  const filtered = view.document.querySelectorAll(".opening-card");
  assert.ok(filtered.length > 0 && filtered.length < total);
  assert.ok(
    Array.from(filtered).every(
      (card) =>
        card.querySelector(".opening-level")!.textContent === "Beginner" &&
        card.querySelector(".opening-card-bottom .opening-label")!
          .textContent === "Black",
    ),
  );
  const ranks = Array.from(filtered, (card) =>
    Number(card.querySelector(".opening-rank")!.textContent!.slice(1)),
  );
  assert.deepEqual(
    ranks,
    [...ranks].sort((a, b) => a - b),
  );
  const input = view.document.querySelector<HTMLInputElement>(
    ".opening-search input",
  )!;
  const search = async (value: string) =>
    act(() => {
      Object.getOwnPropertyDescriptor(
        view.dom.window.HTMLInputElement.prototype,
        "value",
      )!.set!.call(input, value);
      input.dispatchEvent(
        new view.dom.window.Event("input", { bubbles: true }),
      );
    });
  await search("Stafford");
  assert.equal(view.document.querySelectorAll(".opening-card").length, 1);
  assert.equal(
    view.document.querySelector(".opening-rank")!.textContent,
    `#${openings.findIndex((lesson) => lesson.id === "stafford") + 1}`,
    "search keeps the lesson’s catalogue rank",
  );
  await search("no-such-attack");
  assert.equal(view.document.querySelectorAll(".opening-card").length, 0);
  assert.match(
    view.document.querySelector(".opening-empty")!.textContent!,
    /No attacks match/,
  );
});

test("changing language translates the active defence without resetting its board or branch", async (t) => {
  const view = await mount(t);
  await view.click('[data-opening="wayward-rook"]');
  await view.click('[data-opening-branch="defense"]');
  for (let index = 0; index < 4; index++) await view.key("ArrowRight");
  const position = view.position();
  const select = view.document.querySelector<HTMLSelectElement>(
    ".language-selector select",
  )!;
  await act(() => {
    select.value = "es";
    select.dispatchEvent(
      new view.dom.window.Event("change", { bubbles: true }),
    );
  });
  assert.deepEqual(view.position(), position);
  assert.equal(
    view.document.querySelector(".opening-lesson-header h1")!.textContent,
    "Ataque temprano de dama",
  );
  assert.match(
    view.document.querySelector(".opening-defense")!.textContent!,
    /Responde a la amenaza/,
  );
  assert.equal(
    view.document
      .querySelector('[data-opening-branch="defense"]')!
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Paso 4 de 8",
  );
});

test("compact lessons keep one explanation with the board and support tapping square references", async (t) => {
  const view = await mount(t);
  let compact = true;
  t.mock.method(
    view.dom.window,
    "matchMedia",
    () =>
      ({
        matches: compact,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  );
  await view.click('[data-opening="wayward-rook"]');
  for (let step = 0; step < 5; step++) await view.key("ArrowRight");
  assert.equal(view.document.querySelectorAll(".opening-step-card").length, 1);
  assert.ok(
    view.document.querySelector(".opening-board-panel > .opening-step-card"),
  );
  assert.equal(
    view.document.querySelector<HTMLDetailsElement>(".opening-background")!
      .open,
    false,
  );
  await view.click('.opening-step-card p button[data-square-reference="e8"]');
  assert.ok(
    view.document.querySelector(
      '.opening-board [data-square="e8"].reference-square',
    ),
  );
  await view.key("Escape");
  assert.equal(view.document.querySelector(".reference-square"), null);
  const arrow = view.document.querySelector(
    '.opening-arrows line[data-to="h8"]',
  )!;
  assert.equal(arrow.getAttribute("x1"), "450");
  assert.equal(arrow.getAttribute("y1"), "350");
  await view.click(".opening-board-toolbar button");
  assert.equal(arrow.getAttribute("x1"), "350");
  assert.equal(arrow.getAttribute("y1"), "450");
  compact = false;
  await view.render();
  assert.equal(view.document.querySelectorAll(".opening-step-card").length, 1);
  assert.ok(
    view.document.querySelector(".opening-explanation > .opening-step-card"),
  );
  assert.equal(
    view.document.querySelector(".opening-progress span")!.textContent,
    "Step 5 of 7",
  );
});
