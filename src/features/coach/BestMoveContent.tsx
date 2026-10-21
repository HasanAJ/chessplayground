import { useTranslation } from "../../i18n/LanguageProvider";
import { Lightbulb } from "lucide-react";
import { MoveExploration } from "./MoveDetails";
import type { MovePreviewProps } from "./previewEvents";
import { moveDescription } from "../../chess/moves";
import { SquareText } from "../board/SquareHighlight";
import { BestMoveHeading } from "./BestMoveHeading";
import { PlayBestMoveButton } from "./PlayBestMoveButton";

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
      <div className="card-eyebrow">
        <Lightbulb size={16} /> <span>{t("coach.best.heading")}</span>
        {forcedMove && (
          <span className="forced-move-badge">
            {t("coach.best.forced")}
          </span>
        )}
      </div>
      <BestMoveHeading candidate={candidate} />
      <p className="move-description">
        <SquareText text={moveDescription(candidate.move, t)} />
      </p>
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
