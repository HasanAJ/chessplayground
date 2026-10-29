import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider";
import { SquareText } from "./SquareHighlight";
import type { BoardPreview } from "./useBoardPreview";
import { walkthroughPresentation } from "./walkthroughPresentation";

export function CaptureWalkthroughControls({
  preview,
}: {
  preview: BoardPreview;
}) {
  const { t } = useTranslation();
  const { pinnedInspection, inspectMove, clearPreview } = preview;
  if (!pinnedInspection?.walkthrough) return null;
  const { candidate, ply, walkthrough } = pinnedInspection;
  const moves = candidate.continuation.slice(0, walkthrough.capturePly);
  const final = ply === walkthrough.capturePly;
  const { description, note } = walkthroughPresentation(
    moves[ply - 1],
    candidate.move.color,
    final,
    t,
  );
  function stepLabel(step: number) {
    return t(
      step === walkthrough.capturePly
        ? "board.walkthrough.capture"
        : step === 1
          ? "board.walkthrough.yourMove"
          : moves[step - 1].color === candidate.move.color
            ? "board.walkthrough.yourReply"
            : "board.walkthrough.theirReply",
    );
  }
  function selectMove(step: number) {
    inspectMove(
      candidate,
      step,
      "click",
      step === walkthrough.capturePly ? walkthrough.focus : undefined,
      walkthrough,
    );
  }
  return (
    <section
      className="board-preview-controls capture-walkthrough"
      aria-label={t("board.walkthrough.title")}
    >
      <div className="board-preview-heading">
        <strong>{t("board.walkthrough.title")}</strong>
        <span>{t("board.walkthrough.step", ply, moves.length)}</span>
      </div>
      <div className="walkthrough-caption" aria-live="polite" aria-atomic="true">
        <span className="walkthrough-side">{stepLabel(ply)}</span>
        <p>
          <SquareText text={description} />
        </p>
        <p className="walkthrough-note">{note}</p>
      </div>
      <div
        className="walkthrough-moves"
        role="group"
        aria-label={t("board.walkthrough.moves")}
      >
        {moves.map((move, index) => (
          <button
            type="button"
            key={index}
            className={
              index + 1 === walkthrough.capturePly
                ? "walkthrough-capture"
                : undefined
            }
            aria-pressed={ply === index + 1}
            aria-label={t(
              "coach.continuation.previewMove",
              index + 1,
              stepLabel(index + 1),
              walkthroughPresentation(
                move,
                candidate.move.color,
                index + 1 === walkthrough.capturePly,
                t,
              ).description,
            )}
            onClick={() => selectMove(index + 1)}
          >
            <span>{stepLabel(index + 1)}</span>
            <strong>
              {move.before.split(" ")[5]}{move.color === "w" ? "." : "…"}{" "}
              {move.san}
            </strong>
          </button>
        ))}
      </div>
      <div className="board-preview-actions">
        <button
          type="button"
          disabled={ply === 1}
          onClick={() => selectMove(ply - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" /> {t("board.walkthrough.back")}
        </button>
        <button type="button" disabled={final} onClick={() => selectMove(ply + 1)}>
          {t("board.walkthrough.next")}{" "}
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="walkthrough-footer">
        <span>{t("board.preview.label")}</span>
        <button type="button" className="preview-return" onClick={clearPreview}>
          <X size={15} aria-hidden="true" /> {t("coach.panel.returnToGame")}
        </button>
      </div>
    </section>
  );
}
