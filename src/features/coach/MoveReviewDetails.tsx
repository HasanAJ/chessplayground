import { Eye } from "lucide-react";
import { formatEvaluation } from "../../chess/evaluation";
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
      {lesson?.kind === "alternative" && (
        <div className="feedback-alternative">
          <p>
            <strong>
              <SquareText
                text={t("coach.feedback.tryInstead", lesson.candidate.move.san)}
              />
            </strong>
          </p>
          <ExplanationLink
            candidate={lesson.candidate}
            focus={lesson.focus}
            ply={lesson.ply}
            label={t("coach.feedback.previewMove", lesson.candidate.move.san)}
            preview={preview}
            onInspect={onInspect}
            onClearInspection={onClearInspection}
          />
        </div>
      )}
    </>
  );
}
