import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Chess,
  type Color,
  type Move,
  type PieceSymbol,
  type Square,
} from "chess.js";
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
} from "../../chess/position";
import {
  createStudy,
  nodePath,
  ROOT,
  type Study,
} from "../../chess/study";
import { StudySession } from "../../chess/StudySession";
import { readSavedSession } from "./storage";
import { useStudyPersistence } from "./useStudyPersistence";

type PieceTool = "move" | `${Color}${PieceSymbol}`;

export function useGameController(onEdit: () => void) {
  const [savedSession] = useState(readSavedSession);
  const [{ session, snapshot }, setGameState] = useState(() => {
    const session = new StudySession(savedSession.study);
    return { session, snapshot: session.snapshot };
  });
  const { study, positionGame, history, outcomes } = snapshot;
  const fen = positionGame.fen();
  const persistence = useStudyPersistence(study, fen, savedSession);
  const path = useMemo(() => nodePath(study), [study]);
  const [draft, setDraft] = useState<{
    position: Position;
    turn: Color;
    rights: string;
  } | null>(null);
  const [historyPly, setHistoryPly] = useState<number | null>(null);
  const [tool, setTool] = useState<PieceTool>("move");
  const [promotion, setPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [revealBoard, setRevealBoard] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const playable = !draft;
  const reviewing = historyPly !== null && playable;
  const nodeId = reviewing ? (path[historyPly - 1]?.id ?? ROOT) : study.tipId;
  const analysisGame = useMemo(
    () =>
      reviewing
        ? new Chess(history[historyPly - 1]?.after ?? study.rootFen)
        : positionGame,
    [study.rootFen, history, historyPly, reviewing, positionGame],
  );
  const analysisFen = analysisGame.fen();
  const analysisKey = `${study.id}:${nodeId}:${analysisFen}`;
  const terminal = outcomes.at(-1)!.terminal;
  const analysisTerminal = outcomes[historyPly ?? history.length].terminal;
  const lastMove = history.at(-1) ?? null;
  const reviewedMove = reviewing ? history[historyPly - 1] : null;
  const positionIssue = useMemo(
    () =>
      draft ? arrangementIssue(draft.position, draft.turn, draft.rights) : null,
    [draft],
  );

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function resetBoardControls() {
    setComputerMove(null);
    setHistoryPly(null);
    setError("");
    setPromotion(null);
  }

  function openSession(next: StudySession) {
    setGameState({ session: next, snapshot: next.snapshot });
    setDraft(null);
    setTool("move");
    resetBoardControls();
  }

  function openStudy(next: Study) {
    openSession(new StudySession(next));
  }

  function replaceGame(next: Chess) {
    onEdit();
    openStudy(createStudy(next.fen()));
  }

  function newGame() {
    openStudy(createStudy(START_FEN));
    setNotice("");
    setRevealBoard((value) => value + 1);
  }

  function playMove(
    from: Square,
    to: Square,
    promote?: PieceSymbol,
    byComputer = false,
  ) {
    if (!playable || analysisTerminal) return;
    const choices = analysisGame
      .moves({ square: from, verbose: true })
      .filter((move) => move.to === to);
    if (from === to || !choices.length) return;
    if (choices.some((move) => move.promotion) && !promote) {
      setPromotion({ from, to });
      return;
    }
    const move = choices.find((choice) => choice.promotion === promote);
    if (!move) return;
    session.play(nodeId, move.lan);
    openSession(session);
    if (byComputer) setComputerMove(move);
    else setRevealBoard((value) => value + 1);
    if (reviewing) {
      onEdit();
      setNotice("Continuing from the selected position.");
    }
  }

  function setBoardPosition(position: Position, turn: Color, rights: string) {
    const limitError = pieceLimitError(position);
    if (limitError) {
      setError(limitError);
      return;
    }
    let next: Chess | null = null;
    try {
      next = checkedGame(setupFen(position, turn, rights));
    } catch {
      // Incomplete arrangements remain editable without starting an engine search.
    }
    onEdit();
    setNotice("");
    if (next) openStudy(createStudy(next.fen()));
    else {
      resetBoardControls();
      setDraft({ position, turn, rights });
    }
  }

  function arrangePiece(
    position: Position,
    turn: Color,
    rights: string,
    square: Square,
    piece?: { type: PieceSymbol; color: Color },
    from?: Square,
  ) {
    if (from && (!piece || from === square)) return;
    const next = editPosition(position, rights, square, piece, from);
    setBoardPosition(
      next.position,
      piece ? opposite(piece.color) : turn,
      next.rights,
    );
    setTool("move");
  }

  function chooseNextPlayer(color: Color) {
    const turn = draft?.turn ?? analysisGame.turn();
    if (color === turn) return;
    if (draft) {
      setBoardPosition(draft.position, color, draft.rights);
      return;
    }
    try {
      replaceGame(withTurn(analysisFen, color));
    } catch {
      setBoardPosition(
        positionOf(analysisGame),
        color,
        analysisFen.split(" ")[2].replace("-", ""),
      );
    }
  }

  const showHistory = useCallback(
    (ply: number) => {
      setComputerMove(null);
      setHistoryPly(ply === history.length ? null : ply);
      setPromotion(null);
      setError("");
    },
    [history.length],
  );

  return {
    study,
    positionGame,
    fen,
    history,
    outcomes,
    path,
    draft,
    playable,
    historyPly,
    tool,
    promotion,
    computerMove,
    revealBoard,
    error,
    notice,
    ...persistence,
    reviewing,
    analysisGame,
    analysisFen,
    analysisKey,
    terminal,
    analysisTerminal,
    lastMove,
    reviewedMove,
    positionIssue,
    setTool,
    setPromotion,
    setError,
    setNotice,
    replaceGame,
    newGame,
    playMove,
    setBoardPosition,
    arrangePiece,
    chooseNextPlayer,
    showHistory,
  };
}

export type GameController = ReturnType<typeof useGameController>;
