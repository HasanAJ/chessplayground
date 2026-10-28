import type { Chess, Move } from "chess.js";
import { uciMove } from "../../chess/moves";
import { pieceValues } from "../../chess/material";

type Continuation = {
  moves: Move[];
  materialLoss: number | undefined;
};

/** Continue from the first move, advancing the supplied board through the legal PV. */
export function readContinuation(
  after: Chess,
  move: Move,
  pv: string[],
): Continuation {
  const moves = [move];
  if (pv[1] && !after.isGameOver()) {
    // An invalid immediate reply rejects the candidate. A later invalid move
    // only truncates the preview, and cannot support a material-loss claim.
    moves.push(uciMove(after, pv[1]));
    for (const uci of pv.slice(2)) {
      if (after.isGameOver()) break;
      try {
        moves.push(uciMove(after, uci));
      } catch {
        break;
      }
    }
  }

  const complete = moves.length === pv.length || after.isGameOver();
  return {
    moves,
    materialLoss: complete ? materialLossInLine(moves) : undefined,
  };
}

// Count the full line so a later recapture can balance an earlier exchange.
function materialLossInLine(moves: Move[]): number | undefined {
  const [first, reply] = moves;
  if (!reply) return undefined;
  const balance = moves.reduce((total, move) => {
    const gain =
      (move.captured ? pieceValues[move.captured] : 0) +
      (move.promotion ? pieceValues[move.promotion] - pieceValues.p : 0);
    return total + (move.color === first.color ? gain : -gain);
  }, 0);
  return Math.max(0, -balance);
}
