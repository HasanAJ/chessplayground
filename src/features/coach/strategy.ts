import { Chess, type Color, type Move, type Square } from "chess.js";
import { names, opposite, positionOf, sideName } from "../../chess/position";
import type { Candidate } from "./candidates";

const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const center: Square[] = ["d4", "e4", "d5", "e5"];

function material(game: Chess, color: Color) {
  return Object.values(positionOf(game)).reduce(
    (total, piece) => total + (piece?.color === color ? values[piece.type] : 0),
    0,
  );
}
function loosePieces(game: Chess, side: Color): Square[] {
  return Object.entries(positionOf(game))
    .filter(
      ([sq, piece]) =>
        piece?.color === side &&
        piece.type !== "k" &&
        game.isAttacked(sq as Square, opposite(side)) &&
        !game.isAttacked(sq as Square, side),
    )
    .map(([sq]) => sq as Square);
}

export type StrategyInsight = {
  facts: string[];
  change: string | null;
  comparison: string;
  squares: Square[];
};

export function strategyInsight(
  game: Chess,
  best: Candidate,
  alternative?: Candidate,
  lastMove?: Move | null,
): StrategyInsight {
  const side = game.turn();
  const facts: string[] = [];
  const squares: Square[] = [];
  const afterBest = new Chess(best.move.after);
  const targets = Object.entries(positionOf(afterBest)).filter(
    ([sq, piece]) =>
      piece?.color === opposite(side) &&
      afterBest.attackers(sq as Square, side).includes(best.move.to) &&
      !game.attackers(sq as Square, side).includes(best.move.from),
  );
  if (targets.length) {
    facts.push(
      `${best.move.san} puts ${targets.map(([sq, piece]) => `their ${names[piece!.type]} on ${sq}`).join(" and ")} under attack from your ${names[best.move.promotion ?? best.move.piece]}.`,
    );
    squares.push(
      best.move.from,
      best.move.to,
      ...targets.map(([sq]) => sq as Square),
    );
  }
  const loose = loosePieces(game, side);
  if (loose.length) {
    facts.push(
      `Your ${loose.map((sq) => `${names[game.get(sq)!.type]} on ${sq}`).join(" and ")} ${loose.length === 1 ? "is" : "are"} under attack with no defender.`,
    );
    squares.push(...loose);
  }
  const controlled = center.filter((sq) => game.isAttacked(sq, side));
  if (controlled.length && facts.length < 2) {
    facts.push(`Your pieces cover ${controlled.join(", ")} in the center.`);
    squares.push(...controlled);
  }
  const end = best.continuation.at(-1);
  if (end) {
    const future = new Chess(end.after);
    const beforeBalance = material(game, side) - material(game, opposite(side));
    const afterBalance =
      material(future, side) - material(future, opposite(side));
    const gain = afterBalance - beforeBalance;
    facts.push(
      future.isCheckmate()
        ? `${end.san} finishes this line with checkmate.`
        : end.captured
          ? `The preview ends with ${sideName(end.color)} playing ${end.san}, a capture. The exchange may continue.`
          : gain > 0
            ? `In this possible line, you’d gain the equivalent of ${gain} pawn${gain === 1 ? "" : "s"} in material.`
            : gain < 0
              ? `In this possible line, you’d give up the equivalent of ${Math.abs(gain)} pawn${gain === -1 ? "" : "s"} in material.`
              : "The material balance stays the same in this line.",
    );
  }
  let change: string | null = null;
  if (lastMove) {
    const before = new Chess(lastMove.before);
    const previousLoose = loosePieces(before, side);
    const newLoose = loose.filter((sq) => !previousLoose.includes(sq));
    if (game.inCheck()) {
      const king = Object.entries(positionOf(game)).find(
        ([, piece]) => piece?.color === side && piece.type === "k",
      );
      if (king) squares.push(king[0] as Square);
      change = `${lastMove.san} puts your king in check. Getting out of check comes first.`;
    } else if (newLoose.length)
      change = `${lastMove.san} leaves your ${names[game.get(newLoose[0])!.type]} on ${newLoose[0]} under attack with no defender. Take care of it before carrying on with your plan.`;
    else if (lastMove.captured) {
      squares.push(lastMove.to);
      change = `They’ve just taken your ${names[lastMove.captured]} with ${lastMove.san}. Look at ${best.move.san} before deciding how to answer.`;
    } else {
      const changed = center.filter(
        (sq) =>
          before.isAttacked(sq, opposite(side)) !==
          game.isAttacked(sq, opposite(side)),
      );
      change = changed.length
        ? `${lastMove.san} changes their control of ${changed.join(", ")}. Try ${best.move.san} now, and see how they might respond.`
        : `Their ${names[lastMove.promotion ?? lastMove.piece]} is now on ${lastMove.to}. Try ${best.move.san}${best.continuation[1] ? `; one reply to look at is ${best.continuation[1].san}` : " and see how they respond"}.`;
      squares.push(lastMove.to, ...changed);
    }
  }
  const gap = alternative
    ? Math.max(
        0,
        (best.whiteScore - alternative.whiteScore) * (side === "w" ? 1 : -1),
      )
    : 0;
  const comparison = !alternative
    ? game.moves().length === 1
      ? "This position has only one legal move."
      : `${best.move.san} is the only recommended move here. The other moves checked give up too much compared with it.`
    : best.mate !== undefined || alternative.mate !== undefined
      ? `Here, checkmate threats matter more than a small difference in score. Play through ${best.move.san} and ${alternative.move.san}, and follow the checks carefully.`
      : gap < 0.3
        ? `${best.move.san} and ${alternative.move.san} both look good here. Play through their replies and choose the position you’d rather have.`
        : `${best.move.san} looks stronger than ${alternative.move.san} here. Play through both replies to see how the positions differ.`;
  return {
    facts: facts.slice(0, 3),
    change,
    comparison,
    squares: [...new Set(squares)],
  };
}
