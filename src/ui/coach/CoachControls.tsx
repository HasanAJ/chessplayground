import {
  Check,
  Clock3,
  LoaderCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { translateNotice } from "../../i18n/notices.ts";
import { CoachOptions } from "../computer/CoachOptions.tsx";
import { AnalysisSettings } from "./AnalysisSettings.tsx";
import { SquareText } from "../board/SquareHighlight.tsx";
import type { CoachPanelProps } from "./coachContracts.ts";
import type { CoachView } from "./coachView.ts";

type Inputs = Pick<
  CoachPanelProps,
  "game" | "preview" | "computer" | "opponent" | "recommendations"
>;
type HeaderProps = Inputs & {
  view: CoachView;
  analysisOpen: boolean;
  onAnalysisOpen: (open: boolean) => void;
  onCalculate: () => void;
};
export function CoachHeader({
  game,
  preview,
  computer,
  opponent,
  recommendations,
  view,
  analysisOpen,
  onAnalysisOpen,
  onCalculate,
}: HeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="coach-header">
      <div className="coach-heading">
        <div>
          <h2>{t("coach.panel.heading")}</h2>
          <span
            className={`turn-status ${view.check ? "is-check" : ""}`}
            role="status"
          >
            {view.turn}
          </span>
        </div>
      </div>
      <div className="coach-header-actions coach-toolbar">
        <CoachOptions
          enabled={computer.enabled}
          open={computer.open}
          side={computer.side}
          difficulty={computer.difficulty}
          startDisabled={
            !game.playable ||
            !!game.terminal ||
            game.reviewing ||
            preview.boardPreview
          }
          failed={computer.enabled && opponent.state === "error"}
          status={view.computerStatus}
          onSideChange={computer.setSide}
          onDifficultyChange={computer.setDifficulty}
          onOpenChange={(open) => {
            if (open) onAnalysisOpen(false);
            computer.setOpen(open);
          }}
          onEnabledChange={(enabled) => {
            computer.setEnabled(enabled);
            game.setError(null);
          }}
          onRetry={opponent.retry}
        />
        <AnalysisSettings
          settings={recommendations.settings}
          onChange={recommendations.updateSettings}
          disabled={recommendations.thinking}
          open={analysisOpen}
          onOpenChange={(open) => {
            if (open) computer.setOpen(false);
            onAnalysisOpen(open);
          }}
        />
        {view.showRefresh && (
          <button
            type="button"
            className="icon-button refresh-analysis calculate-button"
            aria-label={view.refreshLabel}
            title={view.refreshLabel}
            disabled={view.calculateDisabled}
            onClick={onCalculate}
          >
            {recommendations.thinking ? (
              <LoaderCircle size={16} className="spin" aria-hidden="true" />
            ) : (
              <RotateCcw size={16} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
export function CalculationControl({
  view,
  thinking,
  busy,
  onCalculate,
}: {
  view: CoachView;
  thinking: boolean;
  busy: boolean;
  onCalculate: () => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      {view.showWelcome && (
        <div className="coach-welcome">
          <div className="coach-welcome-icon" aria-hidden="true">
            <img src="/favicon.svg" alt="" draggable={false} />
          </div>
          <h3>{t("coach.welcome.heading")}</h3>
          <p>{t("coach.welcome.description")}</p>
        </div>
      )}
      {!view.showRefresh && (
        <div className="calculation-controls">
          <button
            className="primary-button calculate-button"
            disabled={view.calculateDisabled}
            aria-label={view.calculateLabel}
            aria-describedby={
              view.calculateReason ? "calculation-reason" : undefined
            }
            onClick={onCalculate}
          >
            {thinking || busy ? (
              <LoaderCircle size={20} className="spin" />
            ) : (
              <Sparkles size={20} />
            )}
            <span aria-hidden="true">{view.calculateText}</span>
          </button>
          {view.calculateReason && (
            <p className="calculation-reason" id="calculation-reason">
              <SquareText text={view.calculateReason} />
            </p>
          )}
        </div>
      )}
    </>
  );
}
export function CoachNotices({ game }: Pick<Inputs, "game">) {
  const { t } = useTranslation();
  return (
    <>
      {game.notice && (
        <div className="panel-notice" role="status">
          <Check size={15} />
          <span>
            <SquareText text={translateNotice(game.notice, t)} />
          </span>
        </div>
      )}
      {game.error && (
        <div className="error-message" role="alert">
          <ShieldAlert size={16} />
          <span>
            <SquareText text={translateNotice(game.error, t)} />
          </span>
          <button
            aria-label={t("common.dismissError")}
            onClick={() => game.setError(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
export function CoachStatusStrip({
  game,
  preview,
  opponent,
  view,
}: Pick<Inputs, "game" | "preview" | "opponent"> & { view: CoachView }) {
  const { t } = useTranslation();
  if (!game.playable || (!view.showComputerStatus && !preview.pinned))
    return null;
  const waiting = opponent.state === "waiting";
  return (
    <div
      className={`coach-status ${view.showComputerStatus ? "coach-status-thinking" : ""}`}
      role={view.showComputerStatus ? "status" : undefined}
    >
      {view.showComputerStatus && (
        <>
          {waiting ? (
            <Clock3 size={14} />
          ) : (
            <LoaderCircle size={14} className="spin" />
          )}
          <span>
            <SquareText
              text={t(
                waiting
                  ? "computer.status.movingSoon"
                  : "computer.status.choosingReply",
              )}
            />
          </span>
        </>
      )}
      {preview.pinned && (
        <button
          className="text-action coach-preview-exit"
          onClick={preview.clearPreview}
        >
          {t("coach.panel.returnToGame")}
        </button>
      )}
    </div>
  );
}
