import { Eye } from "lucide-react";
import type { ReactNode } from "react";
import type { BoardFocus } from "../../domain/coach/boardFocus.ts";
import type { LessonWalkthrough } from "../../domain/coach/lessonWalkthrough.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents.ts";
type Props = MovePreviewProps & {
  focus?: BoardFocus;
  ply?: number;
  label?: string;
  walkthrough?: LessonWalkthrough;
  children?: ReactNode;
  className?: string;
};
export function ExplanationLink(props: Props) {
  const { candidate, preview, walkthrough } = props;
  const focus = props.focus ?? candidate.explanationFocus,
    ply = props.ply ?? 1;
  const label = props.label ?? focus?.label;
  if (!label) return null;
  const selected =
    preview?.candidate === candidate &&
    (walkthrough
      ? preview.walkthrough === walkthrough
      : preview.ply === ply && preview.focus === focus);
  const activate = () => {
    if (selected && walkthrough) return;
    props.onInspect(
      candidate,
      walkthrough ? 1 : ply,
      "click",
      walkthrough ? undefined : focus,
      walkthrough,
    );
  };
  return (
    <button
      type="button"
      className={["text-action explanation-link", props.className]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
      aria-pressed={selected}
      {...movePreviewEvents({
        ...props,
        ply,
        focus,
        enabled: walkthrough === undefined,
      })}
      onClick={activate}
    >
      {props.children ?? (
        <>
          <Eye size={13} aria-hidden="true" />{" "}
          <SquareText text={label} focusable={false} />
        </>
      )}
    </button>
  );
}
