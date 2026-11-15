import { Chess, type Move, type Square } from "chess.js";
import { opposite, pieceNameKeys } from "../chess/position.ts";
import { pieceValues } from "../chess/material.ts";
import type { Translator } from "../../i18n/translate.ts";
import { boardFocus, type BoardFocus } from "./boardFocus.ts";

/** Piece origins keyed by destination, including the rook when castling. */
export function movedOrigins(move: Move) {
  const origins = new Map<Square, Square>([[move.to, move.from]]);
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const side = move.isKingsideCastle();
    origins.set(
      `${side ? "f" : "d"}${move.from[1]}` as Square,
      `${side ? "h" : "a"}${move.from[1]}` as Square,
    );
  }
  return origins;
}

/** Retain only newly created attacks; pinned non-king captures are not threats. */
function newAttacks(move: Move, board: Chess, origins: Map<Square, Square>) {
  const before = new Chess(move.before);
  const fields = board.fen().split(" ");
  fields[1] = move.color;
  fields[3] = "-";
  const captures = new Chess(fields.join(" "));
  const legal = new Map<Square, Set<Square>>();
  const targets = board
    .board()
    .flat()
    .filter((piece) => piece !== null)
    .filter(
      (piece) => piece.color === opposite(move.color) && piece.type !== "p",
    );
  const importance = (piece: (typeof targets)[number]) =>
    piece.type === "k" ? 100 : pieceValues[piece.type];
  targets.sort((a, b) => importance(b) - importance(a));
  const arrows: BoardFocus["arrows"] = [];
  for (const target of targets) {
    const oldAttackers = new Set(before.attackers(target.square, move.color));
    for (const from of board.attackers(target.square, move.color)) {
      if (oldAttackers.has(origins.get(from) ?? from)) continue;
      if (target.type !== "k") {
        if (!legal.has(from))
          legal.set(
            from,
            new Set(
              captures
                .moves({ square: from, verbose: true })
                .map((capture) => capture.to),
            ),
          );
        if (!legal.get(from)!.has(target.square)) continue;
      }
      arrows.push({ from, to: target.square });
    }
  }
  return arrows;
}

export function newThreatArrows(move: Move) {
  return newAttacks(move, new Chess(move.after), movedOrigins(move));
}

export function tacticalThreats(move: Move, t: Translator) {
  const board = new Chess(move.after);
  const origins = movedOrigins(move);
  const arrows = newAttacks(move, board, origins);
  if (arrows.length === 0) return undefined;
  const sources = Array.from(new Set(arrows.map((arrow) => arrow.from)));
  sources.sort((a, b) => Number(b === move.to) - Number(a === move.to));
  const text = sources
    .map((from) => {
      const targets = arrows
        .filter((arrow) => arrow.from === from)
        .map(({ to }) =>
          t(
            "coach.piece.yoursOnSquare",
            t(pieceNameKeys[board.get(to)!.type]),
            to,
          ),
        )
        .join(t("common.join.and"));
      const piece = t(pieceNameKeys[board.get(from)!.type]);
      return origins.has(from)
        ? t("coach.lesson.threat.direct", piece, from, targets)
        : t(
            "coach.lesson.threat.discovered",
            t(pieceNameKeys[move.piece]),
            piece,
            from,
            targets,
          );
    })
    .join(" ");
  return { text, focus: boardFocus(t("coach.lesson.threat.focus"), arrows) };
}
