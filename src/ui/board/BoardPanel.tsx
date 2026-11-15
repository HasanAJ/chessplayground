import { useEffect, useState } from "react";
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
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { notice } from "../../i18n/notices.ts";
import { setupFen } from "../../domain/chess/position.ts";
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
  | "setNotice"
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
  onShowHistory: (ply: number) => void;
};
function Toolbar({
  game,
  board,
  preview,
  botTurn,
  clear,
  reset,
  navigate,
}: Pick<Props, "game" | "preview" | "botTurn"> & {
  board: BoardController;
  clear: () => void;
  reset: () => void;
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
          className="icon-button desktop-editor-action"
          onClick={clear}
          title={t("board.clear")}
          aria-label={t("board.clear")}
        >
          <Eraser size={16} />
        </button>
      </div>
      <div className={`turn-select ${board.turn === "b" ? "is-black" : ""}`}>
        <select
          aria-label={t("board.turn.select")}
          value={board.turn}
          disabled={preview.boardPreview || botTurn}
          title={
            game.playable && game.history.length
              ? t("board.turn.changeDescription")
              : undefined
          }
          onChange={(event) =>
            game.chooseNextPlayer(event.currentTarget.value as Color)
          }
        >
          {(["w", "b"] as const).map((side) => (
            <option key={side} value={side}>
              {t(side === "w" ? "board.turn.white" : "board.turn.black")}
            </option>
          ))}
        </select>
        <ChevronDown size={14} aria-hidden="true" />
      </div>
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
        <MaterialBalance position={board.position} />
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
              game.setNotice(notice("position.notice.loaded"));
            }}
            onCopied={() => game.setNotice(notice("position.notice.copied"))}
          />
        </div>
      </div>
    </section>
  );
}
