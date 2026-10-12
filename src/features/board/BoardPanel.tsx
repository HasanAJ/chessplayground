import { useTranslation } from "../../i18n/LanguageProvider";
import { useState } from "react";
import type { Color } from "chess.js";
import {
  ArrowDownUp,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Pencil,
  Plus,
} from "lucide-react";
import { setupFen } from "../../chess/position";
import { MoveHistory } from "../game/MoveHistory";
import { PositionLoader } from "../game/PositionLoader";
import type { GameController } from "../game/useGameController";
import type { ComputerSettings } from "../computer/useComputerOpponent";
import type { Recommendations } from "../coach/useRecommendations";
import type { CoachPresentation } from "../coach/useCoachPresentation";
import type { BoardPreview } from "./useBoardPreview";
import type { BoardController } from "./useBoardInteractions";
import { Chessboard } from "./Chessboard";
import { PieceTray } from "./PieceTray";
import { BoardPreviewControls } from "./BoardPreviewControls";
import { MobileCoachSummary } from "../coach/MobileCoachSummary";

type Props = {
  game: GameController;
  board: BoardController;
  preview: BoardPreview;
  computer: ComputerSettings;
  botTurn: boolean;
  analysis: Recommendations;
  highlights: CoachPresentation;
  onNewGame: () => void;
  onShowHistory: (ply: number) => void;
};

export function BoardPanel({
  game,
  board,
  preview,
  computer,
  botTurn,
  analysis,
  highlights,
  onNewGame: newGame,
  onShowHistory: showHistory,
}: Props) {
  const { t } = useTranslation();
  const [editorOpen, setEditorOpen] = useState(false);
  const { flipped, setFlipped, choosePiece } = board;
  const { history, historyPly, tool, setTool, replaceGame, setNotice } = game;
  const clearBoard = () => {
    preview.clearPreview();
    analysis.clear();
    game.setBoardPosition({}, board.turn, "");
    setTool("move");
  };
  const startPieceDrag = () => {
    computer.disable();
    setTool("move");
  };
  const best = analysis.thinking ? undefined : analysis.best;
  return (
    <section
      className={`board-panel ${editorOpen ? "is-editing" : ""}`}
      aria-label={t("board.controls.label")}
    >
      <div className="board-toolbar">
        <div className="toolbar-actions">
          <button
            className="new-game-button"
            title={t("board.newGame.description")}
            onClick={() => {
              setEditorOpen(false);
              newGame();
            }}
          >
            <Plus size={15} /> {t("board.newGame.label")}
          </button>
          <button
            className="icon-button desktop-editor-action"
            onClick={clearBoard}
            title={t("board.clear")}
            aria-label={t("board.clear")}
          >
            <Eraser size={16} />
          </button>
        </div>
        <div
          className={`turn-select ${board.turn === "b" ? "is-black" : ""}`}
        >
          <select
            aria-label={t("board.turn.select")}
            value={board.turn}
            disabled={preview.boardPreview || botTurn}
            onChange={(event) =>
              game.chooseNextPlayer(event.target.value as Color)
            }
            title={
              game.playable && history.length > 0
                ? t("board.turn.changeDescription")
                : undefined
            }
          >
            <option value="w">{t("board.turn.white")}</option>
            <option value="b">{t("board.turn.black")}</option>
          </select>
          <ChevronDown size={14} aria-hidden="true" />
        </div>
        <div className="board-navigation-actions">
          <div
            className="board-history-navigation"
            role="group"
            aria-label={t("board.navigation.label")}
          >
            <button
              className="icon-button"
              title={t("board.navigation.previous")}
              aria-label={t("board.navigation.previous")}
              disabled={!game.playable || (historyPly ?? history.length) === 0}
              onClick={() => showHistory((historyPly ?? history.length) - 1)}
            >
              <ChevronLeft size={19} />
            </button>
            <button
              className="icon-button"
              title={t("board.navigation.next")}
              aria-label={t("board.navigation.next")}
              disabled={!game.playable || historyPly === null}
              onClick={() => showHistory((historyPly ?? history.length) + 1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
          <button
            className="icon-button flip-board-button"
            onClick={() => setFlipped(!flipped)}
            title={t("board.flip")}
            aria-label={t("board.flip")}
          >
            <ArrowDownUp size={17} />
          </button>
        </div>
      </div>
      <div className="board-surface">
        <PieceTray
          id="board-top-tray"
          color={flipped ? "w" : "b"}
          selected={tool}
          onSelect={(type) => choosePiece(flipped ? "w" : "b", type)}
          onStartDrag={startPieceDrag}
        />

        <Chessboard
          game={game}
          board={board}
          preview={preview}
          analysis={analysis}
          highlights={highlights}
        />

        <PieceTray
          id="board-bottom-tray"
          color={flipped ? "b" : "w"}
          selected={tool}
          onSelect={(type) => choosePiece(flipped ? "b" : "w", type)}
          onStartDrag={startPieceDrag}
        />
      </div>

      <BoardPreviewControls preview={preview} />
      {best && !preview.pinnedInspection && (
        <MobileCoachSummary
          candidate={best}
          onPlay={() =>
            board.playSuggestedMove(
              best.move.from,
              best.move.to,
              best.move.promotion,
            )
          }
          onPreviewReply={() => preview.inspectMove(best, 2, "click")}
        />
      )}
      <div className="board-secondary-actions">
        <button
          className="position-editor-toggle"
          aria-expanded={editorOpen}
          aria-controls="board-top-tray board-bottom-tray position-editor"
          onClick={() => {
            setEditorOpen(!editorOpen);
            setTool("move");
          }}
        >
          <Pencil size={14} />
          {t(editorOpen ? "board.editor.close" : "board.editor.open")}
        </button>
        <a className="mobile-coach-link" href="#coach">
          {t("board.openCoach")}
          <ArrowRight size={15} />
        </a>
      </div>
      <div className="board-tools">
        {game.playable && (
          <MoveHistory
            history={history}
            selectedPly={historyPly}
            onSelect={showHistory}
          />
        )}
        <div className="position-editor" id="position-editor">
          <button className="mobile-editor-clear" onClick={clearBoard}>
            <Eraser size={15} /> {t("board.clear")}
          </button>
          <PositionLoader
            fen={
              game.draft
                ? setupFen(
                    game.draft.position,
                    game.draft.turn,
                    game.draft.rights,
                  )
                : game.analysisFen
            }
            onLoad={(next) => {
              replaceGame(next);
              setEditorOpen(false);
              setNotice("Position loaded");
            }}
            onCopied={() => setNotice("Position copied")}
          />
        </div>
      </div>
    </section>
  );
}
