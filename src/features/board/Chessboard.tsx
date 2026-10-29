import { useTranslation } from "../../i18n/LanguageProvider";
import type { GameController } from "../game/useGameController";
import type { Recommendations } from "../coach/useRecommendations";
import type { CoachPresentation } from "../coach/useCoachPresentation";
import type { BoardController } from "./useBoardInteractions";
import type { BoardPreview } from "./useBoardPreview";
import { BoardGrid } from "./BoardGrid";
import { moveArrow } from "./arrows";
import type { PositionEvaluation } from "../../chess/evaluation";
import { EvaluationBar } from "./EvaluationBar";

type Props = {
  game: Pick<GameController, "playable" | "reviewing">;
  board: BoardController;
  preview: BoardPreview;
  analysis: Recommendations;
  reviewEvaluation?: PositionEvaluation;
  highlights: CoachPresentation;
};

export function Chessboard({
  game,
  board,
  preview,
  analysis,
  reviewEvaluation,
  highlights,
}: Props) {
  const { t } = useTranslation();
  const {
    flipped,
    selected,
    position,
    legalMoves,
    checkedKing,
    freeDrag,
    squareClick,
    arrangePiece,
    allowBoardDrop,
    dropPiece,
    lastMove: boardLastMove,
  } = board;
  const { boardPreview, inspection, inspectionMove } = preview;
  const { reviewing } = game;
  const { best } = analysis;
  const hiddenAnalysis = !analysis.requested;
  const { showWarning, watching, shownCandidate } = highlights;
  const files = (flipped ? "hgfedcba" : "abcdefgh").split("");
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const legalSquares = new Set(legalMoves.map((move) => move.to));
  const evaluation =
    !game.playable || boardPreview ? undefined : (best ?? reviewEvaluation);
  const arrowMove =
    inspectionMove ?? (hiddenAnalysis ? undefined : shownCandidate?.move);
  const arrow =
    arrowMove && (boardPreview || !selected) && !freeDrag && game.playable
      ? moveArrow(arrowMove.from, arrowMove.to, files, ranks)
      : null;
  const explanationFocus = inspection?.focus;
  const arrows = explanationFocus
    ? explanationFocus.arrows.map(({ from, to }) =>
        moveArrow(from, to, files, ranks),
      )
    : arrow
      ? [arrow]
      : [];
  const arrowhead = explanationFocus ? "explanation-arrowhead" : "arrowhead";
  return (
    <div id="board" className="board-position">
      <div className="board-with-eval" ref={board.ref}>
        <EvaluationBar
          evaluation={evaluation}
          paused={boardPreview}
          flipped={flipped}
        />
        <BoardGrid
          position={position}
          flipped={flipped}
          label={t(
            inspection
              ? "board.label.preview"
              : reviewing
                ? "board.label.history"
                : "board.label.interactive",
          )}
          className={`${boardPreview ? "previewing" : ""} ${freeDrag ? "free-placement" : ""}`}
          lastMove={game.playable ? (boardLastMove ?? undefined) : undefined}
          checkedKing={checkedKing ?? undefined}
          squareProps={(square) => {
            const piece = position[square];
            const legal = legalSquares.has(square);
            const isSelected = !boardPreview && selected === square;
            return {
              className: [
                isSelected && "selected-square",
                freeDrag === square && "free-piece",
                legal && piece && "capture-square",
                explanationFocus?.squares.includes(square) && "strategy-square",
                showWarning && watching.target === square && "warning-target",
                showWarning &&
                  watching.attackers.includes(square) &&
                  "warning-attacker",
              ]
                .filter(Boolean)
                .join(" "),
              "aria-pressed": isSelected,
              draggable: !!piece,
              onClick: () => squareClick(square),
              onContextMenu: (event) => {
                event.preventDefault();
                if (piece) arrangePiece(square);
              },
              onDragStart: (event) => board.startDrag(event, square),
              onDragEnd: board.endDrag,
              onDragEnter: allowBoardDrop,
              onDragOver: allowBoardDrop,
              onDrop: (event) => dropPiece(event, square),
              children: legal && !piece ? <span className="legal-dot" /> : null,
            };
          }}
        >
          {arrows.length > 0 && (
            <svg
              className={`move-arrow ${explanationFocus ? "explanation-arrows" : ""}`}
              viewBox="0 0 800 800"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id={arrowhead}
                  markerWidth="3.6"
                  markerHeight="3.6"
                  refX="2.4"
                  refY="1.8"
                  orient="auto"
                >
                  <path d="M0,0 L3.6,1.8 L0,3.6 Z" fill="currentColor" />
                </marker>
              </defs>
              {arrows.map((line, index) => (
                <line key={index} {...line} markerEnd={`url(#${arrowhead})`} />
              ))}
            </svg>
          )}
        </BoardGrid>
      </div>
    </div>
  );
}
