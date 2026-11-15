import { Chess, type Color, type Move } from "chess.js";
import { pieceNameKeys } from "../../domain/chess/position.ts";
import type { Translator } from "../../i18n/translate.ts";
export function walkthroughPresentation(
  move: Move,
  player: Color,
  t: Translator,
) {
  const own = move.color === player;
  let description: string;
  if (move.isKingsideCastle() || move.isQueensideCastle())
    description = t(
      own
        ? "board.walkthrough.castle.yours"
        : "board.walkthrough.castle.theirs",
    );
  else if (move.captured)
    description = t(
      own
        ? "board.walkthrough.capture.yours"
        : "board.walkthrough.capture.theirs",
      t(pieceNameKeys[move.piece]),
      t(pieceNameKeys[move.captured]),
      move.to,
    );
  else
    description = t(
      own ? "board.walkthrough.move.yours" : "board.walkthrough.move.theirs",
      t(pieceNameKeys[move.piece]),
      move.from,
      move.to,
    );
  if (move.promotion)
    description = [
      description,
      t("board.walkthrough.promotion", t(pieceNameKeys[move.promotion])),
    ].join(" ");
  const status = new Chess(move.after).isCheckmate()
    ? "board.walkthrough.checkmate"
    : move.san.includes("+")
      ? "board.walkthrough.check"
      : new Chess(move.before).isCheck()
        ? "board.walkthrough.answersCheck"
        : null;
  return { description, note: status === null ? undefined : t(status) };
}
