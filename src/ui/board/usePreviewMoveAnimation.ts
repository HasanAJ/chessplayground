import { useLayoutEffect, useRef, type RefObject } from "react";
import type { MovePreview } from "./useBoardPreview.ts";
import { animateBoardMove } from "./useComputerMoveAnimation.ts";
export function usePreviewMoveAnimation(
  board: RefObject<HTMLDivElement | null>,
  inspection: MovePreview | null,
  flipped: boolean,
) {
  const last = useRef<{ frame: MovePreview | null; flipped: boolean }>({
    frame: null,
    flipped,
  });
  useLayoutEffect(() => {
    const previous = last.current;
    last.current = { frame: inspection, flipped };
    const old = previous.frame;
    if (
      !old?.walkthrough ||
      !inspection?.walkthrough ||
      previous.flipped !== flipped ||
      old.candidate !== inspection.candidate
    )
      return;
    const delta = inspection.ply - old.ply;
    if (delta !== 1 && delta !== -1) return;
    const move =
      inspection.candidate.continuation[Math.max(old.ply, inspection.ply) - 1];
    return animateBoardMove(board.current, move, delta === -1);
  }, [inspection, flipped, board]);
}
