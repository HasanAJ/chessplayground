import { Chess, type Color, type Move, type Square } from "chess.js";
import { materialGain } from "../chess/material.ts";
import { capturedSquare } from "../chess/moves.ts";
import { movedOrigins, newThreatArrows } from "./tacticalThreats.ts";

/** Best material return from capturing on a square, allowing counter-recaptures. */
function exchangeGain(
  board: Chess,
  square: Square,
  cache: Map<string, number>,
): number {
  if (board.isGameOver()) return 0;
  const key = `${board.fen()} ${square}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const legal = board.moves({ verbose: true });
  const captures = legal.filter(
    (move) => move.captured && capturedSquare(move) === square,
  );
  // Declining the exchange is an option unless every legal evasion recaptures.
  let gain =
    captures.length > 0 && captures.length === legal.length ? -Infinity : 0;
  for (const move of captures) {
    const net =
      materialGain([move], move.color) -
      exchangeGain(new Chess(move.after), move.to, cache);
    gain = Math.max(gain, net);
  }
  cache.set(key, gain);
  return gain;
}

export function settledMaterialGain(moves: readonly Move[], side: Color) {
  const last = moves.at(-1)!;
  const gain = materialGain(moves, side);
  if (!last.captured && !last.promotion) return gain;
  const board = new Chess(last.after);
  const reply = exchangeGain(board, last.to, new Map());
  return gain + reply * (board.turn() === side ? 1 : -1);
}

function exchangeEnd(moves: readonly Move[], start: number) {
  let end = start,
    square = moves[start].to;
  for (let ply = start + 1; ply < moves.length; ply++) {
    const move = moves[ply];
    const recapture = move.captured && capturedSquare(move) === square;
    if (
      !recapture &&
      !move.san.includes("+") &&
      !new Chess(move.before).isCheck()
    )
      break;
    end = ply;
    if (move.captured || move.promotion) square = move.to;
  }
  return end;
}

export function hangsMaterial(moves: readonly Move[]) {
  const reply = moves[1];
  if (!reply) return false;
  const side = moves[0].color;
  const board = new Chess(reply.after);
  const targets = new Set(
    newThreatArrows(reply)
      .map(({ to }) => to)
      .filter((square) => board.get(square)?.type !== "k"),
  );
  for (let ply = 1; ply < moves.length; ply++) {
    const move = moves[ply];
    const capturesTarget = move.captured && targets.has(capturedSquare(move));
    const immediate = ply === 1 && (move.captured || move.promotion);
    if (move.color !== side && (immediate || capturesTarget)) {
      const end = exchangeEnd(moves, ply);
      if (settledMaterialGain(moves.slice(0, end + 1), side) < 0) return true;
    }

    const after = new Chess(move.after);
    if (move.color === side) {
      // Keep following a threatened piece if it moves, including a castling rook.
      const destinations = [...movedOrigins(move)].filter(([, from]) =>
        targets.has(from),
      );
      for (const [, from] of destinations) targets.delete(from);
      for (const [to] of destinations) targets.add(to);
      if (new Chess(move.before).isCheck()) {
        // A forced king response can uncover a capture behind the checked king.
        for (const piece of after.board().flat())
          if (
            piece?.color === side &&
            piece.type !== "k" &&
            after.isAttacked(piece.square, reply.color)
          )
            targets.add(piece.square);
      }
    }
    for (const square of targets)
      if (
        after.get(square)?.color !== side ||
        !after.isAttacked(square, reply.color)
      )
        targets.delete(square);
    if (targets.size === 0 && !after.isCheck()) break;
  }
  return false;
}
