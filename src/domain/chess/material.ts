import { Chess, type Color, type Move, type PieceSymbol } from "chess.js";
import { opposite, positionOf, type Position } from "./position.ts";

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

export function materialBalance(
  position: Position,
  history: readonly Move[] = [],
) {
  const counts: Record<Color, Partial<Record<PieceSymbol, number>>> = {
    w: {},
    b: {},
  };
  const captures: typeof counts = { w: {}, b: {} };
  // A FEN cannot reveal past captures. Keep its initial deficit, then count
  // recorded captures so promotions neither lose a pawn nor hide a captured piece.
  const initial = history[0]
    ? positionOf(new Chess(history[0].before))
    : position;
  for (const piece of Object.values(initial)) {
    if (!piece) continue;
    const side = counts[piece.color];
    side[piece.type] = (side[piece.type] ?? 0) + 1;
  }
  for (const move of history) {
    if (!move.captured) continue;
    const side = captures[opposite(move.color)];
    side[move.captured] = (side[move.captured] ?? 0) + 1;
  }
  function missing(color: Color) {
    return (Object.keys(inventory) as MaterialPiece[]).reduce<
      { type: MaterialPiece; count: number }[]
    >((pieces, type) => {
      const count =
        Math.max(0, inventory[type] - (counts[color][type] ?? 0)) +
        (captures[color][type] ?? 0);
      if (count > 0) pieces.push({ type, count });
      return pieces;
    }, []);
  }
  const difference = Object.values(position).reduce(
    (total, piece) =>
      total +
      (piece ? (piece.color === "w" ? 1 : -1) * pieceValues[piece.type] : 0),
    0,
  );
  return { difference, missing: { w: missing("w"), b: missing("b") } };
}
