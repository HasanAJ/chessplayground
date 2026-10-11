import { english, type Translator } from "../../i18n/translate";
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
  t: Translator = english,
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
      t(
        "{0} puts {1} under attack from your {2}.",
        best.move.san,
        targets
          .map(([sq, piece]) =>
            t("their {0} on {1}", t(names[piece!.type]), sq),
          )
          .join(t(" and ")),
        t(names[best.move.promotion ?? best.move.piece]),
      ),
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
      t(
        loose.length === 1
          ? "Your {0} is under attack with no defender."
          : "Your {0} are under attack with no defender.",
        loose
          .map((sq) => t("{0} on {1}", t(names[game.get(sq)!.type]), sq))
          .join(t(" and ")),
      ),
    );
    squares.push(...loose);
  }
  const controlled = center.filter((sq) => game.isAttacked(sq, side));
  if (controlled.length && facts.length < 2) {
    facts.push(
      t("Your pieces cover {0} in the center.", controlled.join(", ")),
    );
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
        ? t("{0} finishes this line with checkmate.", end.san)
        : end.captured
          ? t(
              "The preview ends with {0} playing {1}, a capture. The exchange may continue.",
              sideName(end.color, t),
              end.san,
            )
          : gain > 0
            ? t(
                gain === 1
                  ? "In this possible line, you’d gain the equivalent of {0} pawn in material."
                  : "In this possible line, you’d gain the equivalent of {0} pawns in material.",
                gain,
              )
            : gain < 0
              ? t(
                  gain === -1
                    ? "In this possible line, you’d give up the equivalent of {0} pawn in material."
                    : "In this possible line, you’d give up the equivalent of {0} pawns in material.",
                  Math.abs(gain),
                )
              : t("The material balance stays the same in this line."),
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
      change = t(
        "{0} puts your king in check. Getting out of check comes first.",
        lastMove.san,
      );
    } else if (newLoose.length)
      change = t(
        "{0} leaves your {1} on {2} under attack with no defender. Take care of it before carrying on with your plan.",
        lastMove.san,
        t(names[game.get(newLoose[0])!.type]),
        newLoose[0],
      );
    else if (lastMove.captured) {
      squares.push(lastMove.to);
      change = t(
        "They’ve just taken your {0} with {1}. Look at {2} before deciding how to answer.",
        t(names[lastMove.captured]),
        lastMove.san,
        best.move.san,
      );
    } else {
      const changed = center.filter(
        (sq) =>
          before.isAttacked(sq, opposite(side)) !==
          game.isAttacked(sq, opposite(side)),
      );
      change = changed.length
        ? t(
            "{0} changes their control of {1}. Try {2} now, and see how they might respond.",
            lastMove.san,
            changed.join(", "),
            best.move.san,
          )
        : t(
            "Their {0} is now on {1}. Try {2}{3}.",
            t(names[lastMove.promotion ?? lastMove.piece]),
            lastMove.to,
            best.move.san,
            best.continuation[1]
              ? t("; one reply to look at is {0}", best.continuation[1].san)
              : t(" and see how they respond"),
          );
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
      ? t("This position has only one legal move.")
      : t(
          "{0} is the only recommended move here. The other moves checked give up too much compared with it.",
          best.move.san,
        )
    : best.mate !== undefined || alternative.mate !== undefined
      ? t(
          "Here, checkmate threats matter more than a small difference in score. Play through {0} and {1}, and follow the checks carefully.",
          best.move.san,
          alternative.move.san,
        )
      : gap < 0.3
        ? t(
            "{0} and {1} both look good here. Play through their replies and choose the position you’d rather have.",
            best.move.san,
            alternative.move.san,
          )
        : t(
            "{0} looks stronger than {1} here. Play through both replies to see how the positions differ.",
            best.move.san,
            alternative.move.san,
          );
  return {
    facts: facts.slice(0, 3),
    change,
    comparison,
    squares: [...new Set(squares)],
  };
}
