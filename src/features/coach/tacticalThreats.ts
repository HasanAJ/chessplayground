import { Chess, type Move, type Square } from "chess.js";
import { opposite, pieceNameKeys, positionOf } from "../../chess/position";
import { pieceValues } from "../../chess/material";
import type { Translator } from "../../i18n/translate";
import { boardFocus } from "./boardFocus";

/** New attacks made by the moving piece, including attacks it uncovers. */
export function tacticalThreats(move: Move, t: Translator) {
  const before = new Chess(move.before);
  const after = new Chess(move.after);
  const origins = new Map<Square, Square>([[move.to, move.from]]);
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    origins.set(
      `${move.isKingsideCastle() ? "f" : "d"}${move.from[1]}` as Square,
      `${move.isKingsideCastle() ? "h" : "a"}${move.from[1]}` as Square,
    );
  }
  const fen = after.fen().split(" ");
  fen[1] = move.color;
  fen[3] = "-";
  // Geometric attacks alone include pinned pieces. Check legal captures too.
  const captureBoard = new Chess(fen.join(" "));
  const legalMovesBySquare = new Map<Square, Move[]>();
  function legalMovesFrom(square: Square) {
    const cached = legalMovesBySquare.get(square);
    if (cached) return cached;
    const moves = captureBoard.moves({ square, verbose: true });
    legalMovesBySquare.set(square, moves);
    return moves;
  }
  const targets = Object.entries(positionOf(after))
    .filter(
      ([, piece]) => piece?.color === opposite(move.color) && piece.type !== "p",
    )
    .sort(
      (a, b) =>
        (b[1]!.type === "k" ? 100 : pieceValues[b[1]!.type]) -
        (a[1]!.type === "k" ? 100 : pieceValues[a[1]!.type]),
    );
  const arrows = targets.flatMap(([square, piece]) => {
    const to = square as Square;
    return after.attackers(to, move.color).flatMap((from) => {
      const original = origins.get(from) ?? from;
      if (before.attackers(to, move.color).includes(original)) return [];
      if (
        piece!.type !== "k" &&
        !legalMovesFrom(from).some((capture) => capture.to === to)
      )
        return [];
      return [{ from, to }];
    });
  });
  if (!arrows.length) return undefined;

  const attackers = [...new Set(arrows.map(({ from }) => from))].sort(
    (a, b) => Number(b === move.to) - Number(a === move.to),
  );
  const text = attackers
    .map((from) => {
      const namedTargets = arrows
        .filter((arrow) => arrow.from === from)
        .map(({ to }) =>
          t("coach.piece.yoursOnSquare", t(pieceNameKeys[after.get(to)!.type]), to),
        )
        .join(t("common.join.and"));
      return origins.has(from)
        ? t("coach.lesson.threat.direct", t(pieceNameKeys[after.get(from)!.type]), from, namedTargets)
        : t(
            "coach.lesson.threat.discovered",
            t(pieceNameKeys[move.piece]),
            t(pieceNameKeys[after.get(from)!.type]),
            from,
            namedTargets,
          );
    })
    .join(" ");
  return { text, focus: boardFocus(t("coach.lesson.threat.focus"), arrows) };
}
