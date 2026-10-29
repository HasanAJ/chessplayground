import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement, Fragment } from "react";
import { createTestRoot } from "../helpers/dom";
import { AnalyticsConsent } from "../../src/app/AnalyticsConsent";
import { analyticsConsentKey, createAnalytics } from "../../src/app/analytics";
import { updatePageMetadata } from "../../src/i18n/metadata";
import { LanguageProvider } from "../../src/i18n/LanguageProvider";
import { LanguageSelector } from "../../src/i18n/LanguageSelector";
import { languages, type Language } from "../../src/i18n/translate";
import { privacyPath } from "../../src/i18n/routes";

const measurementId = "G-TEST123456";
function commands() {
  return (
    (window as Window & { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? []
  ).map((entry) => Array.from(entry));
}
function views() {
  return commands().filter(
    (entry) => entry[0] === "event" && entry[1] === "page_view",
  );
}
function button(text: string) {
  const found = [...document.querySelectorAll("button")].find(
    (element) => element.textContent === text,
  );
  assert.ok(found, text);
  return found;
}

test("banner and footer privacy links follow the selected site language", async (t) => {
  const { root, dom } = createTestRoot(t);
  await act(() =>
    root.render(
      createElement(LanguageProvider, {
        children: createElement(
          Fragment,
          null,
          createElement(LanguageSelector),
          createElement(AnalyticsConsent, { measurementId }),
        ),
      }),
    ),
  );
  const select = document.querySelector<HTMLSelectElement>(
    ".language-selector select",
  )!;
  for (const language of Object.keys(languages) as Language[]) {
    await act(() => {
      select.value = language;
      select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
    assert.deepEqual(
      [
        ...document.querySelectorAll<HTMLAnchorElement>('a[href*="privacy/"]'),
      ].map((link) => link.getAttribute("href")),
      [privacyPath(language), privacyPath(language)],
      language,
    );
  }
});

test("no Analytics script or commands run before consent or after declining", async (t) => {
  const { root } = createTestRoot(t);
  await act(() =>
    root.render(createElement(AnalyticsConsent, { measurementId })),
  );
  assert.equal(
    document.querySelectorAll('script[src*="googletagmanager"]').length,
    0,
  );
  assert.deepEqual(commands(), []);
  await act(() => button("Decline").click());
  assert.equal(window.localStorage.getItem(analyticsConsentKey), "denied");
  assert.equal(document.querySelector("#analytics-choice"), null);
  assert.deepEqual(commands(), []);
  await act(() => root.unmount());
  assert.equal(document.querySelectorAll("script").length, 0);
});

test("cookie settings remain beside Privacy policy without an Analytics ID and save choices without tracking", async (t) => {
  const { root } = createTestRoot(t);
  await act(() => root.render(createElement(AnalyticsConsent)));
  const settings = button("Cookie settings");
  assert.equal(
    document.querySelector("a.privacy-link")!.nextElementSibling,
    settings,
  );
  assert.equal(settings.getAttribute("aria-expanded"), "false");
  assert.equal(document.querySelector("#analytics-choice"), null);

  await act(() => settings.click());
  assert.equal(settings.getAttribute("aria-expanded"), "true");
  assert.ok(document.getElementById(settings.getAttribute("aria-controls")!));
  await act(() => button("Decline").click());
  assert.equal(window.localStorage.getItem(analyticsConsentKey), "denied");
  assert.equal(document.querySelector("#analytics-choice"), null);
  assert.equal(document.activeElement, settings);

  await act(() => settings.click());
  await act(() => button("Accept").click());
  assert.equal(window.localStorage.getItem(analyticsConsentKey), "granted");
  assert.equal(document.querySelector("#analytics-choice"), null);
  assert.equal(document.querySelectorAll("script").length, 0);
  assert.deepEqual(commands(), []);
});

test("allowing Analytics starts one tag and withdrawing permission clears cookies and stops page views", async (t) => {
  const { root } = createTestRoot(t);
  await act(() =>
    root.render(createElement(AnalyticsConsent, { measurementId })),
  );
  await act(() => button("Accept").click());
  assert.equal(window.localStorage.getItem(analyticsConsentKey), "granted");
  assert.equal(
    document.querySelectorAll(`script[src$="id=${measurementId}"]`).length,
    1,
  );
  assert.equal(views().length, 1);
  assert.deepEqual(commands().find((entry) => entry[0] === "config")?.[2], {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: "https://tempo.test/",
    page_referrer: "",
  });
  document.cookie = "_ga=visitor; Path=/";
  document.cookie = "_ga_TEST123456=session; Domain=tempo.test; Path=/";
  document.cookie = "unrelated=keep; Path=/";
  await act(() => button("Cookie settings").click());
  await act(() => button("Decline").click());
  assert.equal(Reflect.get(window, `ga-disable-${measurementId}`), true);
  assert.equal(document.cookie, "unrelated=keep");
  window.history.pushState(null, "", "/es/");
  updatePageMetadata("es");
  await Promise.resolve();
  assert.equal(views().length, 1);
  await act(() => button("Cookie settings").click());
  await act(() => button("Accept").click());
  assert.equal(Reflect.get(window, `ga-disable-${measurementId}`), false);
  assert.equal(document.querySelectorAll("script").length, 1);
  assert.equal(views().length, 2);
});

test("virtual page views wait for matching metadata, exclude private URL parameters, and do not duplicate", async (t) => {
  createTestRoot(t);
  window.history.replaceState(null, "", "/?email=private@example.com#private");
  updatePageMetadata("en");
  const analytics = createAnalytics(measurementId);
  analytics.start();
  analytics.start();
  assert.equal(views().length, 1);
  window.history.pushState(
    null,
    "",
    "/es/openings/wayward-rook/?fen=private#private",
  );
  document.title = "Loading lesson";
  await Promise.resolve();
  assert.equal(views().length, 1);
  updatePageMetadata("es", {
    path: "openings/wayward-rook/",
    title: "El ataque de la dama — Tempo",
    description: "Una lección de ajedrez",
  });
  await Promise.resolve();
  assert.equal(views().length, 2);
  assert.deepEqual(views()[1][2], {
    page_location: "https://tempo.test/es/openings/wayward-rook/",
    page_title: "El ataque de la dama — Tempo",
    page_referrer: "https://tempo.test/",
  });
  document.title = "El ataque de la dama — Tempo";
  await Promise.resolve();
  assert.equal(views().length, 2);
  window.history.replaceState(null, "", "/");
  updatePageMetadata("en");
  await Promise.resolve();
  assert.equal(views().length, 3);
  analytics.stop();
});

test("saved consent is restored and withdrawing it in another tab stops collection", async (t) => {
  const { root, dom } = createTestRoot(t);
  window.localStorage.setItem(analyticsConsentKey, "granted");
  await act(() =>
    root.render(createElement(AnalyticsConsent, { measurementId })),
  );
  assert.equal(document.querySelector("#analytics-choice"), null);
  assert.equal(views().length, 1);
  await act(() => {
    window.localStorage.setItem(analyticsConsentKey, "denied");
    window.dispatchEvent(
      new dom.window.StorageEvent("storage", { key: analyticsConsentKey }),
    );
  });
  assert.equal(Reflect.get(window, `ga-disable-${measurementId}`), true);
});

test("unavailable storage defaults to no tracking and explains when a choice cannot be saved", async (t) => {
  const { root, dom } = createTestRoot(t);
  t.mock.method(dom.window.Storage.prototype, "getItem", () => {
    throw new Error("Blocked");
  });
  t.mock.method(dom.window.Storage.prototype, "setItem", () => {
    throw new Error("Blocked");
  });
  await act(() =>
    root.render(createElement(AnalyticsConsent, { measurementId })),
  );
  assert.equal(document.querySelectorAll("script").length, 0);
  await act(() => button("Decline").click());
  assert.match(
    document.querySelector('[role="status"]')!.textContent!,
    /could not be saved/,
  );
  assert.deepEqual(commands(), []);
});
