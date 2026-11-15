import type { FocusEvent } from "react";
import type {
  ClearInspection,
  InspectMove,
  MovePreview,
} from "../board/useBoardPreview.ts";
import type { Candidate } from "../../domain/coach/candidatePresentation.ts";
import type { BoardFocus } from "../../domain/coach/boardFocus.ts";
export type MovePreviewProps = {
  candidate: Candidate;
  preview: MovePreview | null;
  onInspect: InspectMove;
  onClearInspection: ClearInspection;
};
type Input = {
  candidate: Candidate;
  ply: number;
  onInspect: InspectMove;
  onClearInspection: ClearInspection;
  focus?: BoardFocus;
  enabled?: boolean;
};
export function movePreviewEvents(input: Input) {
  const enter = (channel: "hover" | "focus") => {
    if (input.enabled === false)
      input.onClearInspection(input.candidate, channel);
    else input.onInspect(input.candidate, input.ply, channel, input.focus);
  };
  return {
    onMouseEnter: () => enter("hover"),
    onMouseLeave: () => input.onClearInspection(input.candidate, "hover"),
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) enter("focus");
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget))
        input.onClearInspection(input.candidate, "focus");
    },
  };
}
