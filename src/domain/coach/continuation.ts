import type { Chess, Move } from "chess.js";
import { uciMove } from "../chess/moves.ts";
import { materialGain } from "../chess/material.ts";

export function readContinuation(board: Chess, first: Move, pv: string[]) {
  const moves = [first];
  for (let ply = 1; ply < pv.length && !board.isGameOver(); ply++) {
    try {
      moves.push(uciMove(board, pv[ply]));
    } catch (error) {
      if (ply === 1) throw error;
      break;
    }
  }
  const complete = moves.length === pv.length || board.isGameOver();
  let materialLoss: number | undefined;
  if (complete && moves.length > 1) {
    materialLoss = Math.max(0, -materialGain(moves, first.color));
  }
  return { moves, materialLoss };
}
