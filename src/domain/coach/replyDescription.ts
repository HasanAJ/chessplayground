import type { Move } from "chess.js";
import { capturedSquare } from "../chess/moves.ts";
import { pieceNameKeys } from "../chess/position.ts";
import { english, type Translator } from "../../i18n/translate.ts";

export function describeReply(
  move: Move,
  t: Translator = english,
  previous?: Move,
): string {
  const piece = t(pieceNameKeys[move.piece]);
  const promotion = move.promotion
    ? t("coach.reply.promotion", t(pieceNameKeys[move.promotion]))
    : "";
  if (move.san.endsWith("#"))
    return t("coach.reply.checkmate", piece, move.to, promotion);
  const check = move.san.endsWith("+") ? t("coach.reply.check") : "";
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return t(
      "coach.reply.castle",
      t(
        move.isKingsideCastle()
          ? "chess.castling.kingside"
          : "chess.castling.queenside",
      ),
      check,
    );
  if (!move.captured)
    return t("coach.reply.move", piece, move.to, promotion, check);
  const victim = t(pieceNameKeys[move.captured]);
  return previous?.captured && capturedSquare(move) === previous.to
    ? t("coach.reply.recapture", piece, victim, promotion, check)
    : t(
        "coach.reply.capture",
        piece,
        victim,
        capturedSquare(move),
        move.isEnPassant() ? t("coach.reply.enPassant") : "",
        promotion,
        check,
      );
}
