import { Eye } from "lucide-react";
import { SquareText } from "../board/SquareHighlight";
import type { BoardFocus } from "./boardFocus";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents";

export function ExplanationLink({
  candidate,
  focus = candidate.explanationFocus,
  preview,
  onInspect,
  ply = 1,
  label = focus?.label,
}: MovePreviewProps & { focus?: BoardFocus; ply?: number; label?: string }) {
  if (!label) return null;
  const current =
    preview?.candidate === candidate &&
    preview.ply === ply &&
    preview.focus === focus;
  return (
    <button
      type="button"
      className="text-action explanation-link"
      aria-pressed={current}
      {...movePreviewEvents(onInspect, candidate, ply, focus)}
      onClick={() => onInspect(candidate, ply, "click", focus)}
    >
      <Eye size={13} aria-hidden="true" />{" "}
      <SquareText text={label} focusable={false} />
    </button>
  );
}
