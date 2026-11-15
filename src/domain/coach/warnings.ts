import type { Chess, Square } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import { opposite, pieceNameKeys } from "../chess/position.ts";
import { pieceValues } from "../chess/material.ts";

type BoardWarning = {
  text: string;
  target: Square | null;
  attackers: Square[];
};
export function watchOutFor(
  board: Chess,
  t: Translator = english,
): BoardWarning {
  const player = board.turn(),
    enemy = opposite(player);
  const pieces = board
    .board()
    .flat()
    .filter((piece) => piece !== null)
    .filter((piece) => piece.color === player);
  if (board.isCheck()) {
    const king = pieces.find((piece) => piece.type === "k")!;
    return {
      text: t("coach.warning.check"),
      target: king.square,
      attackers: board.attackers(king.square, enemy),
    };
  }
  let target: (typeof pieces)[number] | undefined;
  for (const piece of pieces) {
    if (
      piece.type === "k" ||
      (target && pieceValues[target.type] >= pieceValues[piece.type])
    )
      continue;
    if (
      board.isAttacked(piece.square, enemy) &&
      !board.isAttacked(piece.square, player)
    )
      target = piece;
  }
  return target
    ? {
        text: t(
          "coach.warning.undefended",
          t(pieceNameKeys[target.type]),
          target.square,
        ),
        target: target.square,
        attackers: board.attackers(target.square, enemy),
      }
    : { text: "", target: null, attackers: [] };
}
