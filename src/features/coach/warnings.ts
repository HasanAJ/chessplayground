import { english, type Translator } from "../../i18n/translate";
import { Chess, type Square } from "chess.js";
import { pieceNameKeys, opposite, positionOf } from "../../chess/position";
import { pieceValues } from "../../chess/material";

type BoardWarning = {
  text: string;
  target: Square | null;
  attackers: Square[];
};

export function watchOutFor(
  game: Chess,
  t: Translator = english,
): BoardWarning {
  const color = game.turn(),
    enemy = opposite(color),
    position = positionOf(game);
  if (game.inCheck()) {
    const king = Object.entries(position).find(
      ([, piece]) => piece?.color === color && piece.type === "k",
    )![0] as Square;
    return {
      text: t("coach.warning.check"),
      target: king,
      attackers: game.attackers(king, enemy),
    };
  }
  const undefended = Object.entries(position)
    .filter(
      ([sq, p]) =>
        p?.color === color &&
        p.type !== "k" &&
        game.isAttacked(sq as Square, enemy) &&
        !game.isAttacked(sq as Square, color),
    )
    .sort((a, b) => pieceValues[b[1]!.type] - pieceValues[a[1]!.type])[0];
  if (undefended)
    return {
      text: t(
        "coach.warning.undefended",
        t(pieceNameKeys[undefended[1]!.type]),
        undefended[0],
      ),
      target: undefended[0] as Square,
      attackers: game.attackers(undefended[0] as Square, enemy),
    };
  return {
    text: "",
    target: null,
    attackers: [],
  };
}
