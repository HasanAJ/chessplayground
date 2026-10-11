import test from "node:test";
import assert from "node:assert/strict";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { JSDOM } from "jsdom";
import { seoPlugin, siteMetadata } from "../../scripts/seo";
import { languages, type Language } from "../../src/i18n/translate";
import { languagePath } from "../../src/i18n/routes";
import { siteContent } from "../../src/i18n/siteContent";

test("canonical, social image, robots and sitemap all use the configured origin", () => {
  const { tags, robots, sitemap } = siteMetadata("https://tempo.example.org/");
  assert.ok(
    tags.some(
      (tag) =>
        tag.attrs?.rel === "canonical" &&
        tag.attrs.href === "https://tempo.example.org/",
    ),
  );
  assert.ok(
    tags.some(
      (tag) =>
        tag.attrs?.property === "og:image" &&
        tag.attrs.content === "https://tempo.example.org/social-preview.png",
    ),
  );
  assert.ok(
    tags.some(
      (tag) =>
        tag.attrs?.name === "twitter:card" &&
        tag.attrs.content === "summary_large_image",
    ),
  );
  assert.match(robots, /Sitemap: https:\/\/tempo.example.org\/sitemap.xml/);
  assert.match(sitemap, /<loc>https:\/\/tempo.example.org\/<\/loc>/);
});

test("production pages contain translated content and reciprocal language metadata before JavaScript runs", async () => {
  const result = await build({
    configFile: false,
    plugins: [react(), seoPlugin("https://tempo.example.org")],
    build: { write: false },
    logLevel: "silent",
  });
  assert.ok(!Array.isArray(result) && "output" in result);
  const pages = result.output.filter((asset) => asset.type === "asset");
  const sitemap = pages.find((asset) => asset.fileName === "sitemap.xml")!;
  const sitemapDocument = new JSDOM(String(sitemap.source), {
    contentType: "text/xml",
  });
  assert.deepEqual(
    [...sitemapDocument.window.document.querySelectorAll("loc")].map(
      (loc) => loc.textContent,
    ),
    Object.keys(languages).map(
      (code) => `https://tempo.example.org${languagePath(code as Language)}`,
    ),
  );
  sitemapDocument.window.close();
  for (const language of Object.keys(languages) as Language[]) {
    const asset = pages.find(
      (page) =>
        page.fileName === `${languagePath(language).slice(1)}index.html`,
    )!;
    assert.ok(asset, language);
    const dom = new JSDOM(String(asset.source));
    const document = dom.window.document;
    const content = siteContent[language];
    assert.equal(document.documentElement.lang, language);
    assert.equal(document.title, content.title);
    assert.equal(
      document
        .querySelector('meta[name="description"]')!
        .getAttribute("content"),
      content.description,
    );
    assert.equal(
      document
        .querySelector('meta[property="og:title"]')!
        .getAttribute("content"),
      content.title,
    );
    assert.equal(
      document
        .querySelector('meta[property="og:url"]')!
        .getAttribute("content"),
      `https://tempo.example.org${languagePath(language)}`,
    );
    assert.equal(
      document.querySelector('link[rel="canonical"]')!.getAttribute("href"),
      `https://tempo.example.org${languagePath(language)}`,
    );
    assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
    assert.equal(
      document.querySelectorAll('meta[name="description"]').length,
      1,
    );
    assert.equal(document.querySelectorAll('link[rel="alternate"]').length, 6);
    for (const code of Object.keys(languages) as Language[]) {
      assert.equal(
        document
          .querySelector(`link[hreflang="${code}"]`)!
          .getAttribute("href"),
        `https://tempo.example.org${languagePath(code)}`,
      );
      assert.equal(
        document
          .querySelector(`nav a[hreflang="${code}"]`)!
          .getAttribute("href"),
        languagePath(code),
      );
    }
    assert.equal(
      document.querySelector(".site-intro h2")!.textContent,
      content.heading,
    );
    assert.equal(
      document.querySelector(".site-intro > p")!.textContent,
      content.intro,
    );
    assert.equal(document.querySelectorAll(".site-intro li").length, 3);
    assert.match(
      document.querySelector('script[type="module"]')!.getAttribute("src")!,
      /^\/assets\/.*\.js$/,
    );
    assert.match(
      document.querySelector('link[rel="stylesheet"]')!.getAttribute("href")!,
      /^\/assets\/.*\.css$/,
    );
    dom.window.close();
  }
});
test("an invalid deployment origin fails clearly instead of emitting misleading metadata", () => {
  for (const url of [
    "http://tempo.example.org",
    "https://user:pass@tempo.example.org",
    "https://tempo.example.org/app",
    "https://tempo.example.org/?test=1",
    "https://tempo.example.org/#board",
  ])
    assert.throws(() => siteMetadata(url), /SITE_URL/);
});
