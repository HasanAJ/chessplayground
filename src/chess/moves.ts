import { Chess, type Move } from "chess.js";
import { names } from "./position";

export const capturedSquare = (move: Move) =>
  (move.isEnPassant() ? `${move.to[0]}${move.from[1]}` : move.to) as Move["to"];

/** Keep notation visible while giving new players the complete move in words. */
export function moveDescription(move: Move): string {
  const piece = names[move.piece];
  let text = `${piece[0].toUpperCase()}${piece.slice(1)} from ${move.from} to ${move.to}`;
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const rank = move.from[1];
    text = `Castle: king ${move.from} to ${move.to}, rook ${move.isKingsideCastle() ? `h${rank} to f${rank}` : `a${rank} to d${rank}`}`;
  } else if (move.captured) {
    text += `, taking the ${names[move.captured]}${move.isEnPassant() ? ` on ${capturedSquare(move)} en passant` : ""}`;
  }
  if (move.promotion) text += `, promoting to a ${names[move.promotion]}`;
  if (move.san.endsWith("#")) text += " — checkmate";
  else if (move.san.endsWith("+")) text += " — check";
  return text;
}

export function uciMove(game: Chess, uci: string): Move {
  return game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] } : {}),
  });
}
