import type { Square } from "chess.js";
export function moveArrow(
  from: Square,
  to: Square,
  files: string[],
  ranks: number[],
) {
  const point = (square: Square) =>
    [
      50 + 100 * files.indexOf(square[0]),
      50 + 100 * ranks.indexOf(Number(square[1])),
    ] as const;
  const [x1, y1] = point(from),
    [destinationX, destinationY] = point(to);
  const dx = destinationX - x1,
    dy = destinationY - y1;
  const shortening = 25 / Math.hypot(dx, dy);
  return {
    x1,
    y1,
    x2: destinationX - dx * shortening,
    y2: destinationY - dy * shortening,
  };
}
