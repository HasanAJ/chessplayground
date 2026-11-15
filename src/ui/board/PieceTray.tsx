import type { Color, PieceSymbol } from "chess.js";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { pieceNameKeys, sideName } from "../../domain/chess/position.ts";
import { pieceImage } from "./pieces.ts";
const palette: PieceSymbol[] = ["k", "q", "r", "b", "n", "p"];
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
  const side = sideName(color, t);
  return (
    <section
      id={id}
      className="piece-tray"
      aria-label={t("board.tray.label", side)}
    >
      <div className="piece-tray-pieces">
        {palette.map((type) => {
          const name = t(pieceNameKeys[type]),
            active = selected === color + type;
          return (
            <button
              key={type}
              className={active ? "chosen" : ""}
              aria-pressed={active}
              aria-label={t("board.tray.place", side, name)}
              title={t("board.tray.add", side.toLowerCase(), name)}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "copyMove";
                event.dataTransfer.setData(
                  "text/plain",
                  `palette:${color}${type}`,
                );
                onStartDrag();
              }}
              onClick={() => onSelect(type)}
            >
              <img src={pieceImage({ color, type })} alt="" draggable={false} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
