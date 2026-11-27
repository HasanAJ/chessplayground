import { Chess, type Move } from "chess.js";
import { gameOutcome } from "./position.ts";
import { uciMove } from "./moves.ts";
import { addStudyMove, replayStudy, type Study } from "./study.ts";

type StudySnapshot = {
  study: Study;
  positionGame: Chess;
  history: Move[];
  outcomes: ReturnType<typeof gameOutcome>[];
};

/** The history-bearing board is private. Position views never own repetition state. */
export class StudySession {
  private game: Chess;
  private view: StudySnapshot;
  constructor(study: Study) {
    const replay = replayStudy(study);
    this.game = replay.game;
    this.view = {
      study,
      history: replay.history,
      outcomes: replay.outcomes,
      positionGame: new Chess(replay.game.fen()),
    };
  }
  get snapshot() {
    return this.view;
  }
  play(parent: string, uci: string): StudySnapshot {
    const previous = this.view;
    const branch =
      parent === previous.study.tipId
        ? {
            game: this.game,
            history: previous.history,
            outcomes: previous.outcomes,
          }
        : replayStudy(previous.study, parent);
    if (branch.outcomes.at(-1)!.terminal)
      throw new Error("The game has ended.");
    const move = uciMove(branch.game, uci);
    const study = addStudyMove(previous.study, parent, move.lan);
    this.game = branch.game;
    this.view = {
      study,
      positionGame: new Chess(move.after),
      history: [...branch.history, move],
      outcomes: [...branch.outcomes, gameOutcome(branch.game)],
    };
    return this.view;
  }
}
