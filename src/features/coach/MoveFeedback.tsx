import { useEffect, useId } from "react";
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
  const bodyId = useId();
  const review = result.state === "ready" ? result.review : undefined;
  const status =
    result.state === "thinking"
      ? "Reviewing…"
      : result.state === "error"
        ? "Review unavailable"
        : review?.label;
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
      aria-label="Move feedback"
      aria-busy={result.state === "thinking"}
    >
      <h3 className="feedback-heading">
        <button
          type="button"
          className="feedback-toggle"
          aria-expanded={!collapsed}
          aria-controls={bodyId}
          aria-label={`${context}: ${moveLabel}. ${status}. ${collapsed ? "Show" : "Hide"} details`}
          onClick={onToggle}
        >
          <span className="feedback-move">
            <span className="feedback-context">{context}</span>
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
              Looking at your move and the best alternatives…
            </p>
          ) : result.state === "error" ? (
            <>
              <p>
                <SquareText text={result.error} />
              </p>
              <button className="text-action" onClick={onReanalyze}>
                Retry move review
              </button>
            </>
          ) : (
            review && (
              <>
                <p className="move-description">
                  <SquareText text={moveDescription(review.move)} />
                </p>
                <p>
                  <SquareText text={review.text} />
                </p>
                {review.lesson && (
                  <div className="move-lesson">
                    <span>Next time</span>
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
                        <Eye size={13} /> Likely reply
                      </button>
                    )}
                  </div>
                  <small title="The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.">
                    Quick review
                    {review.label !== "Best move" && review.loss !== null ? (
                      <> · {review.loss.toFixed(1)} evaluation drop</>
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
