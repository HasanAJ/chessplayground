import type { Square } from "chess.js";

export function moveArrow(
  from: Square,
  to: Square,
  files: string[],
  ranks: number[],
) {
  const x1 = files.indexOf(from[0]) * 100 + 50;
  const y1 = ranks.indexOf(Number(from[1])) * 100 + 50;
  const x2 = files.indexOf(to[0]) * 100 + 50;
  const y2 = ranks.indexOf(Number(to[1])) * 100 + 50;
  const length = Math.hypot(x2 - x1, y2 - y1);
  return {
    x1,
    y1,
    x2: x2 - ((x2 - x1) / length) * 25,
    y2: y2 - ((y2 - y1) / length) * 25,
  };
}
