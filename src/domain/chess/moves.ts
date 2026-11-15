import type { Chess, Move } from "chess.js";
import { isUciMove } from "../analysis/lines.ts";
import { english, type Translator } from "../../i18n/translate.ts";
import { pieceNameKeys } from "./position.ts";

export function capturedSquare(move: Move): Move["to"] {
  return move.isEnPassant()
    ? (`${move.to[0]}${move.from[1]}` as Move["to"])
    : move.to;
}
function namedPiece(move: Move, t: Translator) {
  const name = t(pieceNameKeys[move.piece]);
  return [name[0].toUpperCase(), name.slice(1)] as const;
}
export function moveDescription(move: Move, t: Translator = english) {
  return t(
    "move.description.normal",
    ...namedPiece(move, t),
    move.from,
    move.to,
  );
}
export function compactMoveDescription(move: Move, t: Translator = english) {
  return `${namedPiece(move, t).join("")} ${move.from} → ${move.to}`;
}
export function uciMove(game: Chess, uci: string): Move {
  if (!isUciMove(uci)) throw new Error(`Invalid UCI move: ${uci}`);
  return game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci.length === 5 ? { promotion: uci[4] } : {}),
  });
}
