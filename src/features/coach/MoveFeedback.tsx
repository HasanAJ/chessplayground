import { translateNotice } from "../../i18n/notices";
import { localizeReview, type MoveReview } from "./grading";
import type { MessageKey } from "../../i18n/translate";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useId, useMemo } from "react";
import { ChevronDown, Eye, LoaderCircle } from "lucide-react";
import type { ReviewState } from "./moveReview";
import type { InspectMove, MovePreview } from "../board/useBoardPreview";
import { movePreviewEvents } from "./previewEvents";
import { moveDescription } from "../../chess/moves";
import { ExplanationLink } from "./ExplanationLink";
import { SquareText } from "../board/SquareHighlight";

const gradeKeys = {
  "Best move": "coach.grade.best",
  "Good move": "coach.grade.good",
  Inaccuracy: "coach.grade.inaccuracy",
  Mistake: "coach.grade.mistake",
  Blunder: "coach.grade.blunder",
} satisfies Record<MoveReview["label"], MessageKey>;

export function MoveFeedback({
  result,
  moveLabel,
  context = "coach.feedback.context.lastMove",
  onReanalyze,
  onInspect,
  preview = null,
  collapsed,
  onToggle,
}: {
  result: ReviewState;
  moveLabel: string;
  context?:
    | "coach.feedback.context.lastMove"
    | "coach.feedback.context.yourLastMove"
    | "coach.feedback.context.selectedMove";
  onReanalyze: () => void;
  onInspect: InspectMove;
  preview?: MovePreview | null;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const bodyId = useId();
  const storedReview = result.state === "ready" ? result.review : undefined;
  const review = useMemo(
    () => (storedReview ? localizeReview(storedReview, t) : undefined),
    [storedReview, t],
  );
  const status =
    result.state === "thinking"
      ? t("coach.feedback.status.reviewing")
      : result.state === "error"
        ? t("coach.feedback.status.unavailable")
        : review
          ? t(gradeKeys[review.label])
          : "";
  useEffect(() => {
    if (collapsed) return;
    return () => {
      if (review?.reply) onInspect(review.reply, 0);
      if (review?.lesson) onInspect(review.lesson.candidate, 0);
    };
  }, [collapsed, onInspect, review?.reply, review?.lesson]);
  return (
    <section
      className="move-feedback"
      data-rating={review?.label}
      data-collapsed={collapsed}
      aria-label={t("coach.feedback.label")}
      aria-busy={result.state === "thinking"}
    >
      <h3 className="feedback-heading">
        <button
          type="button"
          className="feedback-toggle"
          aria-expanded={!collapsed}
          aria-controls={bodyId}
          aria-label={t(
            "coach.feedback.toggleDescription",
            t(context),
            moveLabel,
            status,
            collapsed ? t("common.show") : t("common.hide"),
          )}
          onClick={onToggle}
        >
          <span className="feedback-move">
            <span className="feedback-context">{t(context)}</span>
            <strong>
              <SquareText text={moveLabel} focusable={false} />
            </strong>
          </span>
          <span className="quality-badge" role="status">
            {result.state === "thinking" && (
              <LoaderCircle size={14} className="spin" />
            )}
            {status}
          </span>
          <ChevronDown
            size={18}
            className="feedback-chevron"
            aria-hidden="true"
          />
        </button>
      </h3>
      <div id={bodyId} className="feedback-body" hidden={collapsed}>
        {!collapsed &&
          (result.state === "thinking" ? (
            <p className="learning-pending">
              {t("coach.feedback.pending")}
            </p>
          ) : result.state === "error" ? (
            <>
              <p>
                <SquareText text={translateNotice(result.error, t)} />
              </p>
              <button className="text-action" onClick={onReanalyze}>
                {t("coach.feedback.retry")}
              </button>
            </>
          ) : (
            review && (
              <>
                <p className="move-description">
                  <SquareText text={moveDescription(review.move, t)} />
                </p>
                <div className="feedback-explanation">
                  <p>
                    <SquareText text={review.text} />
                  </p>
                  {review.lesson?.kind === "consequence" ? (
                    <ExplanationLink
                      candidate={review.lesson.candidate}
                      focus={review.lesson.focus}
                      ply={review.lesson.ply}
                      preview={preview}
                      onInspect={onInspect}
                    />
                  ) : (
                    review.reply && (
                      <button
                        className="text-action"
                        {...movePreviewEvents(onInspect, review.reply, 1)}
                        onClick={() => onInspect(review.reply!, 1, "click")}
                      >
                        <Eye size={13} aria-hidden="true" />{" "}
                        {t("coach.feedback.likelyReply")}
                      </button>
                    )
                  )}
                </div>
                {review.lesson?.kind === "alternative" && (
                  <div className="feedback-alternative">
                    <p>
                      <strong>
                        <SquareText
                          text={t(
                            "coach.feedback.tryInstead",
                            review.lesson.candidate.move.san,
                          )}
                        />
                      </strong>
                    </p>
                    <ExplanationLink
                      candidate={review.lesson.candidate}
                      focus={review.lesson.focus}
                      ply={review.lesson.ply}
                      label={t(
                        "coach.feedback.previewMove",
                        review.lesson.candidate.move.san,
                      )}
                      preview={preview}
                      onInspect={onInspect}
                    />
                  </div>
                )}
                {review.lesson && (
                  <div className="move-lesson">
                    <span>{t("coach.feedback.beforeYouMove")}</span>
                    <p>
                      <SquareText text={review.lesson.text} />
                    </p>
                  </div>
                )}
                {review.label !== "Best move" && review.loss !== null && (
                  <details className="feedback-analysis-details">
                    <summary>{t("coach.feedback.analysisDetails")}</summary>
                    <p>
                      {t(
                        "coach.feedback.evaluationDrop",
                        review.loss.toLocaleString(t.language, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        }),
                      )}
                    </p>
                    <small>{t("coach.feedback.quickReview")}</small>
                  </details>
                )}
              </>
            )
          ))}
      </div>
    </section>
  );
}
