import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { SquareText } from "../board/SquareHighlight.tsx";
export function PlayBestMoveButton({
  san,
  onPlay,
}: {
  san: string;
  onPlay: () => void;
}) {
  const { t } = useTranslation();
  const label = t("coach.best.play", san),
    text = t("coach.move.play", san);
  return (
    <button className="primary-button" aria-label={label} onClick={onPlay}>
      <SquareText text={text} focusable={false} /> <ArrowRight size={14} />
    </button>
  );
}
