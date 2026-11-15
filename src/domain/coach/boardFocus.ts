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
  const highlighted = new Set(squares);
  for (const arrow of arrows) {
    highlighted.add(arrow.from);
    highlighted.add(arrow.to);
  }
  return { label, arrows, squares: Array.from(highlighted) };
}
