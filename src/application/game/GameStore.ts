import {
  Chess,
  type Color,
  type Move,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { StudySession } from "../../domain/chess/StudySession.ts";
import {
  createStudy,
  nodePath,
  ROOT,
  type Study,
} from "../../domain/chess/study.ts";
import {
  arrangementIssue,
  checkedGame,
  editPosition,
  opposite,
  pieceLimitError,
  positionOf,
  setupFen,
  START_FEN,
  withTurn,
  type Position,
} from "../../domain/chess/position.ts";
import type { Diagnostic } from "../../i18n/notices.ts";
import { ObservableState } from "../shared/ObservableState.ts";

export type PieceTool = "move" | `${Color}${PieceSymbol}`;
type Draft = { position: Position; turn: Color; rights: string };
type Controls = {
  draft: Draft | null;
  historyPly: number | null;
  tool: PieceTool;
  promotion: { from: Square; to: Square } | null;
  computerMove: Move | null;
  revealBoard: number;
  error: Diagnostic | null;
};
const controls = (): Controls => ({
  draft: null,
  historyPly: null,
  tool: "move",
  promotion: null,
  computerMove: null,
  revealBoard: 0,
  error: null,
});

function derive(session: StudySession, state: Controls) {
  const { study, history, outcomes, positionGame } = session.snapshot;
  const path = nodePath(study);
  const reviewing = !state.draft && state.historyPly !== null;
  const ply = reviewing ? state.historyPly! : history.length;
  const nodeId = path[ply - 1]?.id ?? ROOT;
  const analysisGame = reviewing
    ? new Chess(history[ply - 1]?.after ?? study.rootFen)
    : positionGame;
  const analysisFen = analysisGame.fen();
  return {
    ...session.snapshot,
    ...state,
    path,
    fen: positionGame.fen(),
    playable: !state.draft,
    reviewing,
    analysisGame,
    analysisFen,
    analysisKey: `${study.id}:${nodeId}:${analysisFen}`,
    terminal: outcomes.at(-1)!.terminal,
    analysisTerminal: outcomes[ply].terminal,
    lastMove: history.at(-1) ?? null,
    reviewedMove: reviewing ? history[ply - 1] : null,
    positionIssue: state.draft
      ? arrangementIssue(
          state.draft.position,
          state.draft.turn,
          state.draft.rights,
        )
      : null,
  };
}
export type GameSnapshot = ReturnType<typeof derive>;

export class GameStore extends ObservableState<GameSnapshot> {
  private session: StudySession;
  private controls = controls();
  constructor(
    study: Study,
    private onEdit: () => void = () => {},
  ) {
    const session = new StudySession(study);
    super(derive(session, controls()));
    this.session = session;
  }
  private update(patch: Partial<Controls>) {
    if (
      this.value.study === this.session.snapshot.study &&
      Object.entries(patch).every(
        ([key, value]) => this.controls[key as keyof Controls] === value,
      )
    )
      return;
    this.controls = { ...this.controls, ...patch };
    this.publish(derive(this.session, this.controls));
  }
  private open(study: Study) {
    this.session = new StudySession(study);
    this.update({ ...controls(), revealBoard: this.value.revealBoard });
  }
  setTool = (tool: PieceTool) => this.update({ tool });
  setPromotion = (promotion: Controls["promotion"]) =>
    this.update({ promotion });
  setError = (error: Diagnostic | null) => this.update({ error });
  startGame = (fen: string) => {
    const revealBoard = this.value.revealBoard + 1;
    this.open(createStudy(fen));
    this.update({ revealBoard });
  };
  newGame = () => this.startGame(START_FEN);
  replaceGame = (game: Chess) => {
    this.onEdit();
    this.open(createStudy(game.fen()));
  };
  showHistory = (requested: number) => {
    const ply = Math.max(
      0,
      Math.min(this.value.history.length, Math.trunc(requested)),
    );
    if (!Number.isFinite(ply)) return;
    this.update({
      historyPly: ply === this.value.history.length ? null : ply,
      computerMove: null,
      promotion: null,
      error: null,
    });
  };
  playMove = (
    from: Square,
    to: Square,
    promotion?: PieceSymbol,
    byComputer = false,
  ) => {
    const view = this.value;
    if (!view.playable || view.analysisTerminal || from === to) return;
    const choices = view.analysisGame
      .moves({ square: from, verbose: true })
      .filter((move) => move.to === to);
    if (!choices.length) return;
    if (!promotion && choices.some((move) => move.promotion)) {
      this.update({ promotion: { from, to } });
      return;
    }
    const move = choices.find((choice) => choice.promotion === promotion);
    if (!move) return;
    const parent = view.reviewing
      ? (view.path[view.historyPly! - 1]?.id ?? ROOT)
      : view.study.tipId;
    this.session.play(parent, move.lan);
    if (view.reviewing) this.onEdit();
    this.update({
      ...controls(),
      revealBoard: view.revealBoard + (byComputer ? 0 : 1),
      computerMove: byComputer ? move : null,
    });
  };
  setBoardPosition = (position: Position, turn: Color, rights: string) => {
    const error = pieceLimitError(position);
    if (error) {
      this.setError(error);
      return;
    }
    this.onEdit();
    let game: Chess;
    try {
      game = checkedGame(setupFen(position, turn, rights));
    } catch {
      this.update({
        ...controls(),
        draft: { position, turn, rights },
        revealBoard: this.value.revealBoard,
      });
      return;
    }
    this.open(createStudy(game.fen()));
  };
  arrangePiece = (
    position: Position,
    turn: Color,
    rights: string,
    square: Square,
    piece?: Position[Square],
    from?: Square,
  ) => {
    if (from && (!piece || from === square)) return;
    const edit = editPosition(position, rights, square, piece, from);
    this.setBoardPosition(
      edit.position,
      piece ? opposite(piece.color) : turn,
      edit.rights,
    );
    this.setTool("move");
  };
  chooseNextPlayer = (turn: Color) => {
    const current = this.value;
    if (turn === (current.draft?.turn ?? current.analysisGame.turn())) return;
    if (current.draft) {
      this.setBoardPosition(current.draft.position, turn, current.draft.rights);
      return;
    }
    try {
      this.replaceGame(withTurn(current.analysisFen, turn));
    } catch {
      this.setBoardPosition(
        positionOf(current.analysisGame),
        turn,
        current.analysisFen.split(" ")[2].replace("-", ""),
      );
    }
  };
}
