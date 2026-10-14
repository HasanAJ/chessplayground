import test from "node:test";
import assert from "node:assert/strict";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { JSDOM } from "jsdom";
import { seoPlugin, siteMetadata, sitePages } from "../../scripts/seo";
import { languages, type Language } from "../../src/i18n/translate";
import { languagePath, openingPath, privacyPath } from "../../src/i18n/routes";
import { siteContent } from "../../src/i18n/siteContent";
import { openings } from "../../src/features/openings/lessons";
import { motifs } from "../../src/features/openings/content";

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
    [
      ...sitePages.map(
        ({ language, page }) =>
          `https://tempo.example.org${languagePath(language)}${page?.path ?? ""}`,
      ),
      ...(Object.keys(languages) as Language[]).map(
        (language) => `https://tempo.example.org${privacyPath(language)}`,
      ),
    ],
  );
  sitemapDocument.window.close();
  for (const language of Object.keys(languages) as Language[]) {
    const metadata = sitePages.filter((route) => route.language === language);
    for (const field of ["title", "description"] as const)
      assert.equal(
        new Set(
          metadata.map(
            (route) => route.page?.[field] ?? siteContent[language][field],
          ),
        ).size,
        metadata.length,
        `${language}: unique ${field}`,
      );
  }
  for (const { language, page, lesson } of sitePages.filter(
    (route) => route.page,
  )) {
    const path = `${languagePath(language)}${page!.path}`;
    const asset = pages.find(
      (asset) => asset.fileName === `${path.slice(1)}index.html`,
    );
    assert.ok(asset, path);
    const dom = new JSDOM(String(asset.source));
    const document = dom.window.document;
    assert.equal(document.title, page!.title);
    assert.equal(document.querySelectorAll("h1").length, 1);
    assert.equal(document.documentElement.lang, language);
    assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
    assert.equal(document.querySelectorAll('link[rel="alternate"]').length, 6);
    assert.equal(
      document.querySelectorAll('meta[name="description"]').length,
      1,
    );
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      assert.equal(
        document.querySelector(selector)!.getAttribute("content"),
        page!.description,
      );
    assert.equal(
      document
        .querySelector('link[hreflang="x-default"]')!
        .getAttribute("href"),
      `https://tempo.example.org/${page!.path}`,
    );
    assert.equal(
      document.querySelector('link[rel="canonical"]')!.getAttribute("href"),
      `https://tempo.example.org${path}`,
    );
    assert.equal(
      document
        .querySelector('meta[property="og:url"]')!
        .getAttribute("content"),
      `https://tempo.example.org${path}`,
    );
    for (const code of Object.keys(languages) as Language[]) {
      assert.equal(
        document
          .querySelector(`link[hreflang="${code}"]`)!
          .getAttribute("href"),
        `https://tempo.example.org${languagePath(code)}${page!.path}`,
      );
      assert.equal(
        document
          .querySelector(`nav a[hreflang="${code}"]`)!
          .getAttribute("href"),
        `${languagePath(code)}${page!.path}`,
      );
    }
    assert.ok(document.querySelector(`a[href="${openingPath(language)}"]`));
    if (lesson) {
      assert.equal(
        document.querySelector("h1")!.textContent,
        lesson.name[language],
      );
      const article = document.querySelector("article")!;
      for (const text of Object.values(motifs[lesson.motif]))
        assert.ok(
          article.textContent!.includes(text[language]),
          `${path}: translated teaching content`,
        );
      assert.ok(article.textContent!.includes(lesson.trap.split(" ").at(-1)!));
      assert.ok(
        article.textContent!.includes(lesson.defense.split(" ").at(-1)!),
      );
    } else {
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>("ol a"),
      );
      assert.deepEqual(
        links.map((link) => link.getAttribute("href")),
        openings.map((entry) => openingPath(language, entry.id)),
      );
      for (const [index, link] of links.entries())
        assert.ok(link.textContent!.includes(openings[index].name[language]));
    }
    dom.window.close();
  }
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
    assert.ok(
      document.querySelector(`a[href="${openingPath(language)}"]`),
      `${language}: discoverable library link`,
    );
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
    assert.deepEqual(
      Array.from(
        document.querySelectorAll(".site-intro > p"),
        (p) => p.textContent,
      ),
      [content.intro, content.analysis],
    );
    assert.equal(document.querySelectorAll(".site-intro li").length, 0);
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
