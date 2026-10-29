import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import type { Candidate } from "../coach/candidatePresentation";
import type { BoardFocus } from "../coach/boardFocus";

export type MovePreview = {
  candidate: Candidate;
  ply: number;
  focus?: BoardFocus;
};

type MoveInspection = MovePreview & { key: string };
type PreviewInput = "hover" | "focus" | "click";

export type InspectMove = (
  candidate: Candidate,
  ply: number,
  input: PreviewInput,
  focus?: BoardFocus,
) => void;

export type ClearInspection = (
  candidate: Candidate,
  input?: PreviewInput,
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
    (candidate, ply, input, focus) => {
      const update = { key, candidate, ply, focus };
      if (input === "hover") setHoverInspection(update);
      else if (input === "focus") setFocusInspection(update);
      else {
        setPinnedInspection(update);
        setHoverInspection(null);
        setFocusInspection(null);
      }
    },
    [key],
  );

  const clearInspection: ClearInspection = useCallback((candidate, input) => {
    const clear = (current: MoveInspection | null) =>
      current?.candidate === candidate ? null : current;
    if (!input || input === "hover") setHoverInspection(clear);
    if (!input || input === "focus") setFocusInspection(clear);
    if (!input || input === "click") setPinnedInspection(clear);
  }, []);
  const clearPreview = useCallback(() => {
    setHoverInspection(null);
    setFocusInspection(null);
    setPinnedInspection(null);
  }, []);
  useEffect(clearPreview, [clearPreview, enabled, key]);
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
    clearInspection,
    clearPreview,
  };
}

export type BoardPreview = ReturnType<typeof useBoardPreview>;
