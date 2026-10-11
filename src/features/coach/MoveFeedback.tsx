import { translateNotice } from "../../i18n/notices";
import { localizeReview } from "./grading";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useId, useMemo } from "react";
import { ChevronDown, Eye, LoaderCircle } from "lucide-react";
import type { ReviewState } from "./moveReview";
import type { InspectMove, MovePreview } from "../board/useBoardPreview";
import { movePreviewEvents } from "./previewEvents";
import { moveDescription } from "../../chess/moves";
import { ExplanationLink } from "./ExplanationLink";
import { SquareText } from "../board/SquareHighlight";

export function MoveFeedback({
  result,
  moveLabel,
  context = "Last move",
  onReanalyze,
  onInspect,
  preview = null,
  collapsed,
  onToggle,
}: {
  result: ReviewState;
  moveLabel: string;
  context?: "Last move" | "Your last move" | "Selected move";
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
      ? t("Reviewing…")
      : result.state === "error"
        ? t("Review unavailable")
        : review
          ? t(review.label)
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
      aria-label={t("Move feedback")}
      aria-busy={result.state === "thinking"}
    >
      <h3 className="feedback-heading">
        <button
          type="button"
          className="feedback-toggle"
          aria-expanded={!collapsed}
          aria-controls={bodyId}
          aria-label={t(
            "{0}: {1}. {2}. {3} details",
            t(context),
            moveLabel,
            status,
            collapsed ? t("Show") : t("Hide"),
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
              {t("Looking at your move and the best alternatives…")}
            </p>
          ) : result.state === "error" ? (
            <>
              <p>
                <SquareText text={translateNotice(result.error, t)} />
              </p>
              <button className="text-action" onClick={onReanalyze}>
                {t("Retry move review")}
              </button>
            </>
          ) : (
            review && (
              <>
                <p className="move-description">
                  <SquareText text={moveDescription(review.move, t)} />
                </p>
                <p>
                  <SquareText text={review.text} />
                </p>
                {review.lesson && (
                  <div className="move-lesson">
                    <span>{t("Next time")}</span>
                    <p>
                      <SquareText text={review.lesson.text} />
                    </p>
                    <ExplanationLink
                      candidate={review.lesson.candidate}
                      focus={review.lesson.focus}
                      ply={review.lesson.ply}
                      preview={preview}
                      onInspect={onInspect}
                    />
                  </div>
                )}
                <div className="feedback-footer">
                  <div className="learning-actions">
                    {review.reply && (
                      <button
                        className="text-action"
                        {...movePreviewEvents(onInspect, review.reply, 1)}
                        onClick={() => onInspect(review.reply!, 1, "click")}
                      >
                        <Eye size={13} /> {t("Likely reply")}
                      </button>
                    )}
                  </div>
                  <small
                    title={t(
                      "The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.",
                    )}
                  >
                    {t("Quick review")}
                    {review.label !== "Best move" && review.loss !== null ? (
                      <>
                        {" "}
                        ·{" "}
                        {t(
                          "{0} evaluation drop",
                          review.loss.toLocaleString(t.language, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          }),
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </small>
                </div>
              </>
            )
          ))}
      </div>
    </section>
  );
}
