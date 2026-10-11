import { useTranslation } from "../../i18n/LanguageProvider";
import type { Color, PieceSymbol } from "chess.js";
import { X } from "lucide-react";
import { names } from "../../chess/position";
import { pieceImage } from "../board/pieces";

export function PromotionCard({
  color,
  onChoose,
  onClose,
}: {
  color: Color;
  onChoose: (type: PieceSymbol) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <section
      className="panel-dialog promotion-card"
      role="region"
      aria-label={t("Choose a promotion piece")}
    >
      <button
        className="panel-close icon-button"
        aria-label={t("Cancel promotion")}
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <h2>{t("Your pawn made it.")}</h2>
      <p>{t("Choose its next chapter.")}</p>
      <div className="promotion-choices">
        {(["q", "r", "b", "n"] as PieceSymbol[]).map((type) => (
          <button
            key={type}
            aria-label={t("Promote to {0}", t(names[type]))}
            onClick={() => onChoose(type)}
          >
            <img src={pieceImage({ color: color, type })} alt="" />
            <span>{t(names[type])}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
