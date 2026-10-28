import { Chess, type Move } from "chess.js";
import { uciMove } from "./moves";
import { gameOutcome } from "./position";
import { addStudyMove, replayStudy, type Study } from "./study";

export type StudySnapshot = {
  study: Study;
  // Position-only rules; repetition and other game outcomes live in outcomes.
  positionGame: Chess;
  history: Move[];
  outcomes: ReturnType<typeof gameOutcome>[];
};

/** Own the mutable rules engine; views and reviews receive separate snapshots. */
export class StudySession {
  private game: Chess;
  private current: StudySnapshot;

  get snapshot(): StudySnapshot {
    return this.current;
  }

  constructor(study: Study) {
    const { game, history, outcomes } = replayStudy(study);
    this.game = game;
    this.current = {
      study,
      positionGame: new Chess(game.fen()),
      history,
      outcomes,
    };
  }

  play(parent: string, uci: string): StudySnapshot {
    const { study } = this.snapshot;
    let game = this.game;
    let { history, outcomes } = this.snapshot;
    if (parent !== study.tipId) {
      const replay = replayStudy(study, parent);
      game = replay.game;
      history = replay.history;
      outcomes = replay.outcomes;
    }
    const move = uciMove(game, uci);
    this.game = game;
    this.current = {
      study: addStudyMove(study, parent, move.lan),
      positionGame: new Chess(move.after),
      history: [...history, move],
      outcomes: [...outcomes, gameOutcome(game)],
    };
    return this.snapshot;
  }
}
