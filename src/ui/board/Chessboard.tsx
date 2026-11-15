import type { ButtonHTMLAttributes } from "react";
import type { Move, Square } from "chess.js";
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
  preview: BoardPreview;
  analysis: Recommendations;
  reviewEvaluation?: PositionEvaluation;
  highlights: CoachPresentation;
};
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
  const appearance = decorations(props, useHighlightedMove());
  const legal = new Set(board.legalMoves.map((move) => move.to));
  const squareProps = (
    square: Square,
  ): ButtonHTMLAttributes<HTMLButtonElement> => {
    const piece = board.position[square],
      selected = !preview.boardPreview && board.selected === square;
    const classes = [
      selected && "selected-square",
      board.freeDrag === square && "free-piece",
      legal.has(square) && piece && "capture-square",
      appearance.focus?.squares.includes(square) && "strategy-square",
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
      onContextMenu: (event) => {
        event.preventDefault();
        if (piece) board.arrangePiece(square);
      },
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
  return (
    <div id="board" className="board-position">
      <div className="board-with-eval" ref={board.ref}>
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
          squareProps={squareProps}
        >
          <ArrowOverlay
            lines={appearance.lines}
            className={`move-arrow ${appearance.explaining ? "explanation-arrows" : ""}${appearance.reference ? " reference-move-arrow" : ""}`}
            markerId={
              appearance.explaining ? "explanation-arrowhead" : "arrowhead"
            }
          />
        </BoardGrid>
      </div>
    </div>
  );
}
