import { useTranslation } from "../../i18n/LanguageProvider";
import type { Color, PieceSymbol } from "chess.js";
import { X } from "lucide-react";
import { pieceNameKeys } from "../../chess/position";
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
      aria-label={t("game.promotion.label")}
    >
      <button
        className="panel-close icon-button"
        aria-label={t("game.promotion.cancel")}
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <h2>{t("game.promotion.heading")}</h2>
      <p>{t("game.promotion.description")}</p>
      <div className="promotion-choices">
        {(["q", "r", "b", "n"] as PieceSymbol[]).map((type) => (
          <button
            key={type}
            aria-label={t("game.promotion.choose", t(pieceNameKeys[type]))}
            onClick={() => onChoose(type)}
          >
            <img src={pieceImage({ color: color, type })} alt="" />
            <span>{t(pieceNameKeys[type])}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
