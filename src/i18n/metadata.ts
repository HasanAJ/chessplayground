import { languages, type Language } from "./translate";
import { languagePath } from "./routes";
import { siteContent } from "./siteContent";

export type MetadataTag = {
  tag: "meta" | "link";
  attrs: Record<string, string>;
};

export function siteOrigin(siteUrl: string) {
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
  return site.origin;
}

export function pageMetadata(siteUrl: string, language: Language) {
  const origin = siteOrigin(siteUrl);
  const content = siteContent[language];
  const url = `${origin}${languagePath(language)}`;
  const image = `${origin}/social-preview.png`;
  const meta = (property: string, value: string): MetadataTag => ({
    tag: "meta",
    attrs: { property, content: value },
  });
  const tags: MetadataTag[] = [
    {
      tag: "meta",
      attrs: { name: "description", content: content.description },
    },
    { tag: "link", attrs: { rel: "canonical", href: url } },
    ...Object.keys(languages).map((code) => ({
      tag: "link" as const,
      attrs: {
        rel: "alternate",
        hreflang: code,
        href: `${origin}${languagePath(code as Language)}`,
      },
    })),
    {
      tag: "link",
      attrs: { rel: "alternate", hreflang: "x-default", href: `${origin}/` },
    },
    meta("og:type", "website"),
    meta("og:site_name", "Tempo"),
    meta("og:title", content.title),
    meta("og:description", content.description),
    meta("og:url", url),
    meta("og:image", image),
    meta("og:image:type", "image/png"),
    meta("og:image:width", "1200"),
    meta("og:image:height", "630"),
    meta("og:image:alt", content.imageAlt),
    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { tag: "meta", attrs: { name: "twitter:title", content: content.title } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: content.description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
    {
      tag: "meta",
      attrs: { name: "twitter:image:alt", content: content.imageAlt },
    },
  ];
  return { title: content.title, tags };
}

export function updatePageMetadata(language: Language) {
  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  const origin = canonical
    ? new URL(canonical.href).origin
    : "https://chessplayground.app";
  const { title, tags } = pageMetadata(origin, language);
  document.documentElement.lang = language;
  document.title = title;
  for (const { tag, attrs } of tags) {
    const identifier = attrs.name
      ? "name"
      : attrs.property
        ? "property"
        : "rel";
    const locale = attrs.hreflang ? `[hreflang="${attrs.hreflang}"]` : "";
    const selector = `${tag}[${identifier}="${attrs[identifier]}"]${locale}`;
    const element =
      document.querySelector(selector) ?? document.createElement(tag);
    for (const [name, value] of Object.entries(attrs))
      element.setAttribute(name, value);
    if (!element.isConnected) document.head.append(element);
  }
}
