import { Eye } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "../../i18n/LanguageProvider";
import type {
  ClearInspection,
  InspectMove,
  MovePreview,
} from "../board/useBoardPreview";
import { SquareText } from "../board/SquareHighlight";
import type { MoveReview } from "./grading";
import { ExplanationLink } from "./ExplanationLink";
import { movePreviewEvents } from "./previewEvents";
import { boardFocus } from "./boardFocus";
import { pieceImage } from "../board/pieces";
import { compactMoveDescription, moveDescription } from "../../chess/moves";

export function MoveReviewDetails({
  review,
  preview,
  onInspect,
  onClearInspection,
}: {
  review: MoveReview;
  preview: MovePreview | null;
  onInspect: InspectMove;
  onClearInspection: ClearInspection;
}) {
  const { t } = useTranslation();
  const { best, reply, lesson } = review;
  const consequenceMove =
    lesson?.kind === "consequence"
      ? lesson.candidate.continuation[1]
      : undefined;
  const bestMoveTitle = compactMoveDescription(best.move, t);
  const bestMoveLabel = t("coach.feedback.bestMove", moveDescription(best.move, t));
  const bestMoveFocus = useMemo(
    () => boardFocus(bestMoveLabel, [{ from: best.move.from, to: best.move.to }]),
    [bestMoveLabel, best.move.from, best.move.to],
  );
  return (
    <>
      <div
        className={`feedback-explanation${lesson?.walkthrough ? " feedback-later" : ""}`}
      >
        {lesson?.walkthrough && (
          <span className="feedback-consequence-label">
            {t("coach.feedback.whatThisAllows")}
          </span>
        )}
        {review.text && (
          <p>
            <SquareText text={review.text} move={consequenceMove} />
          </p>
        )}
        {lesson?.kind === "consequence" ? (
          <ExplanationLink
            candidate={lesson.candidate}
            focus={lesson.focus}
            ply={lesson.ply}
            walkthrough={lesson.walkthrough}
            preview={preview}
            onInspect={onInspect}
            onClearInspection={onClearInspection}
          />
        ) : (
          reply && (
            <button
              className="text-action"
              {...movePreviewEvents({
                onInspect,
                onClearInspection,
                candidate: reply,
                ply: 1,
              })}
              onClick={() => onInspect(reply, 1, "click")}
            >
              <Eye size={13} aria-hidden="true" />{" "}
              {t("coach.feedback.likelyReply")}
            </button>
          )
        )}
      </div>
      {review.label !== "Best move" && (
        <div className="feedback-alternative">
          <ExplanationLink
            className="feedback-best-move"
            candidate={best}
            focus={bestMoveFocus}
            label={bestMoveLabel}
            preview={preview}
            onInspect={onInspect}
            onClearInspection={onClearInspection}
          >
            <img
              className="feedback-best-piece"
              src={pieceImage({ color: best.move.color, type: best.move.piece })}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
            <span className="feedback-best-copy">
              <span className="feedback-best-label">{t("coach.grade.best")}</span>
              <strong>
                <SquareText text={bestMoveTitle} focusable={false} />
              </strong>
            </span>
            <span className="feedback-preview-label">
              <Eye size={14} aria-hidden="true" />
              {t("board.preview.label")}
            </span>
          </ExplanationLink>
          {review.bestReason && (
            <p className="feedback-best-reason">
              <SquareText text={review.bestReason} move={consequenceMove} />
            </p>
          )}
        </div>
      )}
    </>
  );
}
