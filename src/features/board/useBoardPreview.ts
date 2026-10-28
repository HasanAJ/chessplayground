import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import type { Candidate } from "../coach/candidates";
import type { BoardFocus } from "../coach/boardFocus";

export type MovePreview = {
  candidate: Candidate;
  ply: number;
  focus?: BoardFocus;
};

type MoveInspection = MovePreview & { key: string };

export type InspectMove = (
  candidate: Candidate | null,
  ply?: number,
  input?: "hover" | "focus" | "click",
  focus?: BoardFocus,
) => void;

export function useBoardPreview(key: string, enabled: boolean) {
  const [hoverInspection, setHoverInspection] = useState<MoveInspection | null>(
    null,
  );
  const [focusInspection, setFocusInspection] = useState<MoveInspection | null>(
    null,
  );
  const [pinnedInspection, setPinnedInspection] =
    useState<MoveInspection | null>(null);
  function currentInspection(frame: MoveInspection | null) {
    return enabled &&
      frame?.key === key &&
      frame.candidate.continuation[frame.ply - 1]
      ? frame
      : null;
  }
  const inspection = currentInspection(
    hoverInspection ?? focusInspection ?? pinnedInspection,
  );
  const keptInspection = currentInspection(pinnedInspection);
  const inspectionMove = inspection?.candidate.continuation[inspection.ply - 1];
  const boardPreview = inspection !== null;
  const previewGame = useMemo(
    () => (inspectionMove ? new Chess(inspectionMove.after) : null),
    [inspectionMove],
  );

  const inspectMove: InspectMove = useCallback(
    (candidate, ply = 1, input, focus) => {
      const update = (
        current: MoveInspection | null,
      ): MoveInspection | null => {
        if (!candidate) return null;
        if (ply === 0) return current?.candidate === candidate ? null : current;
        return { key, candidate, ply, focus };
      };
      if (!input || input === "hover") setHoverInspection(update);
      if (!input || input === "focus") setFocusInspection(update);
      if (!input || input === "click") setPinnedInspection(update);
      if (input === "click" && ply > 0) {
        setHoverInspection(null);
        setFocusInspection(null);
      }
    },
    [key],
  );

  const clearPreview = useCallback(() => inspectMove(null), [inspectMove]);
  useEffect(clearPreview, [clearPreview, enabled]);
  useEffect(() => {
    if (!boardPreview) return;
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearPreview();
    };
    document.addEventListener("keydown", cancel);
    return () => document.removeEventListener("keydown", cancel);
  }, [boardPreview, clearPreview]);

  return {
    inspection,
    pinnedInspection: keptInspection,
    inspectionMove,
    boardPreview,
    pinned: boardPreview && inspection === pinnedInspection,
    previewGame,
    inspectMove,
    clearPreview,
  };
}

export type BoardPreview = ReturnType<typeof useBoardPreview>;
