import { useTranslation } from "../../i18n/LanguageProvider";
import type { Square } from "chess.js";
import type { GameController } from "../game/useGameController";
import type { Recommendations } from "../coach/useRecommendations";
import type { CoachPresentation } from "../coach/useCoachPresentation";
import type { BoardController } from "./useBoardInteractions";
import type { BoardPreview } from "./useBoardPreview";
import { pieceImage, pieceLabel } from "./pieces";
import { useHighlightedSquare } from "./SquareHighlight";

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
  const highlightedSquare = useHighlightedSquare();
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
    ? t("Calculate best moves to see the evaluation")
    : boardPreview
      ? t("Evaluation paused during board preview")
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
          title={evaluationNotice ?? t("+ = White ahead · − = Black ahead")}
          aria-label={
            evaluationNotice ??
            (best
              ? t("White evaluation {0}", best.score)
              : t("Evaluation pending"))
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
        <div className="board-grid">
          <div className="rank-labels" aria-hidden="true">
            {ranks.map((rank) => (
              <span key={rank}>{rank}</span>
            ))}
          </div>
          <div
            className={`chessboard ${boardPreview ? "previewing" : ""} ${freeDrag ? "free-placement" : ""}`}
            role="group"
            aria-label={
              inspection
                ? t("Move preview chessboard")
                : reviewing
                  ? t("Game history chessboard")
                  : t("Interactive chessboard")
            }
          >
            {ranks.flatMap((rank) =>
              files.map((file) => {
                const square = `${file}${rank}` as Square;
                const piece = position[square];
                const legal = legalSquares.has(square);
                const isSelected = !boardPreview && selected === square;
                const last =
                  game.playable &&
                  (boardLastMove?.from === square ||
                    boardLastMove?.to === square);
                const strategy =
                  explanationFocus?.squares.includes(square) ||
                  (showStrategy && insight?.squares.includes(square));
                const classes = [
                  "square",
                  (file.charCodeAt(0) + rank) % 2 === 0
                    ? "dark-square"
                    : "light-square",
                  isSelected && "selected-square",
                  freeDrag === square && "free-piece",
                  last && "last-square",
                  legal && piece && "capture-square",
                  square === checkedKing && "king-in-check",
                  strategy && "strategy-square",
                  square === highlightedSquare && "reference-square",
                  showWarning && watching.target === square && "warning-target",
                  showWarning &&
                    watching.attackers.includes(square) &&
                    "warning-attacker",
                ];
                return (
                  <button
                    key={square}
                    type="button"
                    className={classes.filter(Boolean).join(" ")}
                    aria-label={`${square}${piece ? ` ${pieceLabel(piece, t)}` : t(" empty")}${square === checkedKing ? t(" in check") : ""}`}
                    data-square={square}
                    aria-pressed={isSelected}
                    draggable={!!piece}
                    onClick={() => squareClick(square)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      if (piece) arrangePiece(square);
                    }}
                    onDragStart={(event) => board.startDrag(event, square)}
                    onDragEnd={board.endDrag}
                    onDragEnter={allowBoardDrop}
                    onDragOver={allowBoardDrop}
                    onDrop={(event) => dropPiece(event, square)}
                  >
                    {piece && (
                      <img
                        className="piece"
                        src={pieceImage(piece)}
                        alt=""
                        draggable={false}
                      />
                    )}
                    {legal && !piece && <span className="legal-dot" />}
                  </button>
                );
              }),
            )}
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
                  <line
                    key={index}
                    {...line}
                    markerEnd={`url(#${arrowhead})`}
                  />
                ))}
              </svg>
            )}
          </div>
          <div className="file-labels" aria-hidden="true">
            {files.map((file) => (
              <span key={file}>{file}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function moveArrow(from: Square, to: Square, files: string[], ranks: number[]) {
  const x1 = files.indexOf(from[0]) * 100 + 50,
    y1 = ranks.indexOf(Number(from[1])) * 100 + 50;
  const x2 = files.indexOf(to[0]) * 100 + 50,
    y2 = ranks.indexOf(Number(to[1])) * 100 + 50;
  const length = Math.hypot(x2 - x1, y2 - y1);
  return {
    x1,
    y1,
    x2: x2 - ((x2 - x1) / length) * 25,
    y2: y2 - ((y2 - y1) / length) * 25,
  };
}
