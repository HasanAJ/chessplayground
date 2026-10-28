import type { Move } from "chess.js";
import { capturedSquare } from "../../chess/moves";
import { pieceNameKeys } from "../../chess/position";
import { english, type Translator } from "../../i18n/translate";

export function describeReply(
  move: Move,
  t: Translator = english,
  previous?: Move,
): string {
  const promotion = move.promotion
    ? t("coach.reply.promotion", t(pieceNameKeys[move.promotion]))
    : "";
  if (move.san.endsWith("#"))
    return t(
      "coach.reply.checkmate",
      t(pieceNameKeys[move.piece]),
      move.to,
      promotion,
    );
  const check = move.san.endsWith("+") ? t("coach.reply.check") : "";
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return t(
      "coach.reply.castle",
      move.isKingsideCastle()
        ? t("chess.castling.kingside")
        : t("chess.castling.queenside"),
      check,
    );
  if (move.captured) {
    if (previous?.captured && capturedSquare(move) === previous.to)
      return t(
        "coach.reply.recapture",
        t(pieceNameKeys[move.piece]),
        t(pieceNameKeys[move.captured]),
        promotion,
        check,
      );
    return t(
      "coach.reply.capture",
      t(pieceNameKeys[move.piece]),
      t(pieceNameKeys[move.captured]),
      capturedSquare(move),
      move.isEnPassant() ? t("coach.reply.enPassant") : "",
      promotion,
      check,
    );
  }
  return t("coach.reply.move", t(pieceNameKeys[move.piece]), move.to, promotion, check);
}
