import { useEffect } from "react";
import { sideName } from "../../chess/position";
import { moveDescription } from "../../chess/moves";
import { ExplanationLink } from "./ExplanationLink";
import { SquareText } from "../board/SquareHighlight";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents";

export function LikelyReply({
  candidate,
  onInspect,
}: Omit<MovePreviewProps, "preview">) {
  const replyPly = Math.min(2, candidate.continuation.length);
  return (
    <button
      type="button"
      className="reply-box detail-preview"
      aria-label={`Preview likely reply: ${candidate.reply}`}
      {...movePreviewEvents(onInspect, candidate, replyPly)}
      onClick={() => onInspect(candidate, replyPly, "click")}
    >
      <span>LIKELY REPLY</span>
      <span className="reply-text">
        <SquareText text={candidate.reply} focusable={false} />
      </span>
    </button>
  );
}

export function Continuation({
  candidate,
  preview,
  onInspect,
}: MovePreviewProps) {
  return (
    <div className="continuation" aria-label="Engine continuation">
      <div className="continuation-heading">
        <span>POSSIBLE NEXT MOVES</span>
      </div>
      <div className="continuation-moves">
        {candidate.continuation.map((move, index) => {
          const current =
            preview?.candidate === candidate && preview.ply === index + 1;
          const description = moveDescription(move);
          return (
            <button
              key={index}
              className={current ? "current-step" : ""}
              aria-label={`Preview move ${index + 1}: ${sideName(move.color)} plays ${move.san}`}
              aria-pressed={current}
              title={description}
              {...movePreviewEvents(onInspect, candidate, index + 1)}
              onClick={() => onInspect(candidate, index + 1, "click")}
            >
              <small>
                {move.before.split(" ")[5]}
                {move.color === "w" ? "." : "…"}
              </small>{" "}
              <span>
                <SquareText text={move.san} focusable={false} />
              </span>
              <span className="continuation-description">
                <SquareText text={description} focusable={false} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CandidateDetails(props: MovePreviewProps) {
  const { candidate, onInspect } = props;
  useEffect(() => () => onInspect(candidate, 0), [onInspect, candidate]);
  return (
    <>
      <p className="move-explanation">
        <SquareText text={candidate.explanation} />
      </p>
      <ExplanationLink {...props} />
      <LikelyReply {...props} />
      <Continuation {...props} />
    </>
  );
}
