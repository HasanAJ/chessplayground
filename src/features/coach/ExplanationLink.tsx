import { Eye } from "lucide-react";
import { SquareText } from "../board/SquareHighlight";
import type { BoardFocus } from "./boardFocus";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents";

export function ExplanationLink({
  candidate,
  focus = candidate.explanationFocus,
  preview,
  onInspect,
  onClearInspection,
  ply = 1,
  label = focus?.label,
  capturePly,
}: MovePreviewProps & {
  focus?: BoardFocus;
  ply?: number;
  label?: string;
  capturePly?: number;
}) {
  if (!label) return null;
  const current =
    preview?.candidate === candidate &&
    (capturePly
      ? preview.walkthrough?.capturePly === capturePly
      : preview.ply === ply && preview.focus === focus);
  const walkthrough = capturePly && focus ? { capturePly, focus } : undefined;
  return (
    <button
      type="button"
      className="text-action explanation-link"
      aria-pressed={current}
      {...movePreviewEvents({
        onInspect,
        onClearInspection,
        candidate,
        ply,
        focus,
        enabled: !walkthrough,
      })}
      onClick={() => {
        if (!current || !walkthrough)
          onInspect(
            candidate,
            walkthrough ? 1 : ply,
            "click",
            walkthrough ? undefined : focus,
            walkthrough,
          );
      }}
    >
      <Eye size={13} aria-hidden="true" />{" "}
      <SquareText text={label} focusable={false} />
    </button>
  );
}
