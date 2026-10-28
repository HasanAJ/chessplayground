import type { AnalysisClient } from "../../engine/analysis";
import type { EngineLine } from "../../engine/uci";
import { candidatesFor, type Candidate } from "./candidates";
import { reviewMove, type MoveReview } from "./grading";
import type { Move } from "chess.js";
import { mateAfterMove } from "../../chess/evaluation";

export type ReviewPosition = {
  move: Move;
  history: { rootFen: string; moves: string[] };
  terminal: string | null;
  drawn: boolean;
};

export type ReviewState = { key: string } & (
  | { state: "thinking" }
  | { state: "ready"; review: MoveReview }
  | { state: "error"; error: string }
);

function finalCandidate(
  fen: string,
  lines: EngineLine[],
  bestMove?: string,
  bestLine?: EngineLine,
): Candidate | undefined {
  const selected = bestMove
    ? bestLine?.pv[0] === bestMove
      ? bestLine
      : lines.find((line) => line.pv[0] === bestMove)
    : lines[0];
  return selected
    ? candidatesFor(fen, [{ ...selected, rank: 1 }])[0]
    : undefined;
}

/** Reuse the played move's searched continuation for its reply preview. */
function replyAfter(played: Candidate): Candidate | undefined {
  if (played.pv.length < 2) return undefined;
  return candidatesFor(played.move.after, [
    {
      rank: 1,
      depth: Math.max(1, played.depth - 1),
      cp: played.cp === undefined ? undefined : -played.cp,
      mate:
        played.mate === undefined
          ? undefined
          : mateAfterMove(played.mate),
      pv: played.pv.slice(1),
    },
  ])[0];
}

export function startMoveReview(
  engine: AnalysisClient,
  { move, history, terminal, drawn }: ReviewPosition,
  callbacks: {
    onComplete: (review: MoveReview) => void;
    onError: (message: string) => void;
  },
): () => void {
  const beforeHistory = {
    rootFen: history.rootFen,
    moves: history.moves.slice(0, -1),
  };
  let canceled = false;
  let cancel: (() => void) | undefined;
  const fail = (message: string) => {
    if (!canceled) callbacks.onError(message);
  };

  function compare(best: Candidate, depth = 20, retry = true) {
    cancel = engine.analyze(
      move.before,
      {
        onProgress() {},
        onError: fail,
        onComplete(lines, bestMove, bestLine) {
          if (canceled) return;
          const winner = finalCandidate(move.before, lines, bestMove, bestLine);
          if (
            !winner ||
            (winner.move.lan !== move.lan && winner.move.lan !== best.move.lan)
          ) {
            fail("The engine could not reliably compare this move. Try again.");
            return;
          }
          if (winner.move.lan === move.lan) {
            callbacks.onComplete(
              reviewMove(
                move,
                winner,
                terminal ? undefined : replyAfter(winner),
                drawn,
                winner,
              ),
            );
            return;
          }
          const completedDepth = lines[0]?.depth ?? 0;
          if (
            lines[0]?.pv[0] !== winner.move.lan ||
            winner.depth > completedDepth
          ) {
            // Catch up to the unfinished depth without chasing deeper iterations
            // or comparing the winner's new score with an older played score.
            if (retry)
              compare(best, Math.max(completedDepth, winner.depth), false);
            else
              fail("The engine could not reliably compare this move. Try again.");
            return;
          }
          const choices = candidatesFor(move.before, lines);
          const played = choices.find((choice) => choice.move.lan === move.lan);
          const alternative = choices.find(
            (choice) => choice.move.lan === winner.move.lan,
          );
          if (!played || !alternative || played.depth !== alternative.depth) {
            fail("The engine could not reliably compare this move. Try again.");
            return;
          }
          callbacks.onComplete(
            reviewMove(
              move,
              alternative,
              terminal ? undefined : replyAfter(played),
              drawn,
              played,
            ),
          );
        },
      },
      beforeHistory,
      {
        multiPV: 2,
        depth,
        movetime: 1800,
        searchMoves: [best.move.lan, move.lan],
      },
    );
  }

  cancel = engine.analyze(
    move.before,
    {
      onProgress() {},
      onError: fail,
      onComplete(lines, bestMove, bestLine) {
        if (canceled) return;
        const best = finalCandidate(move.before, lines, bestMove, bestLine);
        if (!best) {
          fail("The engine could not review this move. Try again.");
          return;
        }
        if (move.lan !== best.move.lan) {
          compare(best);
          return;
        }
        if (terminal) {
          callbacks.onComplete(
            reviewMove(move, best, undefined, drawn),
          );
          return;
        }
        cancel = engine.analyze(
          move.after,
          {
            onProgress() {},
            onError: fail,
            onComplete(nextLines, replyMove, replyLine) {
              if (canceled) return;
              const reply = finalCandidate(
                move.after,
                nextLines,
                replyMove,
                replyLine,
              );
              if (!reply) {
                fail("The engine could not check the reply. Try again.");
                return;
              }
              callbacks.onComplete(reviewMove(move, best, reply));
            },
          },
          history,
          { multiPV: 1, depth: 18, movetime: 1000 },
        );
      },
    },
    beforeHistory,
    { multiPV: 1, depth: 18, movetime: 1200 },
  );
  return () => {
    canceled = true;
    cancel?.();
  };
}
