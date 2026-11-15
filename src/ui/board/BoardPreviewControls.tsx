import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { moveDescription } from "../../domain/chess/moves.ts";
import type { BoardPreview } from "./useBoardPreview.ts";
import { SquareText } from "./SquareHighlight.tsx";
import { CaptureWalkthroughControls } from "./CaptureWalkthroughControls.tsx";
export function BoardPreviewControls({ preview }: { preview: BoardPreview }) {
  const { t } = useTranslation();
  const pinned = preview.pinnedInspection;
  if (pinned === null) return null;
  if (pinned.walkthrough)
    return <CaptureWalkthroughControls preview={preview} />;
  const total = pinned.candidate.continuation.length;
  const controls = [
    {
      ply: pinned.ply - 1,
      disabled: pinned.ply <= 1,
      label: t("board.preview.previous"),
      Icon: ChevronLeft,
    },
    {
      ply: pinned.ply + 1,
      disabled: pinned.ply >= total,
      label: t("board.preview.next"),
      Icon: ChevronRight,
    },
  ];
  const select = (ply: number) =>
    preview.inspectMove(
      pinned.candidate,
      ply,
      "click",
      ply === 1 ? pinned.candidate.explanationFocus : undefined,
    );
  return (
    <section
      className="board-preview-controls"
      aria-label={t("board.preview.label")}
    >
      <div className="board-preview-heading">
        <span>{t("board.preview.label")}</span>
        <span>
          {pinned.ply} / {total}
        </span>
      </div>
      <p>
        <SquareText
          text={moveDescription(
            pinned.candidate.continuation[pinned.ply - 1],
            t,
          )}
        />
      </p>
      <div className="board-preview-actions">
        {controls.map(({ ply, disabled, label, Icon }) => (
          <button
            key={label}
            className="icon-button"
            aria-label={label}
            disabled={disabled}
            onClick={() => select(ply)}
          >
            <Icon size={18} />
          </button>
        ))}
        <button className="preview-return" onClick={preview.clearPreview}>
          <X size={15} /> {t("coach.panel.returnToGame")}
        </button>
      </div>
    </section>
  );
}
