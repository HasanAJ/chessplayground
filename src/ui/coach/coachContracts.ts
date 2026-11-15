import type { GameController } from "../game/useGameController.ts";
import type { BoardPreview } from "../board/useBoardPreview.ts";
import type { ComputerSettings } from "../computer/useComputerSettings.ts";
import type { ComputerTurn } from "../computer/useComputerTurn.ts";
import type { Recommendations } from "./useRecommendations.ts";
import type { CoachPresentation } from "./useCoachPresentation.ts";
import type { ReviewState } from "../../application/review/moveReview.ts";

export type CoachGame = Pick<
  GameController,
  | "analysisGame"
  | "analysisKey"
  | "analysisTerminal"
  | "error"
  | "history"
  | "lastMove"
  | "notice"
  | "playMove"
  | "playable"
  | "positionIssue"
  | "promotion"
  | "reviewing"
  | "setError"
  | "setPromotion"
  | "terminal"
>;
export type CoachPanelProps = {
  game: CoachGame;
  preview: BoardPreview;
  computer: ComputerSettings;
  opponent: ComputerTurn;
  recommendations: Recommendations;
  presentation: CoachPresentation;
  feedback: ReviewState | null;
  feedbackPly: number;
  onPlayMove: GameController["playMove"];
  onReviewRetry: () => void;
  onCalculate: () => void;
  onNewGame: () => void;
  onShowHistory: (ply: number) => void;
};
