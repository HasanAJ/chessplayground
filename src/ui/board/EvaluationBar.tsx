import {
  formatEvaluation,
  type PositionEvaluation,
} from "../../domain/chess/evaluation.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
export function EvaluationBar({
  evaluation,
  paused,
  flipped,
}: {
  evaluation?: PositionEvaluation;
  paused: boolean;
  flipped: boolean;
}) {
  const { t } = useTranslation();
  const message = paused
    ? t("board.evaluation.previewPaused")
    : evaluation
      ? null
      : t("board.evaluation.pending");
  const ratio = evaluation ? Math.tanh(evaluation.whiteScore / 4) : 0;
  const height = Math.min(96, Math.max(4, 50 + 46 * ratio));
  const label =
    message ??
    t("board.evaluation.whiteScore", formatEvaluation(evaluation!, t.language));
  return (
    <div
      className="eval-track"
      title={message ?? t("board.evaluation.legend")}
      aria-label={label}
    >
      <div
        className="eval-white"
        style={
          flipped
            ? { height: `${height}%`, top: 0, bottom: "auto" }
            : { height: `${height}%` }
        }
      />
      <span className="eval-number">
        {evaluation ? formatEvaluation(evaluation, t.language, 1) : "—"}
      </span>
    </div>
  );
}
