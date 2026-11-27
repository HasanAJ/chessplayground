import { Chess, type Color, type Move, type Square } from "chess.js";
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

function attackArrows(
  board: Chess,
  color: Color,
  selectAttackers: (target: Square, attackers: Square[]) => Square[],
) {
  const fields = board.fen().split(" ");
  fields[1] = color;
  fields[3] = "-";
  const captures = new Chess(fields.join(" "));
  const legal = new Map<Square, Set<Square>>();
  const targets = board
    .board()
    .flat()
    .filter((piece) => piece !== null)
    .filter((piece) => piece.color === opposite(color) && piece.type !== "p");
  const importance = (piece: (typeof targets)[number]) =>
    piece.type === "k" ? 100 : pieceValues[piece.type];
  targets.sort((a, b) => importance(b) - importance(a));
  const arrows: BoardFocus["arrows"] = [];
  for (const target of targets) {
    const attackers = selectAttackers(
      target.square,
      board.attackers(target.square, color),
    );
    for (const from of attackers) {
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

export function newThreatArrows(
  move: Move,
  before = new Chess(move.before),
  after = new Chess(move.after),
) {
  const origins = movedOrigins(move);
  return attackArrows(after, move.color, (target, attackers) => {
    const oldAttackers = before.attackers(target, move.color);
    return attackers.filter(
      (from) => !oldAttackers.includes(origins.get(from) ?? from),
    );
  });
}

export function forkArrows(attacks: BoardFocus["arrows"]) {
  for (const from of new Set(attacks.map((attack) => attack.from))) {
    const targets = attacks.filter((attack) => attack.from === from);
    if (targets.length > 1) return targets;
  }
  return [];
}

export function checkingFork(move: Move, after: Chess) {
  if (!move.san.endsWith("+") || after.isDraw()) return undefined;
  const [king] = after.findPiece({ type: "k", color: opposite(move.color) });
  const checkers = new Set(after.attackers(king, move.color));
  // A check can fork a piece that the checker was already attacking.
  const attacks = attackArrows(after, move.color, (_, attackers) =>
    attackers.filter((from) => checkers.has(from)),
  );
  const arrows = forkArrows(attacks);
  if (!arrows.length) return undefined;
  return { arrows, targets: arrows.filter(({ to }) => to !== king) };
}

export function describeTargets(
  board: Chess,
  attacks: BoardFocus["arrows"],
  t: Translator,
) {
  return attacks
    .map(({ to }) =>
      t("coach.piece.onSquare", t(pieceNameKeys[board.get(to)!.type]), to),
    )
    .join(t("common.join.and"));
}

export function tacticalThreats(move: Move, t: Translator) {
  const board = new Chess(move.after);
  const arrows = newThreatArrows(move, new Chess(move.before), board);
  if (arrows.length === 0) return undefined;
  const origins = movedOrigins(move);
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
