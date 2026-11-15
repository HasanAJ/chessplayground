import type { Color, PieceSymbol } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import { pieceNameKeys, sideName } from "../../domain/chess/position.ts";
type Piece = { color: Color; type: PieceSymbol };
export function pieceImage({ color, type }: Piece): string {
  return ["/pieces/", color, type.toUpperCase(), ".svg"].join("");
}
export function pieceLabel({ color, type }: Piece, t: Translator = english) {
  return t("chess.piece.label", sideName(color, t), t(pieceNameKeys[type]));
}
