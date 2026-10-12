import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useId, useState } from "react";
import { Eye, Lightbulb } from "lucide-react";
import { LikelyReply, Continuation } from "./MoveDetails";
import type { MovePreviewProps } from "./previewEvents";
import { moveDescription } from "../../chess/moves";
import { ExplanationLink } from "./ExplanationLink";
import { SquareText } from "../board/SquareHighlight";
import { BestMoveHeading } from "./BestMoveHeading";
import { PlayBestMoveButton } from "./PlayBestMoveButton";

export function BestMoveContent({
  candidate,
  forcedMove,
  continuity,
  onPlay,
  ...previewProps
}: MovePreviewProps & {
  forcedMove: boolean;
  continuity: boolean;
  onPlay: () => void;
}) {
  const { t } = useTranslation();
  const [replyOpen, setReplyOpen] = useState(false);
  const replyId = useId();
  const { onInspect } = previewProps;
  useEffect(() => () => onInspect(candidate, 0), [onInspect, candidate]);
  const hasReply = candidate.continuation.length > 1;
  return (
    <>
      <div className="card-eyebrow">
        <Lightbulb size={16} /> <span>{t("coach.best.heading")}</span>
        {(forcedMove || continuity) && (
          <span className="plan-continuity">
            {forcedMove ? t("coach.best.forced") : t("coach.best.continuity")}
          </span>
        )}
      </div>
      <BestMoveHeading candidate={candidate} />
      <p className="move-description">
        <SquareText text={moveDescription(candidate.move, t)} />
      </p>
      <p>
        <SquareText text={candidate.explanation} />
      </p>
      <ExplanationLink candidate={candidate} {...previewProps} />
      <div className="plan-actions">
        <PlayBestMoveButton san={candidate.move.san} onPlay={onPlay} />
        {hasReply && (
          <button
            className="plan-preview"
            aria-expanded={replyOpen}
            aria-controls={replyId}
            onClick={() => {
              setReplyOpen(!replyOpen);
              onInspect(candidate, 0);
            }}
          >
            <Eye size={14} />{" "}
            {replyOpen ? t("coach.best.hideReply") : t("coach.best.previewReply")}
          </button>
        )}
      </div>
      {hasReply && (
        <div id={replyId} hidden={!replyOpen} className="best-move-reply">
          {replyOpen && (
            <>
              <LikelyReply candidate={candidate} {...previewProps} />
              <details
                className="continuation-details"
                onToggle={(event) => {
                  if (!event.currentTarget.open) onInspect(candidate, 0);
                }}
              >
                <summary>{t("coach.best.explore")}</summary>
                <Continuation candidate={candidate} {...previewProps} />
              </details>
            </>
          )}
        </div>
      )}
    </>
  );
}
