import type { Move } from "chess.js";
import { notice, type Diagnostic } from "../../i18n/notices.ts";
import {
  selectBestLine,
  type EngineLine,
} from "../../domain/analysis/lines.ts";
import { mateAfterMove } from "../../domain/chess/evaluation.ts";
import {
  candidatesFor,
  type Candidate,
} from "../../domain/coach/candidatePresentation.ts";
import { reviewMove, type MoveReview } from "../../domain/coach/grading.ts";
import type { AnalysisClient, AnalysisHistory } from "../ports/analysis.ts";
import { SearchScope } from "../shared/SearchScope.ts";

export type ReviewState = { key: string } & (
  | { state: "thinking" }
  | { state: "ready"; review: MoveReview }
  | { state: "error"; error: Diagnostic }
);
type ReviewPosition = {
  move: Move;
  history: AnalysisHistory;
  terminal: string | null;
  drawn: boolean;
};

function chosen(
  fen: string,
  lines: EngineLine[],
  move?: string,
  final?: EngineLine,
) {
  const line = selectBestLine(lines, move, final);
  return line ? candidatesFor(fen, [{ ...line, rank: 1 }])[0] : undefined;
}
function replyFor(candidate: Candidate) {
  if (candidate.pv.length < 2) return undefined;
  return candidatesFor(candidate.move.after, [
    {
      rank: 1,
      depth: Math.max(1, candidate.depth - 1),
      pv: candidate.pv.slice(1),
      cp: candidate.cp === undefined ? undefined : -candidate.cp,
      mate:
        candidate.mate === undefined
          ? undefined
          : mateAfterMove(candidate.mate),
    },
  ])[0];
}

export function startMoveReview(
  engine: AnalysisClient,
  position: ReviewPosition,
  callbacks: {
    onComplete: (review: MoveReview) => void;
    onError: (error: Diagnostic) => void;
  },
) {
  const scope = new SearchScope(engine);
  const { move, history, terminal, drawn } = position;
  const beforeHistory = { ...history, moves: history.moves.slice(0, -1) };
  const fail = callbacks.onError;
  const finish = (best: Candidate, reply?: Candidate, played?: Candidate) => {
    callbacks.onComplete(
      reviewMove(move, best, terminal ? undefined : reply, drawn, played),
    );
  };
  const compare = (best: Candidate, depth = 20, catchUp = true) => {
    scope.run(
      move.before,
      {
        onProgress() {},
        onError: fail,
        onComplete(lines, selected, final) {
          const winner = chosen(move.before, lines, selected, final);
          if (!winner || ![best.move.lan, move.lan].includes(winner.move.lan)) {
            fail(notice("coach.review.error.comparison"));
            return;
          }
          if (winner.move.lan === move.lan) {
            finish(winner, replyFor(winner), winner);
            return;
          }
          const completedDepth = lines[0]?.depth ?? 0;
          const choices = candidatesFor(move.before, lines);
          const played = choices.find(
            (candidate) => candidate.move.lan === move.lan,
          );
          const alternative = choices.find(
            (candidate) => candidate.move.lan === winner.move.lan,
          );
          // A newer partial score does not invalidate an unchanged, complete ranking.
          if (
            winner.move.lan === lines[0]?.pv[0] &&
            played &&
            alternative &&
            played.depth === alternative.depth
          ) {
            finish(alternative, replyFor(played), played);
            return;
          }
          if (catchUp)
            compare(best, Math.max(winner.depth, completedDepth), false);
          else fail(notice("coach.review.error.comparison"));
        },
      },
      beforeHistory,
      {
        multiPV: 2,
        depth,
        movetime: catchUp ? 1800 : 3000,
        searchMoves: [best.move.lan, move.lan],
      },
    );
  };
  scope.run(
    move.before,
    {
      onProgress() {},
      onError: fail,
      onComplete(lines, selected, final) {
        const best = chosen(move.before, lines, selected, final);
        if (!best) {
          fail(notice("coach.review.error.failed"));
          return;
        }
        if (best.move.lan !== move.lan) {
          compare(best);
          return;
        }
        if (terminal) {
          finish(best);
          return;
        }
        scope.run(
          move.after,
          {
            onProgress() {},
            onError: fail,
            onComplete(nextLines, replyMove, replyLine) {
              const reply = chosen(move.after, nextLines, replyMove, replyLine);
              if (reply) finish(best, reply);
              else fail(notice("coach.review.error.reply"));
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
  return scope.dispose;
}
