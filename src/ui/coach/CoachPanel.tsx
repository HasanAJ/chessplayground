import { useReducer } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { moveDescription } from "../../domain/chess/moves.ts";
import { CaptureWalkthroughControls } from "../board/CaptureWalkthroughControls.tsx";
import { PromotionCard } from "../game/PromotionCard.tsx";
import { MoveFeedback } from "./MoveFeedback.tsx";
import { RecommendationsPanel } from "./RecommendationsPanel.tsx";
import {
  CoachHeader,
  CalculationControl,
  CoachNotices,
  CoachStatusStrip,
} from "./CoachControls.tsx";
import { coachView } from "./coachView.ts";
import type { CoachPanelProps } from "./coachContracts.ts";

type Disclosure = {
  analysisOpen: boolean;
  hiddenReview: string | null;
  collapsedReview: string | null;
};
export function CoachPanel(props: CoachPanelProps) {
  const { t } = useTranslation();
  const { game, computer, preview, opponent, recommendations, feedback } =
    props;
  const [disclosure, update] = useReducer(
    (state: Disclosure, patch: Partial<Disclosure>) => ({ ...state, ...patch }),
    { analysisOpen: false, hiddenReview: null, collapsedReview: null },
  );
  const view = coachView(props, t);
  const calculate = () => {
    update({ analysisOpen: false, hiddenReview: feedback?.key ?? null });
    props.onCalculate();
  };
  const move = view.feedbackMove;
  const promotion = game.promotion;
  const context = game.reviewing
    ? "coach.feedback.context.selectedMove"
    : computer.enabled && move?.color === computer.side
      ? "coach.feedback.context.yourLastMove"
      : "coach.feedback.context.lastMove";
  return (
    <aside
      className={`coach-panel${view.showWelcome ? " is-welcoming" : ""}`}
      id="coach"
      aria-label={t("coach.panel.label")}
    >
      <CoachHeader
        {...props}
        view={view}
        analysisOpen={disclosure.analysisOpen}
        onAnalysisOpen={(analysisOpen) => update({ analysisOpen })}
        onCalculate={calculate}
      />
      {game.playable &&
        feedback &&
        move &&
        feedback.key !== disclosure.hiddenReview && (
          <MoveFeedback
            key={feedback.key}
            result={feedback}
            move={move}
            moveLabel={moveDescription(move, t)}
            context={context}
            onReanalyze={props.onReviewRetry}
            onInspect={preview.inspectMove}
            onClearInspection={preview.clearInspection}
            preview={preview.inspection}
            collapsed={disclosure.collapsedReview === feedback.key}
            onToggle={() =>
              update({
                collapsedReview:
                  disclosure.collapsedReview === feedback.key
                    ? null
                    : feedback.key,
              })
            }
          />
        )}
      {preview.pinnedInspection?.walkthrough && (
        <div className="desktop-capture-walkthrough">
          <CaptureWalkthroughControls preview={preview} />
        </div>
      )}
      <CalculationControl
        view={view}
        thinking={recommendations.thinking}
        busy={opponent.busy}
        onCalculate={calculate}
      />
      <CoachNotices game={game} />
      {promotion && (
        <PromotionCard
          color={game.analysisGame.turn()}
          onClose={() => game.setPromotion(null)}
          onChoose={(type) => {
            if (!preview.boardPreview && !opponent.turn)
              game.playMove(promotion.from, promotion.to, type);
          }}
        />
      )}
      {game.reviewing && (
        <button
          className="history-latest"
          onClick={() => props.onShowHistory(game.history.length)}
        >
          {t("game.history.backToLatest")}
          <ArrowRight size={14} />
        </button>
      )}
      <RecommendationsPanel
        game={game}
        onPlayMove={props.onPlayMove}
        preview={preview}
        computer={computer}
        botTurn={opponent.turn}
        recommendations={recommendations}
        presentation={props.presentation}
        onNewGame={props.onNewGame}
      />
      <CoachStatusStrip
        game={game}
        preview={preview}
        opponent={opponent}
        view={view}
      />
    </aside>
  );
}
