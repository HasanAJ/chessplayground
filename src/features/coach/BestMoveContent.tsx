import { useTranslation } from "../../i18n/LanguageProvider";
import { Lightbulb } from "lucide-react";
import { MoveExploration } from "./MoveDetails";
import type { MovePreviewProps } from "./previewEvents";
import { SquareText } from "../board/SquareHighlight";
import { BestMoveHeading } from "./BestMoveHeading";
import { PlayBestMoveButton } from "./PlayBestMoveButton";
import { PositionScore } from "./PositionScore";
import { pieceImage } from "../board/pieces";

export function BestMoveContent({
  candidate,
  forcedMove,
  onPlay,
  ...previewProps
}: MovePreviewProps & {
  forcedMove: boolean;
  onPlay: () => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="suggested-move-header">
        <div className="card-eyebrow">
          <Lightbulb size={16} /> <span>{t("coach.best.heading")}</span>
          {forcedMove && (
            <span className="forced-move-badge">
              {t("coach.best.forced")}
            </span>
          )}
        </div>
        <PositionScore evaluation={candidate} />
      </div>
      <div className="suggested-move-summary">
        <span className="candidate-piece" aria-hidden="true">
          <img
            src={pieceImage({ color: candidate.move.color, type: candidate.move.piece })}
            alt=""
            draggable={false}
          />
        </span>
        <div className="suggested-move-copy">
          <BestMoveHeading candidate={candidate} />
          <span className="move-strategy-tag">
            <SquareText text={candidate.title} />
          </span>
        </div>
      </div>
      {candidate.explanation && (
        <p>
          <SquareText text={candidate.explanation} />
        </p>
      )}
      <MoveExploration candidate={candidate} {...previewProps}>
        <PlayBestMoveButton san={candidate.move.san} onPlay={onPlay} />
      </MoveExploration>
    </>
  );
}
