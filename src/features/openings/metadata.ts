import { translator, type Language } from "../../i18n/translate";
import { motifs } from "./content";
import type { OpeningLesson } from "./lessons";
import type { PageDetails } from "../../i18n/metadata";

export function openingMetadata(
  language: Language,
  lesson?: OpeningLesson,
): PageDetails {
  const t = translator(language);
  const separator = language === "fr" ? " : " : ": ";
  return {
    path: `openings/${lesson ? `${lesson.id}/` : ""}`,
    title: lesson
      ? `${lesson.name[language]}${separator}${motifs[lesson.motif].title[language]} — Tempo`
      : t("opening.seo.title"),
    description: lesson
      ? `${lesson.name[language]}${separator}${motifs[lesson.motif].plan[language]}`
      : t("opening.seo.description"),
  };
}
