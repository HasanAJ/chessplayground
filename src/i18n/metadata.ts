import { languages, type Language } from "./translate.ts";
import { languagePath } from "./routes.ts";
import { siteContent } from "./siteContent.ts";
type MetadataTag = { tag: "meta" | "link"; attrs: Record<string, string> };
export type PageDetails = { path: string; title: string; description: string };

export function siteOrigin(value: string) {
  const url = new URL(value);
  if (
    url.protocol === "https:" &&
    !url.username &&
    !url.password &&
    url.pathname === "/" &&
    !url.search &&
    !url.hash
  )
    return url.origin;
  throw new Error(
    "SITE_URL must be an HTTPS origin, for example https://chessplayground.app",
  );
}
export function pageMetadata(
  siteUrl: string,
  language: Language,
  page?: PageDetails,
) {
  const origin = siteOrigin(siteUrl),
    content = siteContent[language];
  const path = page?.path ?? "",
    title = page?.title ?? content.title,
    description = page?.description ?? content.description;
  const canonical = origin + languagePath(language) + path,
    image = `${origin}/social-preview.png`;
  const link = (attrs: Record<string, string>): MetadataTag => ({
    tag: "link",
    attrs,
  });
  const named = (name: string, content: string): MetadataTag => ({
    tag: "meta",
    attrs: { name, content },
  });
  const property = (name: string, content: string): MetadataTag => ({
    tag: "meta",
    attrs: { property: name, content },
  });
  const tags = [
    named("description", description),
    link({ rel: "canonical", href: canonical }),
  ];
  for (const code of Object.keys(languages) as Language[])
    tags.push(
      link({
        rel: "alternate",
        hreflang: code,
        href: origin + languagePath(code) + path,
      }),
    );
  tags.push(
    link({
      rel: "alternate",
      hreflang: "x-default",
      href: `${origin}/${path}`,
    }),
  );
  const social: Record<string, string> = {
    type: "website",
    site_name: "Tempo",
    title,
    description,
    url: canonical,
    image,
    "image:type": "image/png",
    "image:width": "1200",
    "image:height": "630",
    "image:alt": content.imageAlt,
  };
  for (const [key, value] of Object.entries(social))
    tags.push(property(`og:${key}`, value));
  const twitter = {
    card: "summary_large_image",
    title,
    description,
    image,
    "image:alt": content.imageAlt,
  };
  for (const [key, value] of Object.entries(twitter))
    tags.push(named(`twitter:${key}`, value));
  return { title, tags };
}
function selectorFor(tag: MetadataTag) {
  const attribute = ["name", "property", "rel"].find((key) => tag.attrs[key])!;
  return `${tag.tag}[${attribute}="${tag.attrs[attribute]}"]${tag.attrs.hreflang ? `[hreflang="${tag.attrs.hreflang}"]` : ""}`;
}
export function updatePageMetadata(language: Language, page?: PageDetails) {
  const existing = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  const origin = existing
    ? new URL(existing.href).origin
    : "https://chessplayground.app";
  const metadata = pageMetadata(origin, language, page);
  document.documentElement.lang = language;
  document.title = metadata.title;
  for (const tag of metadata.tags) {
    const element =
      document.querySelector(selectorFor(tag)) ??
      document.createElement(tag.tag);
    Object.entries(tag.attrs).forEach(([attribute, value]) =>
      element.setAttribute(attribute, value),
    );
    if (!element.isConnected) document.head.appendChild(element);
  }
}
