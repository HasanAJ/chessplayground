import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import App from "../../src/app/App";
import { LanguageProvider } from "../../src/i18n/LanguageProvider";
import {
  openingPath,
  isOpeningsPath,
  languageFromPath,
  pathForLanguage,
} from "../../src/i18n/routes";
import { createTestRoot } from "../helpers/dom";
import { OpeningBoundary } from "../../src/features/openings/OpeningBoundary";

test("opening paths preserve the lesson when changing language and reject unrelated paths", () => {
  assert.equal(openingPath("en"), "/openings/");
  assert.equal(openingPath("es", "wayward-rook"), "/es/openings/wayward-rook/");
  assert.equal(languageFromPath("/de/openings/wayward-rook/"), "de");
  assert.equal(
    pathForLanguage("/de/openings/wayward-rook/", "fr"),
    "/fr/openings/wayward-rook/",
  );
  for (const path of [
    "/fr/missing/",
    "/fr/openings/x/y/",
    "/unknown/openings/",
  ])
    assert.equal(isOpeningsPath(path), false);
});

test("direct lesson URLs, translated URLs and browser Back stay in sync with the workspace", async (t) => {
  const { root, dom } = createTestRoot(t);
  const { document, history } = dom.window;
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  history.replaceState(null, "", "/openings/wayward-rook/");
  await act(async () => {
    root.render(
      createElement(LanguageProvider, { children: createElement(App) }),
    );
    await import("../../src/features/openings/OpeningWorkspace");
  });
  assert.equal(document.querySelector("#opening-tab")!.textContent, "Openings");
  assert.equal(
    document.querySelector(".opening-lesson-header h1")!.textContent,
    "Wayward Queen Attack",
  );
  assert.equal(
    document
      .querySelector<HTMLAnchorElement>(".opening-back")!
      .getAttribute("href"),
    "/openings/",
  );
  assert.match(document.title, /Wayward Queen Attack/);
  assert.equal(
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href,
    "https://chessplayground.app/openings/wayward-rook/",
  );
  await act(() =>
    document.querySelector<HTMLButtonElement>(".opening-forward")!.click(),
  );
  const select = document.querySelector<HTMLSelectElement>(
    ".language-selector select",
  )!;
  await act(() => {
    select.value = "es";
    select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  });
  assert.equal(dom.window.location.pathname, "/es/openings/wayward-rook/");
  assert.equal(
    document.querySelector(".opening-progress span")!.textContent,
    "Paso 1 de 7",
  );
  assert.equal(document.documentElement.lang, "es");
  await act(() =>
    document.querySelector<HTMLAnchorElement>(".opening-back")!.click(),
  );
  assert.equal(dom.window.location.pathname, "/es/openings/");
  assert.equal(
    document
      .querySelector<HTMLAnchorElement>('[data-opening="wayward-rook"]')!
      .getAttribute("href"),
    "/es/openings/wayward-rook/",
  );
  await act(async () => {
    const popped = new Promise<void>((resolve) =>
      dom.window.addEventListener("popstate", () => resolve(), { once: true }),
    );
    history.back();
    await popped;
  });
  assert.equal(dom.window.location.pathname, "/es/openings/wayward-rook/");
  assert.ok(document.querySelector(".opening-board"));
  await act(() =>
    document.querySelector<HTMLButtonElement>("#play-tab")!.click(),
  );
  assert.equal(dom.window.location.pathname, "/es/");
  assert.equal(document.getElementById("play-workspace")!.hidden, false);
});

test("unknown lessons provide a route back to the library", async (t) => {
  const { root, dom } = createTestRoot(t);
  dom.window.history.replaceState(null, "", "/openings/missing-lesson/");
  await act(async () => {
    root.render(
      createElement(LanguageProvider, { children: createElement(App) }),
    );
    await import("../../src/features/openings/OpeningWorkspace");
  });
  assert.match(
    dom.window.document.querySelector(".opening-load-error")!.textContent!,
    /Opening not found/,
  );
  await act(() =>
    dom.window.document
      .querySelector<HTMLButtonElement>(".opening-back")!
      .click(),
  );
  assert.equal(dom.window.location.pathname, "/openings/");
  assert.equal(
    dom.window.document.querySelectorAll(".opening-card").length,
    30,
  );
});

test("a failed lesson renders a recoverable error and leaves a way back to Play", async (t) => {
  const { root, dom } = createTestRoot(t);
  t.mock.method(console, "error", () => {});
  dom.window.history.replaceState(null, "", "/openings/");
  function BrokenLesson(): never {
    throw new Error("Failed to fetch the lesson bundle");
  }
  await act(() =>
    root.render(
      createElement(LanguageProvider, {
        children: createElement(OpeningBoundary, {
          children: createElement(BrokenLesson),
        }),
      }),
    ),
  );
  const alert = dom.window.document.querySelector('[role="alert"]')!;
  assert.match(alert.textContent!, /Openings could not load/);
  assert.match(alert.textContent!, /Reload/);
  const play = Array.from(alert.querySelectorAll("button")).find(
    (button) => button.textContent === "Play",
  )!;
  await act(() => play.click());
  assert.equal(dom.window.location.pathname, "/");
  assert.doesNotMatch(alert.textContent!, /Failed to fetch/);
});
