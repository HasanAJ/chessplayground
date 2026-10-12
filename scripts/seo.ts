import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Plugin } from "vite";
import { StaticPage } from "./StaticPage";
import {
  pageMetadata,
  siteOrigin,
  type PageDetails,
} from "../src/i18n/metadata";
import { languageFromPath, languagePath } from "../src/i18n/routes";
import { languages, type Language } from "../src/i18n/translate";
import { openings, type OpeningLesson } from "../src/features/openings/lessons";
import { openingMetadata } from "../src/features/openings/metadata";

type SitePage = {
  language: Language;
  page?: PageDetails;
  lesson?: OpeningLesson;
};

export const sitePages: SitePage[] = (
  Object.keys(languages) as Language[]
).flatMap((language) => [
  { language, page: undefined },
  { language, page: openingMetadata(language) },
  ...openings.map((lesson) => ({
    language,
    page: openingMetadata(language, lesson),
    lesson,
  })),
]);

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

export function siteMetadata(siteUrl: string, language: Language = "en") {
  const origin = siteOrigin(siteUrl);
  return {
    ...pageMetadata(origin, language),
    robots: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitePages
      .map(
        ({ language, page }) =>
          `<url><loc>${escapeHtml(origin + languagePath(language) + (page?.path ?? ""))}</loc></url>`,
      )
      .join("")}</urlset>\n`,
  };
}

function renderSitePage(
  html: string,
  siteUrl: string,
  language: Language,
  path = languagePath(language),
) {
  const route = sitePages.find(
    (route) =>
      route.language === language &&
      `${languagePath(language)}${route.page?.path ?? ""}` === path,
  );
  const metadata = pageMetadata(siteUrl, language, route?.page);
  const head = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
  const intro = /<!--intro:start-->[\s\S]*?<!--intro:end-->/;
  if (!head.test(html) || !intro.test(html))
    throw new Error(
      "The HTML template must contain the SEO and intro markers.",
    );
  const tags = metadata.tags.map(
    ({ tag, attrs }) =>
      `<${tag} ${Object.entries(attrs)
        .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
        .join(" ")}>`,
  );
  const staticPage = renderToStaticMarkup(
    createElement(StaticPage, {
      language,
      pathname: path,
      title: metadata.title,
      openingPage: !!route?.page,
      lesson: route?.lesson,
    }),
  );
  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${language}">`)
    .replace(
      head,
      () =>
        `<!--seo:start-->\n<title>${escapeHtml(metadata.title)}</title>\n${tags.join("\n")}\n<!--seo:end-->`,
    )
    .replace(intro, () => `<!--intro:start-->${staticPage}<!--intro:end-->`);
}

export function seoPlugin(siteUrl: string): Plugin {
  const metadata = siteMetadata(siteUrl);
  return {
    name: "tempo-seo",
    transformIndexHtml(html, context) {
      const pathname = new URL(
        context.originalUrl ?? context.path,
        "http://localhost",
      ).pathname;
      const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
      return renderSitePage(
        html,
        siteUrl,
        languageFromPath(pathname) ?? "en",
        path,
      );
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        if (
          !index ||
          index.type !== "asset" ||
          typeof index.source !== "string"
        )
          this.error("The localized pages need Vite’s built index.html.");
        for (const { language, page } of sitePages) {
          const path = `${languagePath(language)}${page?.path ?? ""}`;
          if (path === "/") continue;
          this.emitFile({
            type: "asset",
            fileName: `${path.slice(1)}index.html`,
            source: renderSitePage(index.source, siteUrl, language, path),
          });
        }
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: metadata.robots,
        });
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: metadata.sitemap,
        });
      },
    },
  };
}
