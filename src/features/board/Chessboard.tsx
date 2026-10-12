import { useTranslation } from "../../i18n/LanguageProvider";
import type { GameController } from "../game/useGameController";
import type { Recommendations } from "../coach/useRecommendations";
import type { CoachPresentation } from "../coach/useCoachPresentation";
import type { BoardController } from "./useBoardInteractions";
import type { BoardPreview } from "./useBoardPreview";
import { BoardGrid } from "./BoardGrid";
import { moveArrow } from "./arrows";

type Props = {
  game: GameController;
  board: BoardController;
  preview: BoardPreview;
  analysis: Recommendations;
  highlights: CoachPresentation;
};

export function Chessboard({
  game,
  board,
  preview,
  analysis,
  highlights,
}: Props) {
  const { t } = useTranslation();
  const {
    flipped,
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
  const { selected, reviewing } = game;
  const { best } = analysis;
  const hiddenAnalysis = !analysis.requested;
  const {
    focusStrategy,
    previewStrategy,
    insight,
    showWarning,
    watching,
    shownCandidate,
  } = highlights;
  const files = (flipped ? "hgfedcba" : "abcdefgh").split("");
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const legalSquares = new Set(legalMoves.map((move) => move.to));
  const evaluation = hiddenAnalysis || boardPreview ? undefined : best;
  const whitePercent = evaluation
    ? Math.max(4, Math.min(96, 50 + 46 * Math.tanh(evaluation.whiteScore / 4)))
    : 50;
  const evaluationNotice = hiddenAnalysis
    ? t("board.evaluation.calculateFirst")
    : boardPreview
      ? t("board.evaluation.previewPaused")
      : undefined;
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
  const showStrategy =
    (focusStrategy || previewStrategy) && !hiddenAnalysis && !boardPreview;
  return (
    <div id="board" className="board-position">
      <div className="board-with-eval" ref={board.ref}>
        <div
          className="eval-track"
          title={evaluationNotice ?? t("board.evaluation.legend")}
          aria-label={
            evaluationNotice ??
            (best
              ? t("board.evaluation.whiteScore", best.score)
              : t("board.evaluation.pending"))
          }
        >
          <div
            className="eval-white"
            style={{
              height: `${whitePercent}%`,
              ...(flipped ? { top: 0, bottom: "auto" } : {}),
            }}
          />
          <span className="eval-number">
            {evaluation
              ? evaluation.mate !== undefined
                ? evaluation.score
                : `${evaluation.whiteScore >= 0 ? "+" : "−"}${Math.abs(evaluation.whiteScore).toLocaleString(t.language, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
              : "—"}
          </span>
        </div>
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
            const strategy =
              explanationFocus?.squares.includes(square) ||
              (showStrategy && insight?.squares.includes(square));
            return {
              className: [
                isSelected && "selected-square",
                freeDrag === square && "free-piece",
                legal && piece && "capture-square",
                strategy && "strategy-square",
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
