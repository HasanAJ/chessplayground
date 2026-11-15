import { translateNotice } from "../../i18n/notices";
import { localizeReview, type MoveReview } from "./grading";
import type { MessageKey } from "../../i18n/translate";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useId, useMemo } from "react";
import { ChevronDown, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import type { ReviewState } from "./moveReview";
import type {
  ClearInspection,
  InspectMove,
  MovePreview,
} from "../board/useBoardPreview";
import { MoveReviewDetails } from "./MoveReviewDetails";
import { SquareText } from "../board/SquareHighlight";
import type { Move } from "chess.js";
import { pieceImage } from "../board/pieces";
import { compactMoveDescription } from "../../chess/moves";
import { formatEvaluation } from "../../chess/evaluation";

const gradeKeys = {
  "Best move": "coach.grade.best",
  "Excellent move": "coach.grade.excellent",
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
  onClearInspection,
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
  onClearInspection: ClearInspection;
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
  const StatusIcon =
    result.state === "thinking"
      ? LoaderCircle
      : review &&
          ["Best move", "Excellent move", "Good move"].includes(review.label)
        ? CircleCheck
        : CircleAlert;
  const moveTitle = compactMoveDescription(move, t);
  useEffect(() => {
    if (collapsed) return;
    return () => {
      if (review?.best) onClearInspection(review.best);
      if (review?.reply) onClearInspection(review.reply);
      if (review?.lesson?.kind === "consequence")
        onClearInspection(review.lesson.candidate);
    };
  }, [collapsed, onClearInspection, review?.best, review?.reply, review?.lesson]);
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
          <span className="quality-badge" role="status">
            <StatusIcon
              size={22}
              className={result.state === "thinking" ? "spin" : undefined}
              aria-hidden="true"
            />
            <span>{status}</span>
          </span>
          {review && (
            <span
              className="feedback-position-score"
              title={t("board.evaluation.legend")}
            >
              <span>{t("coach.position.evaluation")}</span>
              <strong>{formatEvaluation(review.evaluation, t.language)}</strong>
            </span>
          )}
          <ChevronDown
            size={18}
            className="feedback-chevron"
            aria-hidden="true"
          />
          {collapsed && (
            <span className="feedback-collapsed-move">
              {t(context)} · <SquareText text={moveTitle} focusable={false} />
            </span>
          )}
        </button>
      </h3>
      <div id={bodyId} className="feedback-body" hidden={collapsed}>
        {!collapsed && (
          <div className="feedback-trail">
            <div className="feedback-move">
              <span className="feedback-piece-node" aria-hidden="true">
                <img
                  className="feedback-piece"
                  src={pieceImage({ color: move.color, type: move.piece })}
                  alt=""
                  draggable={false}
                />
              </span>
              <div className="feedback-move-copy">
                <span className="feedback-context">{t(context)}</span>
                <strong>
                  <SquareText text={moveTitle} />
                </strong>
              </div>
            </div>
            {result.state === "thinking" ? (
              <p className="feedback-explanation">
                {t("coach.feedback.pending")}
              </p>
            ) : result.state === "error" ? (
              <div className="feedback-explanation">
                <p>
                  <SquareText text={translateNotice(result.error, t)} />
                </p>
                <button className="text-action" onClick={onReanalyze}>
                  {t("coach.feedback.retry")}
                </button>
              </div>
            ) : (
              review && (
                <MoveReviewDetails
                  review={review}
                  preview={preview}
                  onInspect={onInspect}
                  onClearInspection={onClearInspection}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
