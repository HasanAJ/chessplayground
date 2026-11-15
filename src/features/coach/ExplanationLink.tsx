import { Eye } from "lucide-react";
import type { ReactNode } from "react";
import { SquareText } from "../board/SquareHighlight";
import type { BoardFocus } from "./boardFocus";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents";
import type { LessonWalkthrough } from "./lessonWalkthrough";

export function ExplanationLink({
  candidate,
  focus = candidate.explanationFocus,
  preview,
  onInspect,
  onClearInspection,
  ply = 1,
  label = focus?.label,
  walkthrough,
  children,
  className,
}: MovePreviewProps & {
  focus?: BoardFocus;
  ply?: number;
  label?: string;
  walkthrough?: LessonWalkthrough;
  children?: ReactNode;
  className?: string;
}) {
  if (!label) return null;
  const current =
    preview?.candidate === candidate &&
    (walkthrough
      ? preview.walkthrough === walkthrough
      : preview.ply === ply && preview.focus === focus);
  return (
    <button
      type="button"
      className={`text-action explanation-link${className ? ` ${className}` : ""}`}
      aria-label={label}
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
      {children ?? (
        <>
          <Eye size={13} aria-hidden="true" />{" "}
          <SquareText text={label} focusable={false} />
        </>
      )}
    </button>
  );
}
