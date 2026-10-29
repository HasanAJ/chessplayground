import { BookOpen, Globe, Swords } from "lucide-react";
import { gameMoveLabel } from "../src/chess/position";
import { SiteIntro } from "../src/app/SiteIntro";
import { languagePath, openingPath } from "../src/i18n/routes";
import { siteContent } from "../src/i18n/siteContent";
import { languages, translator, type Language } from "../src/i18n/translate";
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
    <div className="loading-intro">
      <header className="loading-header">
        <a
          className="loading-brand"
          href={languagePath(language)}
          aria-label={t("header.home")}
        >
          <img src="/favicon.svg" alt="" width="56" height="56" />
          <span>
            tempo<span className="loading-brand-dot">.</span>
          </span>
        </a>
        <nav className="loading-tabs" aria-label={t("workspace.tabs.label")}>
          <a
            href={languagePath(language)}
            aria-current={!openingPage ? "page" : undefined}
          >
            <Swords size={17} aria-hidden="true" />
            {t("workspace.tabs.play")}
          </a>
          <a
            href={openingPath(language)}
            aria-current={openingPage ? "page" : undefined}
          >
            <BookOpen size={17} aria-hidden="true" />
            {t("workspace.tabs.opening")}
          </a>
        </nav>
        <span className="loading-language">
          <Globe size={16} aria-hidden="true" />
          {languages[language]}
        </span>
      </header>
      <main className="loading-main">
        {lesson && motif ? (
          <article className="loading-lesson">
            <h1>{lesson.name[language]}</h1>
            <p>{motif.title[language]}</p>
            <p>{motif.summary[language]}</p>
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
              {t("opening.heading.start")} <span>{t("opening.heading.end")}</span>
            </h1>
            <p className="loading-tagline">{t("opening.subtitle")}</p>
            <ol className="loading-openings">
              {openings.map((entry) => (
                <li key={entry.id}>
                  <h2>
                    <a href={openingPath(language, entry.id)}>
                      {entry.name[language]}
                      {separator}
                      {motifs[entry.motif].title[language]}
                    </a>
                  </h2>
                  <p>{motifs[entry.motif].summary[language]}</p>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <h1>
              {t("intro.heading.start")} <span>{t("intro.heading.end")}</span>
            </h1>
            <p className="loading-tagline">{t("intro.tagline")}</p>
            <div className="loading-workspace">
              <div className="loading-board-panel">
                <div className="loading-toolbar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="loading-board">
                  <div className="loading-board-center">
                    <div className="loading-board-mark" aria-hidden="true">
                      <img src="/favicon.svg" alt="" width="80" height="80" />
                    </div>
                    <p className="loading-status" role="status">
                      <span className="loading-spinner" aria-hidden="true" />
                      {t("app.loading")}
                    </p>
                  </div>
                </div>
                <div className="loading-board-footer" aria-hidden="true">
                  <span />
                  <span />
                </div>
              </div>
              <section className="loading-coach">
                <h2>{t("coach.panel.heading")}</h2>
                <div className="loading-coach-copy">
                  <h3>{t("coach.welcome.heading")}</h3>
                  <p>{t("coach.welcome.description")}</p>
                </div>
                <div className="loading-analysis" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </section>
            </div>
          </>
        )}
        <SiteIntro language={language} pathname={pathname} />
        <noscript>
          <style>{`.loading-workspace { display: none; }`}</style>
          <p className="loading-javascript">{siteContent[language].javascript}</p>
        </noscript>
      </main>
    </div>
  );
}
