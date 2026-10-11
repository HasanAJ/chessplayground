import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Plugin } from "vite";
import { SiteIntro } from "../src/app/SiteIntro";
import { pageMetadata, siteOrigin } from "../src/i18n/metadata";
import { languageFromPath, languagePath } from "../src/i18n/routes";
import { siteContent } from "../src/i18n/siteContent";
import { languages, type Language } from "../src/i18n/translate";

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
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${(
      Object.keys(languages) as Language[]
    )
      .map(
        (code) =>
          `<url><loc>${escapeHtml(origin + languagePath(code))}</loc></url>`,
      )
      .join("")}</urlset>\n`,
  };
}

function renderSitePage(html: string, siteUrl: string, language: Language) {
  const metadata = pageMetadata(siteUrl, language);
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
  const content = siteContent[language];
  const staticIntro = renderToStaticMarkup(
    createElement(SiteIntro, { language }),
  );
  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${language}">`)
    .replace(
      head,
      () =>
        `<!--seo:start-->\n<title>${escapeHtml(metadata.title)}</title>\n${tags.join("\n")}\n<!--seo:end-->`,
    )
    .replace(
      intro,
      () =>
        `<!--intro:start--><main class="loading-intro"><h1>${escapeHtml(content.title)}</h1>${staticIntro}<noscript><p>${escapeHtml(content.javascript)}</p></noscript></main><!--intro:end-->`,
    );
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
      return renderSitePage(html, siteUrl, languageFromPath(pathname) ?? "en");
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
        for (const code of Object.keys(languages) as Language[]) {
          if (code === "en") continue;
          this.emitFile({
            type: "asset",
            fileName: `${languagePath(code).slice(1)}index.html`,
            source: renderSitePage(index.source, siteUrl, code),
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
