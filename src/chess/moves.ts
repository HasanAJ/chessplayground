import { english, type Translator } from "../i18n/translate";
import { Chess, type Move } from "chess.js";
import { pieceNameKeys } from "./position";

export const capturedSquare = (move: Move) =>
  (move.isEnPassant() ? `${move.to[0]}${move.from[1]}` : move.to) as Move["to"];

/** Keep notation visible while giving new players the complete move in words. */
export function moveDescription(move: Move, t: Translator = english): string {
  const piece = t(pieceNameKeys[move.piece]);
  let text = t(
    "move.description.normal",
    piece[0].toUpperCase(),
    piece.slice(1),
    move.from,
    move.to,
  );
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const rank = move.from[1];
    text = t(
      "move.description.castle",
      move.from,
      move.to,
      move.isKingsideCastle()
        ? t("move.description.kingsideRook", rank, rank)
        : t("move.description.queensideRook", rank, rank),
    );
  } else if (move.captured) {
    text += t(
      "move.description.capture",
      t(pieceNameKeys[move.captured]),
      move.isEnPassant() ? t("move.description.enPassantSquare", capturedSquare(move)) : "",
    );
  }
  if (move.promotion)
    text += t("move.description.promotion", t(pieceNameKeys[move.promotion]));
  if (move.san.endsWith("#")) text += t("move.description.checkmate");
  else if (move.san.endsWith("+")) text += t("move.description.check");
  return text;
}

export function uciMove(game: Chess, uci: string): Move {
  return game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] } : {}),
  });
}
