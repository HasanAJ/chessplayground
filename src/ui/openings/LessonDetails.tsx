import { RotateCcw } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { gameMoveLabel } from "../../domain/chess/position.ts";
import { moveDescription } from "../../domain/chess/moves.ts";
import type { OpeningLesson } from "../../content/openings/lessons.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import type { LessonView } from "./useLessonViewer.ts";
export function LessonStepCard({ view }: { view: LessonView }) {
  const { t } = useTranslation();
  return (
    <div
      className={`opening-step-card ${view.isTemptation ? "is-temptation" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="eyebrow">{t(view.stepTitle)}</span>
      <h3>
        <SquareText
          text={
            view.frame.move
              ? gameMoveLabel(view.frame.move)
              : t("opening.startPosition")
          }
        />
      </h3>
      {view.frame.move && (
        <p className="opening-move-description">
          <SquareText text={moveDescription(view.frame.move, t)} />
        </p>
      )}
      <p>
        <SquareText text={view.explanation} />
      </p>
    </div>
  );
}
export function LessonBackground({
  view,
  lesson,
}: {
  view: LessonView;
  lesson: OpeningLesson;
}) {
  const { t, language } = useTranslation();
  const sections = [
    {
      className: "opening-plan",
      title: t("opening.plan"),
      text: view.motif.plan[language],
    },
    {
      className: "opening-mistake",
      title: t("opening.mistake"),
      text: view.motif.temptation[language],
    },
    {
      className: "opening-defense",
      title: t("opening.defense"),
      text: view.motif.defense[language],
    },
  ];
  return (
    <>
      <details className="opening-background" open={!view.compact}>
        <summary>{t("opening.background")}</summary>
        <div className="opening-background-content">
          {sections.map((section, index) => (
            <div key={section.className} className={section.className}>
              <h3>{section.title}</h3>
              <p>
                <SquareText text={section.text} />
              </p>
              {index === 2 && (
                <>
                  <span className={`opening-risk ${lesson.risk}`}>
                    {t(`opening.risk.${lesson.risk}`)}
                  </span>
                  {lesson.risk !== "low" && (
                    <p className="opening-risk-detail">
                      {t(`opening.risk.detail.${lesson.risk}`)}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </details>
      {view.finished && !view.frame.checkmate && (
        <div className="opening-complete" role="status">
          <h3>
            {t(
              view.branch === "defense"
                ? "opening.result.defense"
                : "opening.complete",
            )}
          </h3>
          <p>
            {t(
              view.branch === "trap"
                ? `opening.reward.${lesson.reward}`
                : "opening.defense.takeaway",
            )}
          </p>
          <button onClick={() => view.changeStep(0)}>
            <RotateCcw size={15} />
            {t("opening.restart")}
          </button>
        </div>
      )}
    </>
  );
}
