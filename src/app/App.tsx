import { LanguageSelector } from "../i18n/LanguageSelector";
import { useTranslation } from "../i18n/LanguageProvider";
import {
  languagePath,
  openingPath,
  isOpeningsPath,
  pathForLanguage,
} from "../i18n/routes";
import { updatePageMetadata } from "../i18n/metadata";
import { SiteIntro } from "./SiteIntro";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { PlayWorkspace } from "../features/game/PlayWorkspace";
import { WorkspaceTabs } from "./WorkspaceTabs";
import { navigate, useLocation } from "./navigation";
import { OpeningBoundary } from "../features/openings/OpeningBoundary";
import { AnalyticsConsent } from "./AnalyticsConsent";

const OpeningWorkspace = lazy(
  () => import("../features/openings/OpeningWorkspace"),
);

export default function App() {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const pathname = location.split("?")[0];
  const openingActive = isOpeningsPath(pathname);
  const [openingVisited, setOpeningVisited] = useState(openingActive);
  const lastOpeningPath = useRef(openingPath(language));
  useEffect(() => {
    if (openingActive) {
      setOpeningVisited(true);
      lastOpeningPath.current = pathname;
    } else updatePageMetadata(language);
  }, [openingActive, pathname, language]);

  return (
    <>
      <header className="site-header">
        <a
          className="brand"
          href={languagePath(language)}
          aria-label={t("header.home")}
        >
          <img src="/favicon.svg" alt="" />
          <span>
            tempo<span className="brand-dot">.</span>
          </span>
        </a>
        <WorkspaceTabs
          active={openingActive ? "opening" : "play"}
          onChange={(next) => {
            navigate(
              next === "opening"
                ? pathForLanguage(lastOpeningPath.current, language)
                : languagePath(language),
            );
          }}
        />
        <div className="header-actions">
          <LanguageSelector />
        </div>
      </header>

      <main>
        <PlayWorkspace active={!openingActive} />
        <section
          id="opening-workspace"
          role="tabpanel"
          aria-labelledby="opening-tab"
          hidden={!openingActive}
        >
          {openingVisited && (
            <OpeningBoundary>
              <Suspense fallback={<p role="status">{t("opening.loading")}</p>}>
                <OpeningWorkspace active={openingActive} />
              </Suspense>
            </OpeningBoundary>
          )}
        </section>
        <SiteIntro
          language={language}
          onLanguageChange={setLanguage}
          pathname={pathname}
        />
      </main>
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-identity">
            <a
              className="footer-brand"
              href={languagePath(language)}
              aria-label={t("header.home")}
            >
              <img src="/favicon.svg" alt="" />
              <span>Tempo</span>
            </a>
            <p className="footer-copyright">
              © {new Date().getFullYear()} Tempo
            </p>
          </div>
          <div className="footer-details">
            <p className="footer-engine">{t("footer.engine")}</p>
            <div className="footer-privacy">
              <AnalyticsConsent />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
