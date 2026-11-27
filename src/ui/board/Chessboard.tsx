import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type DragEvent,
} from "react";
import type { Move, Square } from "chess.js";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import type { PositionEvaluation } from "../../domain/chess/evaluation.ts";
import type { GameController } from "../game/useGameController.ts";
import type { Recommendations } from "../coach/useRecommendations.ts";
import type { CoachPresentation } from "../coach/useCoachPresentation.ts";
import type { BoardController } from "./useBoardInteractions.ts";
import type { BoardPreview } from "./useBoardPreview.ts";
import { BoardGrid } from "./BoardGrid.tsx";
import { EvaluationBar } from "./EvaluationBar.tsx";
import { ArrowOverlay } from "./ArrowOverlay.tsx";
import { moveArrow } from "./arrows.ts";
import { useHighlightedMove } from "./SquareHighlight.tsx";
type Props = {
  game: Pick<GameController, "playable" | "reviewing" | "analysisGame">;
  board: BoardController;
  botTurn: boolean;
  preview: BoardPreview;
  analysis: Recommendations;
  reviewEvaluation?: PositionEvaluation;
  highlights: CoachPresentation;
  readingBoardImage: boolean;
  onScreenshotDrop: (image: File) => void;
};

function allowFileDrop(event: DragEvent<HTMLDivElement>) {
  if (!event.dataTransfer.types.includes("Files")) return false;
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
  return true;
}

function decorations(
  { game, board, preview, analysis, highlights }: Props,
  reference: Move | null,
) {
  const files = Array.from(board.flipped ? "hgfedcba" : "abcdefgh"),
    ranks = Array.from({ length: 8 }, (_, i) =>
      board.flipped ? i + 1 : 8 - i,
    );
  const arrow = ({ from, to }: Pick<Move, "from" | "to">) =>
    moveArrow(from, to, files, ranks);
  const validReference =
    reference &&
    game.playable &&
    !board.freeDrag &&
    reference.before === (preview.previewGame ?? game.analysisGame).fen();
  const focus = preview.inspection?.focus;
  const suggestion =
    preview.inspectionMove ??
    (analysis.requested ? highlights.shownCandidate?.move : undefined);
  const showSuggestion =
    suggestion &&
    (preview.boardPreview || !board.selected) &&
    !board.freeDrag &&
    game.playable;
  return {
    focus,
    reference: !!validReference,
    explaining: !!validReference || !!focus,
    lines: validReference
      ? [arrow(reference)]
      : focus
        ? focus.arrows.map(arrow)
        : showSuggestion
          ? [arrow(suggestion)]
          : [],
  };
}
export function Chessboard(props: Props) {
  const { t } = useTranslation();
  const { board, preview, game, highlights } = props;
  const fileDragDepth = useRef(0);
  const [fileOverBoard, setFileOverBoard] = useState(false);
  const appearance = decorations(props, useHighlightedMove());
  const legal = new Set(board.legalMoves.map((move) => move.to));
  const hintSquares =
    !preview.boardPreview && !board.freeDrag && !props.botTurn
      ? highlights.hintSquares
      : undefined;
  const squareProps = (
    square: Square,
  ): ButtonHTMLAttributes<HTMLButtonElement> => {
    const piece = board.position[square],
      selected = !preview.boardPreview && board.selected === square;
    const classes = [
      selected && "selected-square",
      board.freeDrag === square && "free-piece",
      legal.has(square) && piece && "capture-square",
      highlights.showWarning &&
        highlights.watching.target === square &&
        "warning-target",
      highlights.showWarning &&
        highlights.watching.attackers.includes(square) &&
        "warning-attacker",
    ];
    return {
      className: classes.filter(Boolean).join(" "),
      "aria-pressed": selected,
      draggable: !!piece,
      onClick: () => board.squareClick(square),
      onDragStart: (event) => board.startDrag(event, square),
      onDragEnd: board.endDrag,
      onDragEnter: board.allowBoardDrop,
      onDragOver: board.allowBoardDrop,
      onDrop: (event) => board.dropPiece(event, square),
      children:
        legal.has(square) && !piece ? <span className="legal-dot" /> : null,
    };
  };
  const label = t(
    preview.inspection
      ? "board.label.preview"
      : game.reviewing
        ? "board.label.history"
        : "board.label.interactive",
  );
  const evaluation =
    game.playable && !preview.boardPreview
      ? (props.analysis.best ?? props.reviewEvaluation)
      : undefined;

  function enterFileDrag(event: DragEvent<HTMLDivElement>) {
    if (!allowFileDrop(event)) return;
    if (fileDragDepth.current === 0) setFileOverBoard(true);
    fileDragDepth.current += 1;
  }
  function leaveFileDrag() {
    if (fileDragDepth.current === 0) return;
    fileDragDepth.current -= 1;
    if (fileDragDepth.current === 0) setFileOverBoard(false);
  }
  function dropFile(event: DragEvent<HTMLDivElement>) {
    if (!allowFileDrop(event)) return;
    fileDragDepth.current = 0;
    setFileOverBoard(false);
    const files = Array.from(event.dataTransfer.files);
    const image =
      files.find((file) => file.type.startsWith("image/")) ?? files[0];
    if (image) props.onScreenshotDrop(image);
  }

  return (
    <div id="board" className="board-position">
      <div
        className="board-with-eval"
        ref={board.ref}
        onDragEnterCapture={enterFileDrag}
        onDragLeaveCapture={leaveFileDrag}
        onDragOverCapture={allowFileDrop}
        onDropCapture={dropFile}
      >
        <EvaluationBar
          evaluation={evaluation}
          paused={preview.boardPreview}
          flipped={board.flipped}
        />
        <BoardGrid
          position={board.position}
          flipped={board.flipped}
          label={label}
          className={`${preview.boardPreview ? "previewing" : ""} ${board.freeDrag ? "free-placement" : ""}`}
          lastMove={game.playable ? (board.lastMove ?? undefined) : undefined}
          checkedKing={board.checkedKing}
          focusSquares={appearance.focus?.squares ?? hintSquares}
          squareProps={squareProps}
          onRemovePiece={board.arrangePiece}
        >
          <ArrowOverlay
            lines={appearance.lines}
            className={`move-arrow ${appearance.explaining ? "explanation-arrows" : ""}${appearance.reference ? " reference-move-arrow" : ""}`}
            markerId={
              appearance.explaining ? "explanation-arrowhead" : "arrowhead"
            }
          />
          {(fileOverBoard || props.readingBoardImage) && (
            <div className="screenshot-drop-overlay" role="status">
              <span>
                {fileOverBoard ? (
                  <ImagePlus size={27} aria-hidden="true" />
                ) : (
                  <LoaderCircle className="spin" size={27} aria-hidden="true" />
                )}
                {t(
                  fileOverBoard
                    ? "position.screenshot.drop"
                    : "position.recognition.reading",
                )}
              </span>
            </div>
          )}
        </BoardGrid>
      </div>
    </div>
  );
}
