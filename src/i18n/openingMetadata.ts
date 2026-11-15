import { translator, type Language } from "./translate.ts";
import { motifs } from "../content/openings/content.ts";
import type { OpeningLesson } from "../content/openings/lessons.ts";
import type { PageDetails } from "./metadata.ts";
export function openingMetadata(
  language: Language,
  lesson?: OpeningLesson,
): PageDetails {
  if (!lesson) {
    const t = translator(language);
    return {
      path: "openings/",
      title: t("opening.seo.title"),
      description: t("opening.seo.description"),
    };
  }
  const name = lesson.name[language],
    motif = motifs[lesson.motif];
  const prefix = name + (language === "fr" ? " : " : ": ");
  return {
    path: `openings/${lesson.id}/`,
    title: prefix + motif.title[language] + " — Tempo",
    description: prefix + motif.plan[language],
  };
}
