import { useEffect, useState } from "react";
import type { Color } from "chess.js";
import {
  ArrowDownUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Dices,
  Eraser,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { opposite, setupFen } from "../../domain/chess/position.ts";
import type { PositionEvaluation } from "../../domain/chess/evaluation.ts";
import type { GameController } from "../game/useGameController.ts";
import type { ComputerSettings } from "../computer/useComputerSettings.ts";
import type { Recommendations } from "../coach/useRecommendations.ts";
import type { CoachPresentation } from "../coach/useCoachPresentation.ts";
import { MoveHistory } from "../game/MoveHistory.tsx";
import { PositionLoader } from "../game/PositionLoader.tsx";
import { BoardPreviewControls } from "./BoardPreviewControls.tsx";
import { MaterialBalance } from "./MaterialBalance.tsx";
import { PieceTray } from "./PieceTray.tsx";
import { Chessboard } from "./Chessboard.tsx";
import {
  useBoardInteractions,
  type BoardController,
} from "./useBoardInteractions.ts";
import type { BoardPreview } from "./useBoardPreview.ts";

type BoardGame = Pick<
  GameController,
  | "analysisFen"
  | "analysisGame"
  | "analysisKey"
  | "analysisTerminal"
  | "arrangePiece"
  | "chooseNextPlayer"
  | "computerMove"
  | "draft"
  | "history"
  | "historyPly"
  | "lastMove"
  | "playMove"
  | "playable"
  | "replaceGame"
  | "revealBoard"
  | "reviewedMove"
  | "reviewing"
  | "setBoardPosition"
  | "setError"
  | "setTool"
  | "tool"
>;
type Props = {
  game: BoardGame;
  preview: BoardPreview;
  computer: ComputerSettings;
  botTurn: boolean;
  selectionReset: number;
  onDraggingChange: (dragging: boolean) => void;
  analysis: Recommendations;
  reviewEvaluation?: PositionEvaluation;
  highlights: CoachPresentation;
  onNewGame: () => void;
  onRandomPosition: () => void;
  onShowHistory: (ply: number) => void;
};
function Toolbar({
  game,
  board,
  preview,
  botTurn,
  clear,
  reset,
  randomize,
  navigate,
}: Pick<Props, "game" | "preview" | "botTurn"> & {
  board: BoardController;
  clear: () => void;
  reset: () => void;
  randomize: () => void;
  navigate: (ply: number) => void;
}) {
  const { t } = useTranslation();
  const ply = game.historyPly ?? game.history.length;
  const history = [
    {
      direction: -1,
      label: t("board.navigation.previous"),
      disabled: !game.playable || ply === 0,
      Icon: ChevronLeft,
    },
    {
      direction: 1,
      label: t("board.navigation.next"),
      disabled: !game.playable || game.historyPly === null,
      Icon: ChevronRight,
    },
  ];
  const flip = t("board.flip");
  const turnLabel = t(
    board.turn === "w" ? "board.turn.white" : "board.turn.black",
  );
  return (
    <div className="board-toolbar">
      <div className="toolbar-actions">
        <button
          className="new-game-button"
          aria-label={t("board.newGame.label")}
          title={t("board.newGame.description")}
          onClick={reset}
        >
          <Plus size={15} /> <span>{t("board.newGame.label")}</span>
        </button>
        <button
          type="button"
          className="icon-button random-position-button"
          onClick={randomize}
          title={t("board.random.label")}
          aria-label={t("board.random.label")}
        >
          <Dices size={17} />
        </button>
        <button
          className="icon-button desktop-editor-action"
          onClick={clear}
          title={t("board.clear")}
          aria-label={t("board.clear")}
        >
          <Eraser size={16} />
        </button>
      </div>
      <button
        type="button"
        className={`turn-switch ${board.turn === "b" ? "is-black" : ""}`}
        aria-label={`${turnLabel}. ${t("board.turn.switch")}`}
        disabled={preview.boardPreview || botTurn}
        title={
          game.playable && game.history.length
            ? t("board.turn.changeDescription")
            : t("board.turn.switch")
        }
        onClick={() => game.chooseNextPlayer(opposite(board.turn))}
      >
        <span>{turnLabel}</span>
        <RefreshCw size={15} aria-hidden="true" />
      </button>
      <div className="board-navigation-actions">
        <div
          className="board-history-navigation"
          role="group"
          aria-label={t("board.navigation.label")}
        >
          {history.map(({ direction, label, disabled, Icon }) => (
            <button
              key={direction}
              className="icon-button"
              title={label}
              aria-label={label}
              disabled={disabled}
              onClick={() => navigate(ply + direction)}
            >
              <Icon size={19} />
            </button>
          ))}
        </div>
        <button
          className="icon-button flip-board-button"
          onClick={() => board.setFlipped(!board.flipped)}
          title={flip}
          aria-label={flip}
        >
          <ArrowDownUp size={17} />
        </button>
      </div>
    </div>
  );
}
export function BoardPanel(props: Props) {
  const { t } = useTranslation();
  const { game, preview, computer, analysis } = props;
  const board = useBoardInteractions(
    game,
    preview,
    computer,
    props.botTurn,
    props.selectionReset,
  );
  const [editor, setEditor] = useState(false);
  useEffect(() => {
    props.onDraggingChange(board.freeDrag !== null);
  }, [props.onDraggingChange, board.freeDrag]);
  const clear = () => {
    preview.clearPreview();
    analysis.clear();
    game.setBoardPosition({}, board.turn, "");
    game.setTool("move");
  };
  const reset = () => {
    setEditor(false);
    props.onNewGame();
  };
  const top: Color = board.flipped ? "w" : "b",
    bottom: Color = board.flipped ? "b" : "w";
  const tray = (color: Color, id: string) => (
    <PieceTray
      id={id}
      color={color}
      selected={game.tool}
      onSelect={(type) => board.choosePiece(color, type)}
      onStartDrag={() => {
        computer.disable();
        game.setTool("move");
      }}
    />
  );
  const fen = game.draft
    ? setupFen(game.draft.position, game.draft.turn, game.draft.rights)
    : game.analysisFen;
  const inspection = preview.inspection;
  const materialHistory = inspection
    ? [
        ...game.history.slice(
          0,
          game.history.findIndex(
            (move) => move.after === inspection.candidate.move.before,
          ) + 1,
        ),
        ...inspection.candidate.continuation.slice(0, inspection.ply),
      ]
    : game.history.slice(0, game.historyPly ?? game.history.length);
  return (
    <section
      className={`board-panel ${editor ? "is-editing" : ""}`}
      aria-label={t("board.controls.label")}
    >
      <Toolbar
        game={game}
        board={board}
        preview={preview}
        botTurn={props.botTurn}
        clear={clear}
        reset={reset}
        randomize={() => {
          setEditor(false);
          props.onRandomPosition();
        }}
        navigate={props.onShowHistory}
      />
      <div className="board-surface">
        {tray(top, "board-top-tray")}
        <Chessboard
          game={game}
          board={board}
          preview={preview}
          analysis={analysis}
          reviewEvaluation={props.reviewEvaluation}
          highlights={props.highlights}
        />
        {tray(bottom, "board-bottom-tray")}
        <MaterialBalance
          position={board.position}
          history={game.draft ? undefined : materialHistory}
        />
      </div>
      <BoardPreviewControls preview={preview} />
      <div className="board-secondary-actions">
        <button
          className="position-editor-toggle"
          aria-expanded={editor}
          aria-controls="board-top-tray board-bottom-tray position-editor"
          onClick={() => {
            setEditor(!editor);
            game.setTool("move");
          }}
        >
          <Pencil size={14} />
          {t(editor ? "board.editor.close" : "board.editor.open")}
        </button>
        <a className="mobile-coach-link" href="#coach">
          {t("board.openCoach")}
          <ArrowRight size={15} />
        </a>
      </div>
      <div className="board-tools">
        {game.playable && (
          <MoveHistory
            history={game.history}
            selectedPly={game.historyPly}
            onSelect={props.onShowHistory}
          />
        )}
        <div className="position-editor" id="position-editor">
          <button className="mobile-editor-clear" onClick={clear}>
            <Eraser size={15} /> {t("board.clear")}
          </button>
          <PositionLoader
            fen={fen}
            onLoad={(position) => {
              game.replaceGame(position);
              setEditor(false);
            }}
          />
        </div>
      </div>
    </section>
  );
}
