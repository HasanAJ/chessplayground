import { Eye } from "lucide-react";
import { formatEvaluation } from "../../chess/evaluation";
import { useTranslation } from "../../i18n/LanguageProvider";
import type { InspectMove, MovePreview } from "../board/useBoardPreview";
import { SquareText } from "../board/SquareHighlight";
import type { MoveReview } from "./grading";
import { ExplanationLink } from "./ExplanationLink";
import { movePreviewEvents } from "./previewEvents";

export function MoveReviewDetails({
  review,
  preview,
  onInspect,
}: {
  review: MoveReview;
  preview: MovePreview | null;
  onInspect: InspectMove;
}) {
  const { t } = useTranslation();
  const { reply, lesson } = review;
  return (
    <>
      <p
        className="feedback-position-score"
        title={t("board.evaluation.legend")}
      >
        <span>{t("coach.position.evaluation")}</span>
        <strong>{formatEvaluation(review.evaluation, t.language)}</strong>
      </p>
      <div className="feedback-explanation">
        {review.text && (
          <p>
            <SquareText text={review.text} />
          </p>
        )}
        {lesson?.kind === "consequence" ? (
          <ExplanationLink
            candidate={lesson.candidate}
            focus={lesson.focus}
            ply={lesson.ply}
            preview={preview}
            onInspect={onInspect}
          />
        ) : (
          reply && (
            <button
              className="text-action"
              {...movePreviewEvents(onInspect, reply, 1)}
              onClick={() => onInspect(reply, 1, "click")}
            >
              <Eye size={13} aria-hidden="true" />{" "}
              {t("coach.feedback.likelyReply")}
            </button>
          )
        )}
      </div>
      {lesson?.kind === "alternative" && (
        <div className="feedback-alternative">
          <p>
            <strong>
              <SquareText
                text={t(
                  "coach.feedback.tryInstead",
                  lesson.candidate.move.san,
                )}
              />
            </strong>
          </p>
          <ExplanationLink
            candidate={lesson.candidate}
            focus={lesson.focus}
            ply={lesson.ply}
            label={t(
              "coach.feedback.previewMove",
              lesson.candidate.move.san,
            )}
            preview={preview}
            onInspect={onInspect}
          />
        </div>
      )}
    </>
  );
}
