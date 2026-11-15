import { useMemo } from "react";
import { X } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { gameMoveLabel } from "../../domain/chess/position.ts";
import type { Translator } from "../../i18n/translate.ts";
import type { BoardPreview } from "./useBoardPreview.ts";
import { SquareText } from "./SquareHighlight.tsx";
import { walkthroughPresentation } from "./walkthroughPresentation.ts";
function walkthroughFrames(
  preview: BoardPreview["pinnedInspection"],
  t: Translator,
) {
  if (!preview?.walkthrough) return [];
  const { candidate, walkthrough } = preview;
  return candidate.continuation
    .slice(0, walkthrough.endPly)
    .map((move, index) => {
      const ply = index + 1;
      const result =
        ply === walkthrough.endPly &&
        walkthrough.capturePly !== undefined &&
        ply > walkthrough.capturePly &&
        !move.san.endsWith("#");
      const label = t(
        ply === 1
          ? "board.walkthrough.yourMove"
          : ply === walkthrough.capturePly
            ? "board.walkthrough.capture"
            : result
              ? "board.walkthrough.result"
              : move.color === candidate.move.color
                ? "board.walkthrough.yourReply"
                : "board.walkthrough.theirReply",
      );
      return {
        move,
        ply,
        label,
        ...walkthroughPresentation(move, candidate.move.color, t),
        annotation: walkthrough.steps[index],
      };
    });
}
export function CaptureWalkthroughControls({
  preview,
}: {
  preview: BoardPreview;
}) {
  const { t } = useTranslation();
  const pinned = preview.pinnedInspection;
  const frames = useMemo(
    () => walkthroughFrames(pinned, t),
    [pinned?.candidate, pinned?.walkthrough, t],
  );
  if (!pinned?.walkthrough) return null;
  const { candidate, walkthrough, ply } = pinned,
    current = frames[ply - 1];
  const inspect = (next: number) =>
    preview.inspectMove(
      candidate,
      next,
      "click",
      frames[next - 1].annotation.focus,
      walkthrough,
    );
  return (
    <section
      className="board-preview-controls capture-walkthrough"
      aria-label={t("board.walkthrough.title")}
    >
      <div className="board-preview-heading">
        <strong>{t("board.walkthrough.title")}</strong>
      </div>
      <div
        className="walkthrough-caption"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="walkthrough-side">{current.label}</span>
        <p>
          <SquareText text={current.description} />
        </p>
        {current.note && <p className="walkthrough-note">{current.note}</p>}
        {current.annotation.text && (
          <p className="walkthrough-threat">
            <SquareText text={current.annotation.text} />
          </p>
        )}
        {ply === walkthrough.endPly && walkthrough.outcome && (
          <p className="walkthrough-outcome">{walkthrough.outcome}</p>
        )}
      </div>
      <div
        className="walkthrough-moves"
        role="group"
        aria-label={t("board.walkthrough.moves")}
      >
        {frames.map((frame) => (
          <button
            type="button"
            key={frame.ply}
            className={
              frame.ply === walkthrough.capturePly
                ? "walkthrough-capture"
                : undefined
            }
            aria-pressed={ply === frame.ply}
            aria-label={t(
              "coach.continuation.previewMove",
              frame.ply,
              frame.label,
              frame.description,
            )}
            onClick={() => inspect(frame.ply)}
          >
            <span>{frame.label}</span>
            <strong>{gameMoveLabel(frame.move)}</strong>
          </button>
        ))}
      </div>
      <div className="walkthrough-footer">
        <button
          type="button"
          className="preview-return"
          onClick={preview.clearPreview}
        >
          <X size={15} aria-hidden="true" /> {t("coach.panel.returnToGame")}
        </button>
      </div>
    </section>
  );
}
