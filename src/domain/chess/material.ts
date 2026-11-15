import type { Color, Move, PieceSymbol } from "chess.js";
import type { Position } from "./position.ts";

export const pieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
} as const satisfies Record<PieceSymbol, number>;
const inventory = { q: 1, r: 2, b: 2, n: 2, p: 8 } as const;
type MaterialPiece = keyof typeof inventory;

export function materialGain(moves: readonly Move[], side: Color) {
  return moves.reduce((balance, move) => {
    const gain =
      (move.captured ? pieceValues[move.captured] : 0) +
      (move.promotion ? pieceValues[move.promotion] - pieceValues.p : 0);
    return balance + gain * (move.color === side ? 1 : -1);
  }, 0);
}

export function materialBalance(position: Position) {
  const counts: Record<Color, Partial<Record<PieceSymbol, number>>> = {
    w: {},
    b: {},
  };
  let difference = 0;
  for (const square in position) {
    const piece = position[square as keyof Position];
    if (!piece) continue;
    const side = counts[piece.color];
    side[piece.type] = (side[piece.type] ?? 0) + 1;
    difference += (piece.color === "w" ? 1 : -1) * pieceValues[piece.type];
  }
  function missing(color: Color) {
    return (Object.keys(inventory) as MaterialPiece[]).reduce<
      { type: MaterialPiece; count: number }[]
    >((pieces, type) => {
      const count = inventory[type] - (counts[color][type] ?? 0);
      if (count > 0) pieces.push({ type, count });
      return pieces;
    }, []);
  }
  return { difference, missing: { w: missing("w"), b: missing("b") } };
}
