import type { OpeningLesson } from "../../content/openings/lessons.ts";
import { motifs } from "../../content/openings/content.ts";
import type { Language } from "../../i18n/translate.ts";

type LibraryFilters = {
  query: string;
  level: string;
  side: string;
  theme: string;
};
export function filterOpenings(
  lessons: readonly OpeningLesson[],
  filters: LibraryFilters,
  language: Language,
) {
  const query = filters.query.trim().toLocaleLowerCase(language);
  return lessons
    .map((lesson, index) => ({ lesson, rank: index + 1 }))
    .filter(({ lesson }) => {
      if (
        (filters.level !== "all" && filters.level !== lesson.level) ||
        (filters.side !== "all" && filters.side !== lesson.side) ||
        (filters.theme !== "all" && filters.theme !== lesson.theme)
      )
        return false;
      if (!query) return true;
      const motif = motifs[lesson.motif];
      return [
        lesson.name[language],
        lesson.name.en,
        motif.title[language],
        motif.title.en,
        motif.summary[language],
        motif.plan[language],
      ]
        .join(" ")
        .toLocaleLowerCase(language)
        .includes(query);
    });
}
