import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { filterOpenings } from "../../domain/openings/library.ts";
import {
  openings,
  type OpeningLesson,
} from "../../content/openings/lessons.ts";
import { OpeningCard } from "./OpeningCard.tsx";
import { OpeningViewer } from "./OpeningViewer.tsx";
import {
  navigate,
  useLocation,
} from "../../infrastructure/navigation/location.ts";
import { openingIdFromPath, openingPath } from "../../i18n/routes.ts";
import { updatePageMetadata } from "../../i18n/metadata.ts";
import { openingMetadata } from "../../i18n/openingMetadata.ts";

export default function OpeningWorkspace({ active }: { active: boolean }) {
  const { t, language } = useTranslation();
  const location = useLocation();
  const routeId = openingIdFromPath(location.split("?")[0]);
  const lastSelectedId = useRef(routeId);
  if (active) lastSelectedId.current = routeId;
  const selectedId = active ? routeId : lastSelectedId.current;
  const selected = openings.find((lesson) => lesson.id === selectedId) ?? null;
  useEffect(() => {
    if (active)
      updatePageMetadata(
        language,
        openingMetadata(language, selected ?? undefined),
      );
  }, [active, language, selected]);
  const select = (lesson: OpeningLesson) =>
    navigate(openingPath(language, lesson.id));
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [side, setSide] = useState("all");
  const [theme, setTheme] = useState("all");
  const previousSelection = useRef<string | null>(null);
  useEffect(() => {
    if (selected) previousSelection.current = selected.id;
    else if (previousSelection.current)
      document
        .querySelector<HTMLAnchorElement>(
          `[data-opening="${previousSelection.current}"]`,
        )
        ?.focus();
  }, [selected]);
  const shown = useMemo(
    () => filterOpenings(openings, { query, level, side, theme }, language),
    [query, level, side, theme, language],
  );

  return (
    <div className="opening-workspace">
      {!selectedId && (
        <div className="page-heading opening-heading">
          <div>
            <h1>
              {t("opening.heading.start")}{" "}
              <span>{t("opening.heading.end")}</span>
            </h1>
            <p>{t("opening.subtitle")}</p>
          </div>
        </div>
      )}
      {selectedId && !selected ? (
        <div className="opening-load-error" role="status">
          <h1>{t("opening.notFound")}</h1>
          <button
            className="opening-back"
            onClick={() => navigate(openingPath(language))}
          >
            {t("opening.backToLibrary")}
          </button>
        </div>
      ) : selected ? (
        <OpeningViewer
          key={selected.id}
          lesson={selected}
          active={active}
          onClose={() => navigate(openingPath(language))}
        />
      ) : (
        <>
          <div className="opening-library-toolbar">
            <label className="opening-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                aria-label={t("opening.search")}
                placeholder={t("opening.search")}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="opening-filter">
              <span>{t("opening.filter")}</span>
              <select
                value={level}
                aria-label={t("opening.filter")}
                onChange={(event) => setLevel(event.target.value)}
              >
                <option value="all">{t("opening.level.all")}</option>
                <option value="beginner">{t("opening.level.beginner")}</option>
                <option value="intermediate">
                  {t("opening.level.intermediate")}
                </option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
            <label className="opening-filter opening-side-filter">
              <span>{t("opening.side")}</span>
              <select
                value={side}
                aria-label={t("opening.side")}
                onChange={(event) => setSide(event.target.value)}
              >
                <option value="all">{t("opening.side.all")}</option>
                <option value="w">{t("chess.side.white")}</option>
                <option value="b">{t("chess.side.black")}</option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
            <label className="opening-filter opening-theme-filter">
              <span>{t("opening.target")}</span>
              <select
                value={theme}
                aria-label={t("opening.target")}
                onChange={(event) => setTheme(event.target.value)}
              >
                <option value="all">{t("opening.target.all")}</option>
                {(["mate", "queen", "rook", "piece", "attack"] as const).map(
                  (value) => (
                    <option key={value} value={value}>
                      {t(`opening.theme.${value}`)}
                    </option>
                  ),
                )}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
          </div>
          <p className="opening-count" role="status">
            {t("opening.count", shown.length, openings.length)}
          </p>
          <div className="opening-library">
            {shown.map(({ lesson, rank }) => (
              <OpeningCard
                key={lesson.id}
                lesson={lesson}
                rank={rank}
                onSelect={select}
              />
            ))}
          </div>
          {shown.length === 0 && (
            <p className="opening-empty">{t("opening.empty")}</p>
          )}
        </>
      )}
    </div>
  );
}
