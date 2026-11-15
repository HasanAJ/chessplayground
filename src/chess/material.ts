import type { PieceSymbol } from "chess.js";
import type { Position } from "./position";

export const pieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
} as const satisfies Record<PieceSymbol, number>;

const startingPieces = { q: 1, r: 2, b: 2, n: 2, p: 8 } as const;
type MaterialPiece = keyof typeof startingPieces;

export function materialBalance(position: Position) {
  const remaining = {
    w: { ...startingPieces },
    b: { ...startingPieces },
  };
  let difference = 0;
  for (const piece of Object.values(position)) {
    if (!piece) continue;
    difference += pieceValues[piece.type] * (piece.color === "w" ? 1 : -1);
    if (piece.type !== "k") remaining[piece.color][piece.type]--;
  }
  const missing = (color: "w" | "b") =>
    (Object.keys(startingPieces) as MaterialPiece[]).flatMap((type) => {
      const count = Math.max(0, remaining[color][type]);
      return count ? [{ type, count }] : [];
    });
  return { missing: { w: missing("w"), b: missing("b") }, difference };
}
