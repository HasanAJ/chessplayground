import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import type { Color, PieceSymbol, Square } from "chess.js";
import { ending, positionOf, type Position } from "../../chess/position";
import type { GameController } from "../game/useGameController";
import type { ComputerSettings } from "../computer/useComputerOpponent";
import type { BoardPreview } from "./useBoardPreview";
import { useComputerMoveAnimation } from "./useComputerMoveAnimation";

export function useBoardInteractions(
  game: GameController,
  preview: BoardPreview,
  computer: ComputerSettings,
  botTurn: boolean,
) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [freeDrag, setFreeDrag] = useState<Square | null>(null);
  const [flipped, setFlipped] = useState(false);
  const displayedGame = game.playable
    ? (preview.previewGame ?? game.analysisGame)
    : null;
  const position = useMemo(
    () => game.draft?.position ?? positionOf(displayedGame!),
    [game.draft, displayedGame],
  );
  const turn = game.draft?.turn ?? displayedGame!.turn();
  const rights =
    game.draft?.rights ?? displayedGame!.fen().split(" ")[2].replace("-", "");
  const terminal = useMemo(
    () => (displayedGame ? ending(displayedGame) : null),
    [displayedGame],
  );
  const checkedKing = displayedGame?.isCheck()
    ? (Object.entries(position).find(
        ([, piece]) => piece?.type === "k" && piece.color === turn,
      )?.[0] as Square | undefined)
    : undefined;
  const legalMoves = useMemo(
    () =>
      game.playable && !preview.boardPreview && !botTurn && game.selected
        ? game.analysisGame.moves({ square: game.selected, verbose: true })
        : [],
    [
      game.playable,
      preview.boardPreview,
      botTurn,
      game.selected,
      game.analysisGame,
    ],
  );
  const lastMove =
    preview.inspectionMove ??
    (game.reviewing ? game.reviewedMove : game.lastMove);
  useComputerMoveAnimation(
    ref,
    game.computerMove,
    preview.boardPreview,
    flipped,
  );
  useEffect(() => {
    setFreeDrag(null);
  }, [game.analysisKey, game.playable, preview.boardPreview, botTurn]);

  function arrangePiece(
    square: Square,
    piece?: Position[Square],
    from?: Square,
  ) {
    setFreeDrag(null);
    game.setSelected(null);
    if (from && (!piece || from === square)) return;
    preview.clearPreview();
    game.arrangePiece(position, turn, rights, square, piece, from);
  }

  function placeFreely(from: Square, to?: Square) {
    setFreeDrag(null);
    game.setSelected(null);
    if (from === to || !position[from]) return;
    arrangePiece(
      to ?? from,
      to ? position[from] : undefined,
      to ? from : undefined,
    );
  }

  // The document listener must use the displayed position, including hover previews.
  const removePiece = useRef(placeFreely);
  useLayoutEffect(() => {
    removePiece.current = placeFreely;
  });
  useEffect(() => {
    const allowDrop = (event: globalThis.DragEvent) => {
      if (!dragging.current) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    };
    const removeOutside = (event: globalThis.DragEvent) => {
      if (
        !dragging.current ||
        !(event.target instanceof Node) ||
        ref.current?.querySelector(".chessboard")?.contains(event.target)
      )
        return;
      const source = event.dataTransfer?.getData("text/plain") ?? "";
      if (!/^[a-h][1-8]$/.test(source)) return;
      event.preventDefault();
      removePiece.current(source as Square);
    };
    document.addEventListener("dragenter", allowDrop);
    document.addEventListener("dragover", allowDrop);
    document.addEventListener("drop", removeOutside);
    return () => {
      document.removeEventListener("dragenter", allowDrop);
      document.removeEventListener("dragover", allowDrop);
      document.removeEventListener("drop", removeOutside);
    };
  }, []);

  function playMove(from: Square, to: Square, promote?: PieceSymbol) {
    if (!preview.boardPreview && !botTurn) game.playMove(from, to, promote);
  }

  function playSuggestedMove(from: Square, to: Square, promote?: PieceSymbol) {
    if (botTurn) return;
    preview.clearPreview();
    game.playMove(from, to, promote);
  }

  function squareClick(square: Square) {
    if (dragging.current) return;
    if (game.tool !== "move") {
      arrangePiece(square, {
        color: game.tool[0] as Color,
        type: game.tool[1] as PieceSymbol,
      });
      return;
    }
    if (
      preview.boardPreview ||
      botTurn ||
      !game.playable ||
      game.analysisTerminal
    )
      return;
    game.setError("");
    if (game.selected === square) game.setSelected(null);
    else if (position[square]?.color === game.analysisGame.turn())
      game.setSelected(square);
    else if (game.selected) playMove(game.selected, square);
  }

  function allowBoardDrop(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect =
      event.dataTransfer.effectAllowed === "copyMove" ? "copy" : "move";
  }

  function dropPiece(event: DragEvent, square: Square) {
    event.preventDefault();
    const source = event.dataTransfer.getData("text/plain");
    if (/^palette:[wb][kqrbnp]$/.test(source)) {
      const piece = source.slice(8);
      arrangePiece(square, {
        color: piece[0] as Color,
        type: piece[1] as PieceSymbol,
      });
    } else if (/^[a-h][1-8]$/.test(source)) {
      const from = source as Square;
      setFreeDrag(null);
      if (
        game.playable &&
        !preview.boardPreview &&
        !botTurn &&
        !game.analysisTerminal &&
        game.analysisGame
          .moves({ square: from, verbose: true })
          .some((move) => move.to === square)
      )
        playMove(from, square);
      else placeFreely(from, square);
    }
  }

  function startDrag(event: DragEvent, square: Square) {
    dragging.current = true;
    event.dataTransfer.setData("text/plain", square);
    event.dataTransfer.effectAllowed = "move";
    game.setTool("move");
    game.setSelected(null);
    setFreeDrag(square);
  }

  function endDrag() {
    setFreeDrag(null);
    window.setTimeout(() => {
      dragging.current = false;
    }, 0);
  }

  function choosePiece(color: Color, type: PieceSymbol) {
    computer.disable();
    game.setTool(game.tool === `${color}${type}` ? "move" : `${color}${type}`);
    game.setSelected(null);
    game.setError("");
  }

  function scrollToBoard({ alignToTop = false } = {}) {
    if (!ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const controlsHeight = window.matchMedia("(max-width: 900px)").matches
      ? (document
          .querySelector(".calculation-controls")
          ?.getBoundingClientRect().height ?? 0)
      : 0;
    if (
      !alignToTop &&
      bounds.top >= 0 &&
      bounds.bottom <= window.innerHeight - controlsHeight
    )
      return;
    ref.current.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  useEffect(() => {
    if (game.revealBoard && window.matchMedia("(max-width: 900px)").matches)
      scrollToBoard();
  }, [game.revealBoard]);

  useEffect(() => {
    if (preview.pinnedInspection && window.matchMedia("(max-width: 900px)").matches)
      scrollToBoard();
  }, [preview.pinnedInspection]);

  return {
    ref,
    position,
    turn,
    terminal,
    checkedKing,
    legalMoves,
    lastMove,
    freeDrag,
    flipped,
    setFlipped,
    arrangePiece,
    playMove,
    playSuggestedMove,
    squareClick,
    allowBoardDrop,
    dropPiece,
    startDrag,
    endDrag,
    choosePiece,
    scrollToBoard,
  };
}

export type BoardController = ReturnType<typeof useBoardInteractions>;
