import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import type { Color, PieceSymbol, Square } from "chess.js";
import { positionOf, type Position } from "../../domain/chess/position.ts";
import type { GameController } from "../game/useGameController.ts";
import type { ComputerSettings } from "../computer/useComputerSettings.ts";
import type { BoardPreview } from "./useBoardPreview.ts";
import { useComputerMoveAnimation } from "./useComputerMoveAnimation.ts";
import { usePreviewMoveAnimation } from "./usePreviewMoveAnimation.ts";
import { scrollToBoard } from "./scrollToBoard.ts";

type Game = Pick<
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
>;
const isSquare = (value: string): value is Square => /^[a-h][1-8]$/.test(value);

export function useBoardInteractions(
  game: Game,
  preview: BoardPreview,
  computer: ComputerSettings,
  botTurn: boolean,
  selectionReset: number,
) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [selected, setSelected] = useState<Square | null>(null);
  const [freeDrag, setFreeDrag] = useState<Square | null>(null);
  const [flipped, setFlipped] = useState(false);
  const shown = game.playable
    ? (preview.previewGame ?? game.analysisGame)
    : null;
  const position = useMemo(
    () => game.draft?.position ?? positionOf(shown!),
    [game.draft, shown],
  );
  const turn = game.draft?.turn ?? shown!.turn();
  const rights =
    game.draft?.rights ?? shown!.fen().split(" ")[2].replace("-", "");
  const interactive =
    game.playable &&
    !preview.boardPreview &&
    !botTurn &&
    !game.analysisTerminal;
  const legalMoves = useMemo(
    () =>
      interactive && selected
        ? game.analysisGame.moves({ square: selected, verbose: true })
        : [],
    [interactive, selected, game.analysisGame],
  );
  const checkedKing = shown?.isCheck()
    ? (Object.entries(position).find(
        ([, piece]) => piece?.type === "k" && piece.color === turn,
      )?.[0] as Square | undefined)
    : undefined;
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
  useEffect(() => () => clearTimeout(dragTimer.current), []);

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
  function freePlacement(from: Square, to?: Square) {
    setFreeDrag(null);
    setSelected(null);
    if (!position[from] || from === to) return;
    arrangePiece(
      to ?? from,
      to ? position[from] : undefined,
      to ? from : undefined,
    );
  }
  const removeOutside = useRef(freePlacement);
  useLayoutEffect(() => {
    removeOutside.current = freePlacement;
  });
  useEffect(() => {
    const allow = (event: globalThis.DragEvent) => {
      if (!dragging.current) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    };
    const drop = (event: globalThis.DragEvent) => {
      if (
        !dragging.current ||
        !(event.target instanceof Node) ||
        ref.current?.querySelector(".chessboard")?.contains(event.target)
      )
        return;
      const source = event.dataTransfer?.getData("text/plain") ?? "";
      if (isSquare(source)) {
        event.preventDefault();
        removeOutside.current(source);
      }
    };
    document.addEventListener("dragenter", allow);
    document.addEventListener("dragover", allow);
    document.addEventListener("drop", drop);
    return () => {
      document.removeEventListener("dragenter", allow);
      document.removeEventListener("dragover", allow);
      document.removeEventListener("drop", drop);
    };
  }, []);
  function play(from: Square, to: Square) {
    if (!interactive) return;
    setSelected(null);
    game.playMove(from, to);
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
    if (!interactive) return;
    game.setError(null);
    if (selected === square) setSelected(null);
    else if (position[square]?.color === turn) setSelected(square);
    else if (selected) play(selected, square);
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
      arrangePiece(square, {
        color: source[8] as Color,
        type: source[9] as PieceSymbol,
      });
    } else if (isSquare(source)) {
      setFreeDrag(null);
      if (
        interactive &&
        game.analysisGame
          .moves({ square: source, verbose: true })
          .some((move) => move.to === square)
      )
        play(source, square);
      else freePlacement(source, square);
    }
  }
  function startDrag(event: DragEvent, square: Square) {
    clearTimeout(dragTimer.current);
    dragging.current = true;
    event.dataTransfer.setData("text/plain", square);
    event.dataTransfer.effectAllowed = "move";
    game.setTool("move");
    setSelected(null);
    setFreeDrag(square);
  }
  function endDrag() {
    setFreeDrag(null);
    dragTimer.current = setTimeout(() => {
      dragging.current = false;
    }, 0);
  }
  function choosePiece(color: Color, type: PieceSymbol) {
    computer.disable();
    game.setTool(game.tool === `${color}${type}` ? "move" : `${color}${type}`);
    game.setError(null);
    setSelected(null);
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
