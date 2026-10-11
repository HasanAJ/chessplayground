import { useEffect, useMemo, useState } from "react";
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
  ending,
  gameMoveLabel,
  opposite,
  pieceLimitError,
  positionOf,
  setupFen,
  START_FEN,
  withTurn,
  type Position,
} from "../../chess/position";
import {
  addStudyMove,
  createStudy,
  gameAt,
  nodePath,
  ROOT,
  SESSION_KEY,
  type Study,
} from "../../chess/study";
import { preserveRecovery, readSavedSession } from "./storage";

type PieceTool = "move" | `${Color}${PieceSymbol}`;

export function useGameController(onEdit: () => void) {
  const [savedSession] = useState(readSavedSession);
  const [study, setStudy] = useState(savedSession.study);
  const [recovery, setRecovery] = useState(savedSession.recovery);
  const [autosavePaused, setAutosavePaused] = useState(!!savedSession.recovery);
  const game = useMemo(() => gameAt(study), [study]);
  const fen = game.fen();
  const history = useMemo(() => game.history({ verbose: true }), [game]);
  const path = useMemo(() => nodePath(study), [study]);
  const [draft, setDraft] = useState<{
    position: Position;
    turn: Color;
    rights: string;
  } | null>(null);
  const [historyPly, setHistoryPly] = useState<number | null>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [tool, setTool] = useState<PieceTool>("move");
  const [promotion, setPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [revealBoard, setRevealBoard] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(savedSession.storageError);
  const playable = !draft;
  const reviewing = historyPly !== null && playable;
  const nodeId = reviewing ? (path[historyPly - 1]?.id ?? ROOT) : study.tipId;
  const analysisGame = useMemo(
    () => (reviewing ? gameAt(study, nodeId) : game),
    [study, nodeId, reviewing, game],
  );
  const analysisFen = analysisGame.fen();
  const analysisKey = `${study.id}:${nodeId}:${analysisFen}`;
  const terminal = useMemo(() => ending(game), [game]);
  const analysisTerminal = useMemo(() => ending(analysisGame), [analysisGame]);
  const lastMove = history.at(-1) ?? null;
  const reviewedMove = reviewing ? history[historyPly - 1] : null;
  const reviewLabel = reviewedMove
    ? gameMoveLabel(reviewedMove)
    : "Starting position";
  const positionIssue = useMemo(
    () =>
      draft ? arrangementIssue(draft.position, draft.turn, draft.rights) : null,
    [draft],
  );

  useEffect(() => {
    if (autosavePaused) return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(study));
      localStorage.setItem("tempo-position", fen);
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable or full. Your latest changes may not survive a reload.",
      );
    }
  }, [study, fen, autosavePaused]);

  function resumeAutosave() {
    if (!recovery) return;
    try {
      // Never overwrite the original until an exact recovery copy is stored.
      preserveRecovery(recovery);
      setAutosavePaused(false);
      setStorageError("");
    } catch {
      setStorageError(
        "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.",
      );
    }
  }

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function resetBoardControls() {
    setComputerMove(null);
    setHistoryPly(null);
    setSelected(null);
    setError("");
    setPromotion(null);
  }

  function openStudy(next: Study) {
    setStudy(next);
    setDraft(null);
    setTool("move");
    resetBoardControls();
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
    if (from === to || !choices.length) {
      setSelected(null);
      return;
    }
    if (choices.some((move) => move.promotion) && !promote) {
      setPromotion({ from, to });
      return;
    }
    const next = addStudyMove(study, nodeId, `${from}${to}${promote ?? ""}`);
    openStudy(next);
    if (byComputer)
      setComputerMove(
        choices.find((move) => move.lan === `${from}${to}${promote ?? ""}`) ??
          null,
      );
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

  function showHistory(ply: number) {
    setComputerMove(null);
    setHistoryPly(ply === history.length ? null : ply);
    setSelected(null);
    setPromotion(null);
    setError("");
  }

  return {
    study,
    game,
    fen,
    history,
    path,
    draft,
    playable,
    historyPly,
    selected,
    tool,
    promotion,
    computerMove,
    revealBoard,
    error,
    notice,
    storageError,
    recovery,
    autosavePaused,
    resumeAutosave,
    dismissRecovery: () => setRecovery(null),
    reviewing,
    analysisGame,
    analysisFen,
    analysisKey,
    terminal,
    analysisTerminal,
    lastMove,
    reviewedMove,
    reviewLabel,
    positionIssue,
    setSelected,
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
