import { english, type Translator } from "../../i18n/translate";
import { Chess, type Square } from "chess.js";
import { pieceNameKeys, opposite, positionOf } from "../../chess/position";

const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

type BoardWarning = {
  kind: "check" | "undefended" | "defended" | "none";
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
      kind: "check",
      text: t("coach.warning.check"),
      target: king,
      attackers: game.attackers(king, enemy),
    };
  }
  const pressure = Object.entries(position)
    .filter(
      ([sq, p]) =>
        p?.color === color &&
        p.type !== "k" &&
        game.isAttacked(sq as Square, enemy),
    )
    .sort((a, b) => values[b[1]!.type] - values[a[1]!.type]);
  const undefended = pressure.find(
    ([sq]) => !game.isAttacked(sq as Square, color),
  );
  if (undefended)
    return {
      kind: "undefended",
      text: t(
        "coach.warning.undefended",
        t(pieceNameKeys[undefended[1]!.type]),
        undefended[0],
      ),
      target: undefended[0] as Square,
      attackers: game.attackers(undefended[0] as Square, enemy),
    };
  if (pressure.length)
    return {
      kind: "defended",
      text: t(
        "coach.warning.defended",
        t(pieceNameKeys[pressure[0][1]!.type]),
        pressure[0][0],
      ),
      target: pressure[0][0] as Square,
      attackers: game.attackers(pressure[0][0] as Square, enemy),
    };
  return {
    kind: "none",
    text: t("coach.warning.general"),
    target: null,
    attackers: [],
  };
}
