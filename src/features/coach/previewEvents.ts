import type { FocusEvent } from "react";
import type {
  ClearInspection,
  InspectMove,
  MovePreview,
} from "../board/useBoardPreview";
import type { Candidate } from "./candidatePresentation";
import type { BoardFocus } from "./boardFocus";

export type MovePreviewProps = {
  candidate: Candidate;
  preview: MovePreview | null;
  onInspect: InspectMove;
  onClearInspection: ClearInspection;
};

export function movePreviewEvents({
  onInspect,
  onClearInspection,
  candidate,
  ply,
  focus,
  enabled = true,
}: {
  onInspect: InspectMove;
  onClearInspection: ClearInspection;
  candidate: Candidate;
  ply: number;
  focus?: BoardFocus;
  enabled?: boolean;
}) {
  return {
    onMouseEnter: () =>
      enabled
        ? onInspect(candidate, ply, "hover", focus)
        : onClearInspection(candidate, "hover"),
    onMouseLeave: () => onClearInspection(candidate, "hover"),
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) {
        if (enabled) onInspect(candidate, ply, "focus", focus);
        else onClearInspection(candidate, "focus");
      }
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget))
        onClearInspection(candidate, "focus");
    },
  };
}
