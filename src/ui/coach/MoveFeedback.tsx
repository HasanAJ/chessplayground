import { useEffect, useId, useMemo } from "react";
import type { Move } from "chess.js";
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  LoaderCircle,
} from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { translateNotice } from "../../i18n/notices.ts";
import { localizeReview, type MoveReview } from "../../domain/coach/grading.ts";
import { compactMoveDescription } from "../../domain/chess/moves.ts";
import { formatEvaluation } from "../../domain/chess/evaluation.ts";
import type { ReviewState } from "../../application/review/moveReview.ts";
import { pieceImage } from "../board/pieces.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import type {
  ClearInspection,
  InspectMove,
  MovePreview,
} from "../board/useBoardPreview.ts";
import { MoveReviewDetails } from "./MoveReviewDetails.tsx";
const grades = {
  "Best move": "coach.grade.best",
  "Excellent move": "coach.grade.excellent",
  "Good move": "coach.grade.good",
  Inaccuracy: "coach.grade.inaccuracy",
  Mistake: "coach.grade.mistake",
  Miss: "coach.grade.miss",
  Blunder: "coach.grade.blunder",
} as const;
type Props = {
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
};
function useReviewInspection(
  review: MoveReview | undefined,
  collapsed: boolean,
  clear: ClearInspection,
) {
  useEffect(() => {
    if (collapsed) return;
    return () => {
      const candidates = [
        review?.best,
        review?.reply,
        review?.lesson?.kind === "consequence"
          ? review.lesson.candidate
          : undefined,
      ];
      candidates.forEach((candidate) => {
        if (candidate) clear(candidate);
      });
    };
  }, [collapsed, clear, review?.best, review?.reply, review?.lesson]);
}
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
}: Props) {
  const { t } = useTranslation(),
    body = useId();
  const stored = result.state === "ready" ? result.review : undefined;
  const review = useMemo(
    () => stored && localizeReview(stored, t),
    [stored, t],
  );
  useReviewInspection(review, collapsed, onClearInspection);
  const waiting = result.state === "thinking";
  const status = waiting
    ? t("coach.feedback.status.reviewing")
    : review
      ? t(grades[review.label])
      : t("coach.feedback.status.unavailable");
  const positive =
    review &&
    ["Best move", "Excellent move", "Good move"].includes(review.label);
  const Icon = waiting
    ? LoaderCircle
    : review?.label === "Miss"
      ? CircleDashed
      : positive
        ? CircleCheck
        : CircleAlert;
  const title = compactMoveDescription(move, t),
    caption = t(context);
  return (
    <section
      className="move-feedback"
      data-rating={review?.label}
      data-collapsed={collapsed}
      aria-label={t("coach.feedback.label")}
      aria-busy={waiting}
    >
      <h3 className="feedback-heading">
        <button
          type="button"
          className="feedback-toggle"
          aria-expanded={!collapsed}
          aria-controls={body}
          aria-label={t(
            "coach.feedback.toggleDescription",
            caption,
            moveLabel,
            status,
            t(collapsed ? "common.show" : "common.hide"),
          )}
          onClick={onToggle}
        >
          <span className="quality-badge" role="status">
            <Icon
              size={22}
              className={waiting ? "spin" : undefined}
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
              {caption} · <SquareText text={title} focusable={false} />
            </span>
          )}
        </button>
      </h3>
      <div id={body} className="feedback-body" hidden={collapsed}>
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
                <span className="feedback-context">{caption}</span>
                <strong>
                  <SquareText text={title} />
                </strong>
              </div>
            </div>
            {waiting ? (
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
