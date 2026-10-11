import { useTranslation } from "../../i18n/LanguageProvider";
import {
  ArrowDownUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eraser,
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

type Props = {
  game: GameController;
  board: BoardController;
  preview: BoardPreview;
  computer: ComputerSettings;
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
  analysis,
  highlights,
  onNewGame: newGame,
  onShowHistory: showHistory,
}: Props) {
  const { t } = useTranslation();
  const { flipped, setFlipped, choosePiece } = board;
  const { history, historyPly, tool, setTool, replaceGame, setNotice } = game;
  const clearBoard = () => {
    preview.clearPreview();
    analysis.clear();
    game.setBoardPosition({}, board.turn, "");
    setTool("move");
  };
  return (
    <section
      className="board-panel"
      aria-label={t("board.controls.label")}
    >
      <div className="board-toolbar">
        <div className="toolbar-actions">
          <button
            className="new-game-button"
            title={t("board.newGame.description")}
            onClick={newGame}
          >
            <Plus size={15} /> {t("board.newGame.label")}
          </button>
          <button
            className="icon-button"
            onClick={clearBoard}
            title={t("board.clear")}
            aria-label={t("board.clear")}
          >
            <Eraser size={16} />
          </button>
        </div>
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
      <div className="board-surface">
        <PieceTray
          color={flipped ? "w" : "b"}
          selected={tool}
          onSelect={(type) => choosePiece(flipped ? "w" : "b", type)}
          onStartDrag={() => {
            computer.disable();
            setTool("move");
          }}
        />

        <Chessboard
          game={game}
          board={board}
          preview={preview}
          analysis={analysis}
          highlights={highlights}
        />

        <PieceTray
          color={flipped ? "b" : "w"}
          selected={tool}
          onSelect={(type) => choosePiece(flipped ? "b" : "w", type)}
          onStartDrag={() => {
            computer.disable();
            setTool("move");
          }}
        />
      </div>

      <a className="mobile-coach-link" href="#coach">
        {t("board.openCoach")}
        <ArrowRight size={15} />
      </a>
      <div className="board-tools">
        {game.playable && (
          <MoveHistory
            history={history}
            selectedPly={historyPly}
            onSelect={showHistory}
          />
        )}
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
            setNotice("Position loaded");
          }}
          onCopied={() => setNotice("Position copied")}
        />
      </div>
    </section>
  );
}
