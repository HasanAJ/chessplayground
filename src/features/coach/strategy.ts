import { english, type Translator } from "../../i18n/translate";
import { Chess, type Color, type Move, type Square } from "chess.js";
import { pieceNameKeys, opposite, positionOf, sideName } from "../../chess/position";
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
        "coach.strategy.attack",
        best.move.san,
        targets
          .map(([sq, piece]) =>
            t("coach.piece.theirsOnSquare", t(pieceNameKeys[piece!.type]), sq),
          )
          .join(t("common.join.and")),
        t(pieceNameKeys[best.move.promotion ?? best.move.piece]),
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
          ? "coach.strategy.undefended.singular"
          : "coach.strategy.undefended.plural",
        loose
          .map((sq) => t("coach.piece.onSquare", t(pieceNameKeys[game.get(sq)!.type]), sq))
          .join(t("common.join.and")),
      ),
    );
    squares.push(...loose);
  }
  const controlled = center.filter((sq) => game.isAttacked(sq, side));
  if (controlled.length && facts.length < 2) {
    facts.push(
      t("coach.strategy.center", controlled.join(", ")),
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
        ? t("coach.strategy.line.checkmate", end.san)
        : end.captured
          ? t(
              "coach.strategy.line.capture",
              sideName(end.color, t),
              end.san,
            )
          : gain > 0
            ? t(
                gain === 1
                  ? "coach.strategy.material.gain.singular"
                  : "coach.strategy.material.gain.plural",
                gain,
              )
            : gain < 0
              ? t(
                  gain === -1
                    ? "coach.strategy.material.loss.singular"
                    : "coach.strategy.material.loss.plural",
                  Math.abs(gain),
                )
              : t("coach.strategy.material.even"),
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
        "coach.strategy.change.check",
        lastMove.san,
      );
    } else if (newLoose.length)
      change = t(
        "coach.strategy.change.undefended",
        lastMove.san,
        t(pieceNameKeys[game.get(newLoose[0])!.type]),
        newLoose[0],
      );
    else if (lastMove.captured) {
      squares.push(lastMove.to);
      change = t(
        "coach.strategy.change.capture",
        t(pieceNameKeys[lastMove.captured]),
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
            "coach.strategy.change.center",
            lastMove.san,
            changed.join(", "),
            best.move.san,
          )
        : t(
            "coach.strategy.change.move",
            t(pieceNameKeys[lastMove.promotion ?? lastMove.piece]),
            lastMove.to,
            best.move.san,
            best.continuation[1]
              ? t("coach.strategy.change.reply", best.continuation[1].san)
              : t("coach.strategy.change.respond"),
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
      ? t("coach.strategy.compare.forced")
      : t(
          "coach.strategy.compare.onlyRecommendation",
          best.move.san,
        )
    : best.mate !== undefined || alternative.mate !== undefined
      ? t(
          "coach.strategy.compare.mate",
          best.move.san,
          alternative.move.san,
        )
      : gap < 0.3
        ? t(
            "coach.strategy.compare.similar",
            best.move.san,
            alternative.move.san,
          )
        : t(
            "coach.strategy.compare.stronger",
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
