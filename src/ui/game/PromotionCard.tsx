import { X } from "lucide-react";
import type { Color, PieceSymbol } from "chess.js";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { pieceNameKeys } from "../../domain/chess/position.ts";
import { pieceImage } from "../board/pieces.ts";
const promotions = ["q", "r", "b", "n"] as const;
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
  const options = promotions.map((type) => ({
    type,
    name: t(pieceNameKeys[type]),
    image: pieceImage({ color, type }),
  }));
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
        {options.map(({ type, name, image }) => (
          <button
            key={type}
            aria-label={t("game.promotion.choose", name)}
            onClick={() => onChoose(type)}
          >
            <img src={image} alt="" />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
