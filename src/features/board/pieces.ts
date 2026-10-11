import { english, type Translator } from "../../i18n/translate";
import type { Color, PieceSymbol } from "chess.js";
import { names, sideName } from "../../chess/position";

type Piece = { color: Color; type: PieceSymbol };
export const pieceImage = (piece: Piece) =>
  `/pieces/${piece.color}${piece.type.toUpperCase()}.svg`;
export const pieceLabel = (piece: Piece, t: Translator = english) =>
  t("{0} {1}", sideName(piece.color, t), t(names[piece.type]));
