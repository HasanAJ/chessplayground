import type { AnalysisEngine } from "../../engine/AnalysisEngine";
import { candidatesFor, type Candidate } from "./candidates";
import { reviewMove, type MoveReview } from "./grading";
import { gameAt, nodePath, type Study } from "../../chess/study";

export type ReviewState = { key: string } & (
  | { state: "thinking" }
  | { state: "ready"; review: MoveReview }
  | { state: "error"; error: string }
);

/** Reuse the played move's searched continuation for its reply preview. */
function replyAfter(played: Candidate): Candidate | undefined {
  if (played.pv.length < 2) return undefined;
  return candidatesFor(played.move.after, [
    {
      rank: 1,
      depth: Math.max(1, played.depth - 1),
      cp: played.cp === undefined ? undefined : -played.cp,
      // Winning mate in N becomes losing mate in N-1 after our first move.
      // Losing mate in N becomes the opponent's winning mate in N.
      mate:
        played.mate === undefined
          ? undefined
          : played.mate > 0
            ? 1 - played.mate
            : -played.mate,
      pv: played.pv.slice(1),
    },
  ])[0];
}

export function startMoveReview(
  engine: Pick<AnalysisEngine, "analyze">,
  study: Study,
  nodeId: string,
  callbacks: {
    onComplete: (review: MoveReview) => void;
    onError: (message: string) => void;
  },
): () => void {
  const path = nodePath(study, nodeId);
  const before = gameAt(study, path.at(-1)!.parent);
  const after = gameAt(study, nodeId);
  const move = after.history({ verbose: true }).at(-1)!;
  const beforeHistory = {
    rootFen: study.rootFen,
    moves: path.slice(0, -1).map((item) => item.uci),
  };
  let canceled = false;
  let cancel: (() => void) | undefined;
  const fail = (message: string) => {
    if (!canceled) callbacks.onError(message);
  };
  cancel = engine.analyze(
    before.fen(),
    {
      onProgress() {},
      onError: fail,
      onComplete(lines) {
        if (canceled) return;
        const best = candidatesFor(before.fen(), lines)[0];
        if (!best) {
          fail("The engine could not review this move. Try again.");
          return;
        }
        if (move.lan !== best.move.lan) {
          // Compare both choices in the same position, at the same search depth.
          // This avoids grading differences between two independent short searches.
          cancel = engine.analyze(
            before.fen(),
            {
              onProgress() {},
              onError: fail,
              onComplete(comparison) {
                if (canceled) return;
                const choices = candidatesFor(before.fen(), comparison);
                const played = choices.find(
                  (choice) => choice.move.lan === move.lan,
                );
                const alternative = choices.find(
                  (choice) => choice.move.lan === best.move.lan,
                );
                if (
                  !played ||
                  !alternative ||
                  played.depth !== alternative.depth
                ) {
                  fail(
                    "The engine could not reliably compare this move. Try again.",
                  );
                  return;
                }
                callbacks.onComplete(
                  reviewMove(
                    move,
                    choices[0],
                    after.isGameOver() ? undefined : replyAfter(played),
                    after.isDraw(),
                    played,
                  ),
                );
              },
            },
            beforeHistory,
            {
              multiPV: 2,
              depth: 20,
              movetime: 1800,
              searchMoves: [best.move.lan, move.lan],
            },
          );
          return;
        }
        if (after.isGameOver()) {
          callbacks.onComplete(
            reviewMove(move, best, undefined, after.isDraw()),
          );
          return;
        }
        cancel = engine.analyze(
          after.fen(),
          {
            onProgress() {},
            onError: fail,
            onComplete(nextLines) {
              if (canceled) return;
              const reply = candidatesFor(after.fen(), nextLines)[0];
              if (!reply) {
                fail("The engine could not check the reply. Try again.");
                return;
              }
              callbacks.onComplete(reviewMove(move, best, reply));
            },
          },
          {
            rootFen: study.rootFen,
            moves: path.map((item) => item.uci),
          },
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
