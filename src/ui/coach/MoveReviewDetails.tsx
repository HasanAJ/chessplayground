import { useMemo } from "react";
import { Eye } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import type { MoveReview } from "../../domain/coach/grading.ts";
import { boardFocus } from "../../domain/coach/boardFocus.ts";
import {
  compactMoveDescription,
  moveDescription,
} from "../../domain/chess/moves.ts";
import { pieceImage } from "../board/pieces.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import type {
  ClearInspection,
  InspectMove,
  MovePreview,
} from "../board/useBoardPreview.ts";
import { ExplanationLink } from "./ExplanationLink.tsx";
import { movePreviewEvents } from "./previewEvents.ts";
type Props = {
  review: MoveReview;
  preview: MovePreview | null;
  onInspect: InspectMove;
  onClearInspection: ClearInspection;
};
export function MoveReviewDetails({ review, ...inspection }: Props) {
  const { t } = useTranslation();
  const lesson = review.lesson,
    consequence = lesson?.kind === "consequence" ? lesson : undefined;
  const incoming = consequence?.candidate.continuation[1];
  const best = review.best,
    label = t("coach.feedback.bestMove", moveDescription(best.move, t));
  const focus = useMemo(
    () => boardFocus(label, [{ from: best.move.from, to: best.move.to }]),
    [label, best.move.from, best.move.to],
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
            <SquareText text={review.text} move={incoming} />
          </p>
        )}
        {consequence ? (
          <ExplanationLink
            {...inspection}
            candidate={consequence.candidate}
            focus={consequence.focus}
            ply={consequence.ply}
            walkthrough={consequence.walkthrough}
          />
        ) : (
          review.label !== "Miss" &&
          review.reply && (
            <button
              className="text-action"
              {...movePreviewEvents({
                ...inspection,
                candidate: review.reply,
                ply: 1,
              })}
              onClick={() => inspection.onInspect(review.reply!, 1, "click")}
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
            {...inspection}
            className="feedback-best-move"
            candidate={best}
            focus={focus}
            label={label}
          >
            <img
              className="feedback-best-piece"
              src={pieceImage({
                color: best.move.color,
                type: best.move.piece,
              })}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
            <span className="feedback-best-copy">
              <span className="feedback-best-label">
                {t("coach.grade.best")}
              </span>
              <strong>
                <SquareText
                  text={compactMoveDescription(best.move, t)}
                  focusable={false}
                />
              </strong>
            </span>
            <span className="feedback-preview-label">
              <Eye size={14} aria-hidden="true" />
              {t("board.preview.label")}
            </span>
          </ExplanationLink>
          {review.bestReason && (
            <p className="feedback-best-reason">
              <SquareText text={review.bestReason} move={incoming} />
            </p>
          )}
        </div>
      )}
    </>
  );
}
