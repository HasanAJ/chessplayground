import type { FocusEvent } from "react";
import type { InspectMove, MovePreview } from "../board/useBoardPreview";
import type { Candidate } from "./candidates";
import type { BoardFocus } from "./explanations";

export type MovePreviewProps = {
  candidate: Candidate;
  preview: MovePreview | null;
  onInspect: InspectMove;
};

export function movePreviewEvents(
  onInspect: InspectMove,
  candidate: Candidate,
  ply: number,
  focus?: BoardFocus,
) {
  return {
    onMouseEnter: () => onInspect(candidate, ply, "hover", focus),
    onMouseLeave: () => onInspect(candidate, 0, "hover"),
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible"))
        onInspect(candidate, ply, "focus", focus);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget))
        onInspect(candidate, 0, "focus");
    },
  };
}
