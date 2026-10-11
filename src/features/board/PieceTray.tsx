import { useTranslation } from "../../i18n/LanguageProvider";
import type { Color, PieceSymbol } from "chess.js";
import { pieceImage } from "./pieces";
import { names, sideName } from "../../chess/position";

export function PieceTray({
  color,
  selected,
  onSelect,
  onStartDrag,
}: {
  color: Color;
  selected?: string;
  onSelect: (type: PieceSymbol) => void;
  onStartDrag: () => void;
}) {
  const { t } = useTranslation();
  return (
    <section
      className="piece-tray"
      aria-label={t("{0} pieces", sideName(color, t))}
    >
      <div className="piece-tray-pieces">
        {(["k", "q", "r", "b", "n", "p"] as PieceSymbol[]).map((type) => (
          <button
            key={type}
            className={selected === `${color}${type}` ? "chosen" : ""}
            aria-label={t("Place {0} {1}", sideName(color, t), t(names[type]))}
            aria-pressed={selected === `${color}${type}`}
            title={t(
              "Add {0} {1} · Click or drag to board",
              sideName(color, t).toLowerCase(),
              t(names[type]),
            )}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData(
                "text/plain",
                `palette:${color}${type}`,
              );
              event.dataTransfer.effectAllowed = "copyMove";
              onStartDrag();
            }}
            onClick={() => onSelect(type)}
          >
            <img src={pieceImage({ color, type })} alt="" draggable={false} />
          </button>
        ))}
      </div>
    </section>
  );
}
