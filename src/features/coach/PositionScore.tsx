import { formatEvaluation, type PositionEvaluation } from "../../chess/evaluation";
import { useTranslation } from "../../i18n/LanguageProvider";

export function PositionScore({ evaluation }: { evaluation: PositionEvaluation }) {
  const { t } = useTranslation();
  const score = formatEvaluation(evaluation, t.language);
  return (
    <span
      className="score-pill"
      aria-label={`${t("coach.position.evaluation")}: ${score}`}
      title={t("board.evaluation.legend")}
    >
      {score}
    </span>
  );
}
