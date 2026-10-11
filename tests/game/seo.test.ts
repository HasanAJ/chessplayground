import test from "node:test";
import assert from "node:assert/strict";
import { siteMetadata } from "../../scripts/seo";

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
