import { X } from "lucide-react";
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
  const moves = candidate.continuation.slice(0, walkthrough.endPly);
  const annotation = walkthrough.steps[ply - 1];
  const { description, note } = walkthroughPresentation(
    moves[ply - 1],
    candidate.move.color,
    t,
  );
  function stepLabel(step: number) {
    if (step === 1) return t("board.walkthrough.yourMove");
    if (step === walkthrough.capturePly) return t("board.walkthrough.capture");
    if (
      step === walkthrough.endPly &&
      walkthrough.capturePly !== undefined &&
      step > walkthrough.capturePly &&
      !moves[step - 1].san.endsWith("#")
    ) return t("board.walkthrough.result");
    return t(
      moves[step - 1].color === candidate.move.color
        ? "board.walkthrough.yourReply"
        : "board.walkthrough.theirReply",
    );
  }
  function selectMove(step: number) {
    inspectMove(
      candidate,
      step,
      "click",
      walkthrough.steps[step - 1].focus,
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
      </div>
      <div className="walkthrough-caption" aria-live="polite" aria-atomic="true">
        <span className="walkthrough-side">{stepLabel(ply)}</span>
        <p>
          <SquareText text={description} />
        </p>
        {note && <p className="walkthrough-note">{note}</p>}
        {annotation.text && (
          <p className="walkthrough-threat">
            <SquareText text={annotation.text} />
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
      <div className="walkthrough-footer">
        <button type="button" className="preview-return" onClick={clearPreview}>
          <X size={15} aria-hidden="true" /> {t("coach.panel.returnToGame")}
        </button>
      </div>
    </section>
  );
}
