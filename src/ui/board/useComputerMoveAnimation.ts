import { useLayoutEffect, useRef, type RefObject } from "react";
import type { Move, Square } from "chess.js";

function travels(move: Move) {
  const result: { from: Square; to: Square }[] = [
    { from: move.from, to: move.to },
  ];
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const kingside = move.isKingsideCastle();
    result.push({
      from: `${kingside ? "h" : "a"}${move.from[1]}` as Square,
      to: `${kingside ? "f" : "d"}${move.from[1]}` as Square,
    });
  }
  return result;
}
export function animateBoardMove(
  board: HTMLDivElement | null,
  move: Move,
  reverse = false,
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups = travels(move).map((travel) => {
    const from = reverse ? travel.to : travel.from,
      to = reverse ? travel.from : travel.to;
    const source = board?.querySelector<HTMLElement>(`[data-square="${from}"]`);
    const destination = board?.querySelector<HTMLElement>(
      `[data-square="${to}"]`,
    );
    const piece = destination?.querySelector<HTMLImageElement>(".piece");
    if (!source || !destination || !piece) return () => {};
    const start = source.getBoundingClientRect(),
      end = destination.getBoundingClientRect();
    destination.classList.add("moving-piece-square");
    const animation = piece.animate(
      reduced
        ? [{ opacity: 0.35 }, { opacity: 1 }]
        : [
            {
              transform: `translate(${start.x - end.x}px, ${start.y - end.y}px)`,
              filter: "drop-shadow(0 4px 3px #33214240)",
            },
            {
              transform: "translate(0, 0)",
              filter: "drop-shadow(0 0 0 transparent)",
            },
          ],
      { duration: reduced ? 150 : 420, easing: "cubic-bezier(.2,.7,.3,1)" },
    );
    const arrival = reduced
      ? undefined
      : destination.animate(
          [
            { boxShadow: "inset 0 0 0 3px #7560cd99" },
            { boxShadow: "inset 0 0 0 3px #7560cd00" },
          ],
          { duration: 450, delay: 420 },
        );
    const clean = () => destination.classList.remove("moving-piece-square");
    animation.onfinish = clean;
    return () => {
      animation.cancel();
      arrival?.cancel();
      clean();
    };
  });
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
export function useComputerMoveAnimation(
  board: RefObject<HTMLDivElement | null>,
  move: Move | null,
  previewing: boolean,
  flipped: boolean,
) {
  const lastAnimated = useRef<Move | null>(null);
  useLayoutEffect(() => {
    if (!move || previewing || lastAnimated.current === move) return;
    lastAnimated.current = move;
    return animateBoardMove(board.current, move);
  }, [board, move, previewing, flipped]);
}
