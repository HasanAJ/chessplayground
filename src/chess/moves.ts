import { english, type Translator } from "../i18n/translate";
import { Chess, type Move } from "chess.js";
import { names } from "./position";

export const capturedSquare = (move: Move) =>
  (move.isEnPassant() ? `${move.to[0]}${move.from[1]}` : move.to) as Move["to"];

/** Keep notation visible while giving new players the complete move in words. */
export function moveDescription(move: Move, t: Translator = english): string {
  const piece = t(names[move.piece]);
  let text = t(
    "{0}{1} from {2} to {3}",
    piece[0].toUpperCase(),
    piece.slice(1),
    move.from,
    move.to,
  );
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const rank = move.from[1];
    text = t(
      "Castle: king {0} to {1}, rook {2}",
      move.from,
      move.to,
      move.isKingsideCastle()
        ? t("h{0} to f{1}", rank, rank)
        : t("a{0} to d{1}", rank, rank),
    );
  } else if (move.captured) {
    text += t(
      ", taking the {0}{1}",
      t(names[move.captured]),
      move.isEnPassant() ? t(" on {0} en passant", capturedSquare(move)) : "",
    );
  }
  if (move.promotion)
    text += t(", promoting to a {0}", t(names[move.promotion]));
  if (move.san.endsWith("#")) text += t(" — checkmate");
  else if (move.san.endsWith("+")) text += t(" — check");
  return text;
}

export function uciMove(game: Chess, uci: string): Move {
  return game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci[4] ? { promotion: uci[4] } : {}),
  });
}
