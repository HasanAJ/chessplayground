import { Chess, type Color, type Move } from "chess.js";
import { pieceNameKeys } from "../../chess/position";
import type { Translator } from "../../i18n/translate";

export function walkthroughPresentation(
  move: Move,
  player: Color,
  final: boolean,
  t: Translator,
) {
  const yours = move.color === player;
  const piece = t(pieceNameKeys[move.piece]);
  let description: string;
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    description = t(
      yours ? "board.walkthrough.castle.yours" : "board.walkthrough.castle.theirs",
    );
  } else if (move.captured) {
    description = t(
      yours ? "board.walkthrough.capture.yours" : "board.walkthrough.capture.theirs",
      piece,
      t(pieceNameKeys[move.captured]),
      move.to,
    );
  } else {
    description = t(
      yours ? "board.walkthrough.move.yours" : "board.walkthrough.move.theirs",
      piece,
      move.from,
      move.to,
    );
  }
  if (move.promotion)
    description += ` ${t("board.walkthrough.promotion", t(pieceNameKeys[move.promotion]))}`;

  const note = new Chess(move.after).isCheckmate()
    ? t("board.walkthrough.checkmate")
    : final
      ? t("board.walkthrough.furtherTrades")
      : move.san.includes("+")
        ? t("board.walkthrough.check")
        : new Chess(move.before).isCheck()
          ? t("board.walkthrough.answersCheck")
          : t("board.walkthrough.followReply");
  return { description, note };
}
