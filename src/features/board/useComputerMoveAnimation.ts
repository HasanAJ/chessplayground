import { useLayoutEffect, useRef, type RefObject } from "react";
import type { Move, Square } from "chess.js";

function moveTravels(move: Move): { from: Square; to: Square }[] {
  const travels: { from: Square; to: Square }[] = [
    { from: move.from, to: move.to },
  ];
  const rank = move.color === "w" ? "1" : "8";
  if (move.isKingsideCastle())
    travels.push({ from: `h${rank}`, to: `f${rank}` });
  if (move.isQueensideCastle())
    travels.push({ from: `a${rank}`, to: `d${rank}` });
  return travels;
}

export function useComputerMoveAnimation(
  board: RefObject<HTMLDivElement | null>,
  move: Move | null,
  previewing: boolean,
  flipped: boolean,
) {
  const animated = useRef<Move | null>(null);
  useLayoutEffect(() => {
    if (!move || previewing || animated.current === move) return;
    animated.current = move;
    return animateBoardMove(board.current, move);
  }, [board, move, previewing, flipped]);
}

export function animateBoardMove(
  board: HTMLDivElement | null,
  move: Move,
  reverse = false,
) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cleanups = moveTravels(move).map((travel) => {
    const { from, to } = reverse
      ? { from: travel.to, to: travel.from }
      : travel;
    const source = board?.querySelector<HTMLElement>(
      `[data-square="${from}"]`,
    );
    const destination = board?.querySelector<HTMLElement>(
      `[data-square="${to}"]`,
    );
    const piece = destination?.querySelector<HTMLImageElement>(".piece");
    if (!source || !destination || !piece) return () => {};
    const start = source.getBoundingClientRect();
    const end = destination.getBoundingClientRect();
    destination.classList.add("moving-piece-square");
    const animation = piece.animate(
      reducedMotion
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
      {
        duration: reducedMotion ? 150 : 420,
        easing: "cubic-bezier(.2,.7,.3,1)",
      },
    );
    const arrival = reducedMotion
      ? null
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
  return () => cleanups.forEach((clean) => clean());
}
