import type { Chess, Move } from "chess.js";
import { uciMove } from "../chess/moves.ts";
import { pieceValues } from "../chess/material.ts";

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
    const balance = moves.reduce((balance, move) => {
      const gain =
        (move.captured ? pieceValues[move.captured] : 0) +
        (move.promotion ? pieceValues[move.promotion] - 1 : 0);
      return balance + gain * (move.color === first.color ? 1 : -1);
    }, 0);
    materialLoss = Math.max(0, -balance);
  }
  return { moves, materialLoss };
}
