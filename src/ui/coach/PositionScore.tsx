import {
  formatEvaluation,
  type PositionEvaluation,
} from "../../domain/chess/evaluation.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
export function PositionScore({
  evaluation,
}: {
  evaluation: PositionEvaluation;
}) {
  const locale = useTranslation();
  const value = formatEvaluation(evaluation, locale.language);
  const description = `${locale.t("coach.position.evaluation")}: ${value}`;
  return (
    <span
      className="score-pill"
      aria-label={description}
      title={locale.t("board.evaluation.legend")}
    >
      {value}
    </span>
  );
}
