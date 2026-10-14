import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { languages, translator, type Language } from "../../src/i18n/translate";
import { languagePath, privacyPath } from "../../src/i18n/routes";

test("every localized privacy URL has a complete policy and matching language navigation", () => {
  for (const language of Object.keys(languages) as Language[]) {
    const path = privacyPath(language);
    const source = readFileSync(
      new URL(`../../public${path}index.html`, import.meta.url),
      "utf8",
    );
    const dom = new JSDOM(source);
    const document = dom.window.document;
    assert.equal(document.documentElement.lang, language);
    assert.equal(
      document.querySelector("h1")!.textContent,
      translator(language)("analytics.privacy"),
    );
    assert.equal(
      document.title,
      `${translator(language)("analytics.privacy")} — Tempo`,
    );
    assert.equal(
      document.querySelector('link[rel="canonical"]')!.getAttribute("href"),
      `https://chessplayground.app${path}`,
    );
    assert.equal(
      document.querySelector("main > a")!.getAttribute("href"),
      languagePath(language),
    );
    assert.equal(document.querySelectorAll("h2").length, 4);
    assert.doesNotMatch(source, /Hasan|github/i);
    for (const key of ["_ga", "_ga_…"])
      assert.ok(
        [...document.querySelectorAll("code")].some(
          (element) => element.textContent === key,
        ),
        `${language}: ${key}`,
      );
    const links = document.querySelectorAll<HTMLAnchorElement>(
      ".privacy-language-nav a",
    );
    assert.equal(links.length, 5);
    for (const link of links) {
      const targetLanguage = link.hreflang as Language;
      assert.equal(link.getAttribute("href"), privacyPath(targetLanguage));
      assert.equal(
        link.getAttribute("aria-current"),
        targetLanguage === language ? "page" : null,
      );
      assert.equal(
        document
          .querySelector(`link[hreflang="${targetLanguage}"]`)!
          .getAttribute("href"),
        `https://chessplayground.app${privacyPath(targetLanguage)}`,
      );
    }
    assert.equal(document.querySelectorAll("script").length, 0);
    dom.window.close();
  }
});
