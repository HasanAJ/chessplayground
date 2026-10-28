import { translateNotice } from "../../i18n/notices";
import { localizeReview, type MoveReview } from "./grading";
import type { MessageKey } from "../../i18n/translate";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useId, useMemo } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import type { ReviewState } from "./moveReview";
import type { InspectMove, MovePreview } from "../board/useBoardPreview";
import { MoveReviewDetails } from "./MoveReviewDetails";
import { SquareText } from "../board/SquareHighlight";
import type { Move } from "chess.js";
import { pieceImage } from "../board/pieces";

const gradeKeys = {
  "Best move": "coach.grade.best",
  "Good move": "coach.grade.good",
  Inaccuracy: "coach.grade.inaccuracy",
  Mistake: "coach.grade.mistake",
  Blunder: "coach.grade.blunder",
} satisfies Record<MoveReview["label"], MessageKey>;

export function MoveFeedback({
  result,
  move,
  moveLabel,
  context = "coach.feedback.context.lastMove",
  onReanalyze,
  onInspect,
  preview = null,
  collapsed,
  onToggle,
}: {
  result: ReviewState;
  move: Move;
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
              <img
                className="feedback-piece"
                src={pieceImage({ color: move.color, type: move.piece })}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <span>
                <SquareText text={moveLabel} focusable={false} />
              </span>
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
              <MoveReviewDetails
                review={review}
                preview={preview}
                onInspect={onInspect}
              />
            )
          ))}
      </div>
    </section>
  );
}
