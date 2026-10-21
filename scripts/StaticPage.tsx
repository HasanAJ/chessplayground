import { gameMoveLabel } from "../src/chess/position";
import { SiteIntro } from "../src/app/SiteIntro";
import { languagePath, openingPath } from "../src/i18n/routes";
import { siteContent } from "../src/i18n/siteContent";
import { translator, type Language } from "../src/i18n/translate";
import { motifs } from "../src/features/openings/content";
import {
  lessonPositions,
  openings,
  type OpeningLesson,
} from "../src/features/openings/lessons";

export function StaticPage({
  language,
  pathname,
  openingPage,
  lesson,
}: {
  language: Language;
  pathname: string;
  openingPage: boolean;
  lesson?: OpeningLesson;
}) {
  const t = translator(language);
  const separator = language === "fr" ? " : " : ": ";
  const motif = lesson && motifs[lesson.motif];
  return (
    <main className="loading-intro">
      <nav aria-label={t("workspace.tabs.label")}>
        <a href={languagePath(language)}>{t("workspace.tabs.play")}</a>
        {" · "}
        <a href={openingPath(language)}>{t("workspace.tabs.opening")}</a>
      </nav>
      {lesson && motif ? (
        <article>
          <h1>{lesson.name[language]}</h1>
          <p>{motif.title[language]}</p>
          {(["plan", "temptation", "defense"] as const).map((section) => (
            <section key={section}>
              <h2>
                {t(
                  section === "temptation"
                    ? "opening.mistake"
                    : `opening.${section}`,
                )}
              </h2>
              <p>{motif[section][language]}</p>
            </section>
          ))}
          <p>{t(`opening.risk.detail.${lesson.risk}`)}</p>
          {(["trap", "defense"] as const).map((branch) => (
            <section key={branch}>
              <h2>{t(`opening.branch.${branch}`)}</h2>
              <p>
                {lessonPositions(lesson, branch)
                  .slice(1)
                  .map((frame) => gameMoveLabel(frame.move!))
                  .join(" ")}
              </p>
            </section>
          ))}
        </article>
      ) : openingPage ? (
        <>
          <h1>
            {t("opening.heading.start")} {t("opening.heading.end")}
          </h1>
          <p>{t("opening.subtitle")}</p>
          <p>{t("opening.library.note")}</p>
          <ol>
            {openings.map((entry) => (
              <li key={entry.id}>
                <h2>
                  <a href={openingPath(language, entry.id)}>
                    {entry.name[language]}
                    {separator}
                    {motifs[entry.motif].title[language]}
                  </a>
                </h2>
                <p>{motifs[entry.motif].plan[language]}</p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <h1>
            {t("intro.heading.start")} {t("intro.heading.end")}
          </h1>
          <p>{t("intro.tagline")}</p>
        </>
      )}
      <SiteIntro language={language} pathname={pathname} />
      <noscript>
        <p>{siteContent[language].javascript}</p>
      </noscript>
    </main>
  );
}
