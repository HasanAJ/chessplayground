import type { Color, PieceSymbol } from "chess.js";
import { names, sideName } from "../../chess/position";

type Piece = { color: Color; type: PieceSymbol };
export const pieceImage = (piece: Piece) =>
  `/pieces/${piece.color}${piece.type.toUpperCase()}.svg`;
export const pieceLabel = (piece: Piece) =>
  `${sideName(piece.color)} ${names[piece.type]}`;
