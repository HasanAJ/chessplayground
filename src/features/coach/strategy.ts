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

export type StrategyInsight = {
  facts: string[];
  change: string | null;
  squares: Square[];
};

export function strategyInsight(
  game: Chess,
  best: Candidate,
  lastMove?: Move | null,
  t: Translator = english,
): StrategyInsight {
  const side = game.turn();
  const facts: string[] = [];
  const squares: Square[] = [];
  // The recommendation already explains the squares in its board illustration.
  const controlled = center.filter(
    (sq) => game.isAttacked(sq, side) && !best.explanationFocus?.squares.includes(sq),
  );
  if (controlled.length) {
    facts.push(t("coach.strategy.center", controlled.join(", ")));
    squares.push(...controlled);
  }
  const end = best.continuation.length > 1 ? best.continuation.at(-1) : undefined;
  if (end) {
    const future = new Chess(end.after);
    const beforeBalance = material(game, side) - material(game, opposite(side));
    const afterBalance = material(future, side) - material(future, opposite(side));
    const gain = afterBalance - beforeBalance;
    if (future.isCheckmate())
      facts.push(t("coach.strategy.line.checkmate", end.san));
    else if (end.captured)
      facts.push(t("coach.strategy.line.capture", sideName(end.color, t), end.san));
    else if (gain > 0)
      facts.push(
        t(
          gain === 1
            ? "coach.strategy.material.gain.singular"
            : "coach.strategy.material.gain.plural",
          gain,
        ),
      );
    else if (gain < 0)
      facts.push(
        t(
          gain === -1
            ? "coach.strategy.material.loss.singular"
            : "coach.strategy.material.loss.plural",
          Math.abs(gain),
        ),
      );
  }
  let change: string | null = null;
  if (lastMove) {
    if (game.inCheck()) {
      const king = Object.entries(positionOf(game)).find(
        ([, piece]) => piece?.color === side && piece.type === "k",
      );
      if (king) squares.push(king[0] as Square);
      change = t("coach.strategy.change.check", lastMove.san);
    } else if (lastMove.captured) {
      squares.push(lastMove.to);
      change = t(
        "coach.strategy.change.capture",
        t(pieceNameKeys[lastMove.captured]),
        lastMove.san,
      );
    } else if (lastMove.promotion) {
      squares.push(lastMove.to);
      change = t(
        "coach.strategy.change.promotion",
        lastMove.san,
        t(pieceNameKeys[lastMove.promotion]),
        lastMove.to,
      );
    }
  }
  return { facts, change, squares: [...new Set(squares)] };
}
