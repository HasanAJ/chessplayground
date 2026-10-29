import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import type { Color, PieceSymbol, Square } from "chess.js";
import { positionOf, type Position } from "../../chess/position";
import type { GameController } from "../game/useGameController";
import type { ComputerSettings } from "../computer/useComputerSettings";
import type { BoardPreview } from "./useBoardPreview";
import { useComputerMoveAnimation } from "./useComputerMoveAnimation";
import { usePreviewMoveAnimation } from "./usePreviewMoveAnimation";
import { scrollToBoard } from "./scrollToBoard";

export function useBoardInteractions(
  game: Pick<
    GameController,
    | "analysisGame"
    | "analysisKey"
    | "analysisTerminal"
    | "arrangePiece"
    | "computerMove"
    | "draft"
    | "lastMove"
    | "playMove"
    | "playable"
    | "revealBoard"
    | "reviewedMove"
    | "reviewing"
    | "setError"
    | "setTool"
    | "tool"
  >,
  preview: BoardPreview,
  computer: ComputerSettings,
  botTurn: boolean,
  selectionReset: number,
) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [selected, setSelected] = useState<Square | null>(null);
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
  const checkedKing = displayedGame?.isCheck()
    ? (Object.entries(position).find(
        ([, piece]) => piece?.type === "k" && piece.color === turn,
      )?.[0] as Square | undefined)
    : undefined;
  const legalMoves = useMemo(
    () =>
      game.playable && !preview.boardPreview && !botTurn && selected
        ? game.analysisGame.moves({ square: selected, verbose: true })
        : [],
    [game.playable, preview.boardPreview, botTurn, selected, game.analysisGame],
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
  usePreviewMoveAnimation(ref, preview.inspection, flipped);
  useEffect(() => {
    setFreeDrag(null);
  }, [game.analysisKey, game.playable, preview.boardPreview, botTurn]);
  useEffect(() => {
    setSelected(null);
  }, [
    game.analysisKey,
    game.draft,
    game.tool,
    preview.boardPreview,
    botTurn,
    selectionReset,
  ]);

  function arrangePiece(
    square: Square,
    piece?: Position[Square],
    from?: Square,
  ) {
    setFreeDrag(null);
    setSelected(null);
    if (from && (!piece || from === square)) return;
    preview.clearPreview();
    game.arrangePiece(position, turn, rights, square, piece, from);
  }

  function placeFreely(from: Square, to?: Square) {
    setFreeDrag(null);
    setSelected(null);
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
    if (preview.boardPreview || botTurn) return;
    setSelected(null);
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
    game.setError(null);
    if (selected === square) setSelected(null);
    else if (position[square]?.color === game.analysisGame.turn())
      setSelected(square);
    else if (selected) playMove(selected, square);
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
    setSelected(null);
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
    setSelected(null);
    game.setError(null);
  }

  useEffect(() => {
    if (game.revealBoard && window.matchMedia("(max-width: 900px)").matches)
      scrollToBoard(ref.current);
  }, [game.revealBoard]);

  useEffect(() => {
    if (
      preview.pinnedInspection &&
      window.matchMedia("(max-width: 900px)").matches
    )
      scrollToBoard(ref.current);
  }, [preview.pinnedInspection]);

  return {
    ref,
    position,
    turn,
    checkedKing,
    legalMoves,
    lastMove,
    freeDrag,
    selected,
    flipped,
    setFlipped,
    arrangePiece,
    squareClick,
    allowBoardDrop,
    dropPiece,
    startDrag,
    endDrag,
    choosePiece,
  };
}

export type BoardController = ReturnType<typeof useBoardInteractions>;
