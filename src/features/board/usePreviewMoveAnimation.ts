import { useLayoutEffect, useRef, type RefObject } from "react";
import type { MovePreview } from "./useBoardPreview";
import { animateBoardMove } from "./useComputerMoveAnimation";

export function usePreviewMoveAnimation(
  board: RefObject<HTMLDivElement | null>,
  inspection: MovePreview | null,
  flipped: boolean,
) {
  const previous = useRef<{ inspection: MovePreview | null; flipped: boolean }>({
    inspection: null,
    flipped,
  });
  useLayoutEffect(() => {
    const before = previous.current;
    previous.current = { inspection, flipped };
    if (
      !inspection?.walkthrough ||
      !before.inspection?.walkthrough ||
      before.flipped !== flipped ||
      before.inspection.candidate !== inspection.candidate
    )
      return;
    const distance = inspection.ply - before.inspection.ply;
    if (Math.abs(distance) !== 1) return;
    const move = inspection.candidate.continuation[
      (distance > 0 ? inspection.ply : before.inspection.ply) - 1
    ];
    return animateBoardMove(board.current, move, distance < 0);
  }, [board, inspection, flipped]);
}
