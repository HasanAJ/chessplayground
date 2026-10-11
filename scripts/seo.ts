import type { HtmlTagDescriptor, Plugin } from "vite";

export const SITE_TITLE = "Tempo — Chess Coach & Position Playground";
export const SITE_DESCRIPTION =
  "Play chess, set up a position, and explore Stockfish move suggestions with plain-English explanations. Free browser-based analysis and computer practice.";

export function siteMetadata(siteUrl: string) {
  const site = new URL(siteUrl);
  if (
    site.protocol !== "https:" ||
    site.username ||
    site.password ||
    site.pathname !== "/" ||
    site.search ||
    site.hash
  )
    throw new Error(
      "SITE_URL must be an HTTPS origin, for example https://chessplayground.app",
    );
  const url = `${site.origin}/`;
  const image = `${site.origin}/social-preview.png`;
  const meta = (property: string, content: string): HtmlTagDescriptor => ({
    tag: "meta",
    attrs: { property, content },
  });
  const tags: HtmlTagDescriptor[] = [
    { tag: "link", attrs: { rel: "canonical", href: url } },
    meta("og:type", "website"),
    meta("og:site_name", "Tempo"),
    meta("og:title", SITE_TITLE),
    meta("og:description", SITE_DESCRIPTION),
    meta("og:url", url),
    meta("og:image", image),
    meta("og:image:type", "image/png"),
    meta("og:image:width", "1200"),
    meta("og:image:height", "630"),
    meta("og:image:alt", "Tempo chess coach: your next move, explained."),
    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { tag: "meta", attrs: { name: "twitter:title", content: SITE_TITLE } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: SITE_DESCRIPTION },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
    {
      tag: "meta",
      attrs: {
        name: "twitter:image:alt",
        content: "Tempo chess coach: your next move, explained.",
      },
    },
  ];
  return {
    tags,
    robots: `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}</loc></url></urlset>\n`,
  };
}

export function seoPlugin(siteUrl: string): Plugin {
  const metadata = siteMetadata(siteUrl);
  return {
    name: "tempo-seo",
    transformIndexHtml: () => metadata.tags,
    generateBundle() {
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
  };
}
