import { formatEvaluation, type PositionEvaluation } from "../../chess/evaluation";
import { useTranslation } from "../../i18n/LanguageProvider";

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
  const whitePercent = evaluation
    ? Math.max(4, Math.min(96, 50 + 46 * Math.tanh(evaluation.whiteScore / 4)))
    : 50;
  const notice = paused
    ? t("board.evaluation.previewPaused")
    : !evaluation
      ? t("board.evaluation.pending")
      : undefined;

  return (
    <div
      className="eval-track"
      title={notice ?? t("board.evaluation.legend")}
      aria-label={
        notice ??
        (evaluation
          ? t("board.evaluation.whiteScore", formatEvaluation(evaluation, t.language))
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
        {evaluation ? formatEvaluation(evaluation, t.language, 1) : "—"}
      </span>
    </div>
  );
}
