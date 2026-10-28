import type { Square } from "chess.js";

export type BoardFocus = {
  label: string;
  squares: Square[];
  arrows: { from: Square; to: Square }[];
};

export function boardFocus(
  label: string,
  arrows: BoardFocus["arrows"],
  squares: Square[] = [],
): BoardFocus {
  return {
    label,
    arrows,
    squares: [
      ...new Set([...squares, ...arrows.flatMap(({ from, to }) => [from, to])]),
    ],
  };
}
