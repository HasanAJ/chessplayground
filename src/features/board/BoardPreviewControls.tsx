import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gameMoveLabel } from "../../chess/position";
import { moveDescription } from "../../chess/moves";
import { useTranslation } from "../../i18n/LanguageProvider";
import { SquareText } from "./SquareHighlight";
import type { BoardPreview } from "./useBoardPreview";

export function BoardPreviewControls({ preview }: { preview: BoardPreview }) {
  const { t } = useTranslation();
  const { pinnedInspection, inspectMove, clearPreview } = preview;
  if (!pinnedInspection) return null;
  const { candidate, ply } = pinnedInspection;
  const inspectionMove = candidate.continuation[ply - 1];
  return (
    <section
      className="board-preview-controls"
      aria-label={t("board.preview.label")}
    >
      <div className="board-preview-heading">
        <span>{t("board.preview.label")}</span>
        <strong>
          <SquareText text={gameMoveLabel(inspectionMove)} />
        </strong>
        <span>
          {ply} / {candidate.continuation.length}
        </span>
      </div>
      <p>
        <SquareText text={moveDescription(inspectionMove, t)} />
      </p>
      <div className="board-preview-actions">
        <button
          className="icon-button"
          aria-label={t("board.preview.previous")}
          disabled={ply === 1}
          onClick={() => inspectMove(candidate, ply - 1, "click")}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="icon-button"
          aria-label={t("board.preview.next")}
          disabled={ply === candidate.continuation.length}
          onClick={() => inspectMove(candidate, ply + 1, "click")}
        >
          <ChevronRight size={18} />
        </button>
        <button className="preview-return" onClick={clearPreview}>
          <X size={15} /> {t("coach.panel.returnToGame")}
        </button>
      </div>
    </section>
  );
}
