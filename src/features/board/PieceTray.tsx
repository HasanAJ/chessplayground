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
  return (
    <section className="piece-tray" aria-label={`${sideName(color)} pieces`}>
      <div className="piece-tray-pieces">
        {(["k", "q", "r", "b", "n", "p"] as PieceSymbol[]).map((type) => (
          <button
            key={type}
            className={selected === `${color}${type}` ? "chosen" : ""}
            aria-label={`Place ${sideName(color)} ${names[type]}`}
            aria-pressed={selected === `${color}${type}`}
            title={`Add ${sideName(color).toLowerCase()} ${names[type]} · Click or drag to board`}
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
