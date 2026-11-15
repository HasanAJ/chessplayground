import { Lightbulb } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { pieceImage } from "../board/pieces.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import { MoveExploration } from "./MoveDetails.tsx";
import { BestMoveHeading } from "./BestMoveHeading.tsx";
import { PlayBestMoveButton } from "./PlayBestMoveButton.tsx";
import { PositionScore } from "./PositionScore.tsx";
import type { MovePreviewProps } from "./previewEvents.ts";
export function BestMoveContent({
  forcedMove,
  onPlay,
  ...preview
}: MovePreviewProps & { forcedMove: boolean; onPlay: () => void }) {
  const { t } = useTranslation();
  const recommendation = preview.candidate;
  const piece = {
    color: recommendation.move.color,
    type: recommendation.move.piece,
  };
  return (
    <>
      <div className="suggested-move-header">
        <div className="card-eyebrow">
          <Lightbulb size={16} /> <span>{t("coach.best.heading")}</span>
          {forcedMove && (
            <span className="forced-move-badge">{t("coach.best.forced")}</span>
          )}
        </div>
        <PositionScore evaluation={recommendation} />
      </div>
      <div className="suggested-move-summary">
        <span className="candidate-piece" aria-hidden="true">
          <img src={pieceImage(piece)} alt="" draggable={false} />
        </span>
        <div className="suggested-move-copy">
          <BestMoveHeading candidate={recommendation} />
          <span className="move-strategy-tag">
            <SquareText text={recommendation.title} />
          </span>
        </div>
      </div>
      {recommendation.explanation && (
        <p>
          <SquareText text={recommendation.explanation} />
        </p>
      )}
      <MoveExploration {...preview}>
        <PlayBestMoveButton san={recommendation.move.san} onPlay={onPlay} />
      </MoveExploration>
    </>
  );
}
