import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import {
  isOpeningsPath,
  languagePath,
  openingPath,
  pathForLanguage,
} from "../../i18n/routes.ts";
import { updatePageMetadata } from "../../i18n/metadata.ts";
import {
  navigate,
  useLocation,
} from "../../infrastructure/navigation/location.ts";
import { PlayWorkspace } from "../game/PlayWorkspace.tsx";
import { OpeningBoundary } from "../openings/OpeningBoundary.tsx";
import { SiteHeader } from "./SiteHeader.tsx";
import { SiteFooter } from "./SiteFooter.tsx";
import { SiteIntro } from "./SiteIntro.tsx";

const OpeningWorkspace = lazy(() => import("../openings/OpeningWorkspace.tsx"));
export default function App() {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const pathname = location.split(/[?#]/)[0];
  const opening = isOpeningsPath(pathname);
  const lastLesson = useRef(openingPath(language));
  const [visited, setVisited] = useState(opening);
  useEffect(() => {
    if (opening) {
      lastLesson.current = pathname;
      setVisited(true);
    } else updatePageMetadata(language);
  }, [opening, pathname, language]);
  return (
    <>
      <SiteHeader
        opening={opening}
        onWorkspace={(next) =>
          navigate(
            next === "play"
              ? languagePath(language)
              : pathForLanguage(lastLesson.current, language),
          )
        }
      />
      <main>
        <PlayWorkspace active={!opening} />
        <section
          id="opening-workspace"
          role="tabpanel"
          aria-labelledby="opening-tab"
          hidden={!opening}
        >
          {(opening || visited) && (
            <OpeningBoundary>
              <Suspense fallback={<p role="status">{t("opening.loading")}</p>}>
                <OpeningWorkspace active={opening} />
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
      <SiteFooter />
    </>
  );
}
