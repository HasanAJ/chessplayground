import { useTranslation } from "../../i18n/LanguageProvider";
import type { Color, PieceSymbol } from "chess.js";
import { pieceImage } from "./pieces";
import { pieceNameKeys, sideName } from "../../chess/position";

export function PieceTray({
  id,
  color,
  selected,
  onSelect,
  onStartDrag,
}: {
  id?: string;
  color: Color;
  selected?: string;
  onSelect: (type: PieceSymbol) => void;
  onStartDrag: () => void;
}) {
  const { t } = useTranslation();
  return (
    <section
      id={id}
      className="piece-tray"
      aria-label={t("board.tray.label", sideName(color, t))}
    >
      <div className="piece-tray-pieces">
        {(["k", "q", "r", "b", "n", "p"] as PieceSymbol[]).map((type) => (
          <button
            key={type}
            className={selected === `${color}${type}` ? "chosen" : ""}
            aria-label={t("board.tray.place", sideName(color, t), t(pieceNameKeys[type]))}
            aria-pressed={selected === `${color}${type}`}
            title={t(
              "board.tray.add",
              sideName(color, t).toLowerCase(),
              t(pieceNameKeys[type]),
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
