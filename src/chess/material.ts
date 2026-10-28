import type { PieceSymbol } from "chess.js";

export const pieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
} as const satisfies Record<PieceSymbol, number>;
