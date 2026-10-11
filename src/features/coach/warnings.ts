import { Chess, type Square } from "chess.js";
import { names, opposite, positionOf } from "../../chess/position";

const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

type BoardWarning = {
  text: string;
  target: Square | null;
  attackers: Square[];
};

export function watchOutFor(game: Chess): BoardWarning {
  const color = game.turn(),
    enemy = opposite(color),
    position = positionOf(game);
  if (game.inCheck()) {
    const king = Object.entries(position).find(
      ([, piece]) => piece?.color === color && piece.type === "k",
    )![0] as Square;
    return {
      text: "Deal with the check first. Look for a king move, a way to take the attacker, or a piece that can block the attack.",
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
      text: `Your ${names[undefended[1]!.type]} on ${undefended[0]} is under attack with no defender. Can you move it, protect it, or make a threat they have to answer first?`,
      target: undefended[0] as Square,
      attackers: game.attackers(undefended[0] as Square, enemy),
    };
  if (pressure.length)
    return {
      text: `Your ${names[pressure[0][1]!.type]} on ${pressure[0][0]} is under attack. It has a defender, but play out the trade before leaving it there.`,
      target: pressure[0][0] as Square,
      attackers: game.attackers(pressure[0][0] as Square, enemy),
    };
  return {
    text: "Before you move, take a quick look at their checks, captures, and attacks on unprotected pieces. Start with the likely reply below your move.",
    target: null,
    attackers: [],
  };
}
