import { english, type Translator } from "../i18n/translate";
import { Chess, type Move } from "chess.js";
import { pieceNameKeys } from "./position";

export const capturedSquare = (move: Move) =>
  (move.isEnPassant() ? `${move.to[0]}${move.from[1]}` : move.to) as Move["to"];

/** Keep move titles to the moving piece and its source and destination. */
export function moveDescription(move: Move, t: Translator = english): string {
  const piece = t(pieceNameKeys[move.piece]);
  return t(
    "move.description.normal",
    piece[0].toUpperCase(),
    piece.slice(1),
    move.from,
    move.to,
  );
}

export function uciMove(game: Chess, uci: string): Move {
  return game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] } : {}),
  });
}
