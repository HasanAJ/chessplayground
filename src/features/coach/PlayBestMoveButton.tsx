import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider";
import { SquareText } from "../board/SquareHighlight";

export function PlayBestMoveButton({
  san,
  onPlay,
}: {
  san: string;
  onPlay: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      className="primary-button"
      aria-label={t("coach.best.play", san)}
      onClick={onPlay}
    >
      <SquareText text={t("coach.move.play", san)} focusable={false} />{" "}
      <ArrowRight size={14} />
    </button>
  );
}
