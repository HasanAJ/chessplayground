import { Eye, Lightbulb } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider";
import type { Candidate } from "./candidates";
import { SquareText } from "../board/SquareHighlight";
import { BestMoveHeading } from "./BestMoveHeading";
import { PlayBestMoveButton } from "./PlayBestMoveButton";

export function MobileCoachSummary({
  candidate,
  onPlay,
  onPreviewReply,
}: {
  candidate: Candidate;
  onPlay: () => void;
  onPreviewReply: () => void;
}) {
  const { t } = useTranslation();
  return (
    <section
      className="mobile-coach-summary"
      aria-label={t("coach.analysis.label")}
    >
      <div className="card-eyebrow">
        <Lightbulb size={14} /> {t("coach.best.heading")}
      </div>
      <BestMoveHeading candidate={candidate} />
      <p>
        <SquareText text={candidate.explanation} />
      </p>
      <div className="plan-actions">
        <PlayBestMoveButton san={candidate.move.san} onPlay={onPlay} />
        {candidate.continuation.length > 1 && (
          <button className="plan-preview" onClick={onPreviewReply}>
            <Eye size={14} /> {t("coach.best.previewReply")}
          </button>
        )}
      </div>
    </section>
  );
}
