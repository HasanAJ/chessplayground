import type { Move } from "chess.js";
import { gameMoveLabel } from "../../chess/position";
import { SquareText } from "../board/SquareHighlight";

export function MoveHistory({
  history,
  selectedPly,
  onSelect,
}: {
  history: Move[];
  selectedPly: number | null;
  onSelect: (ply: number) => void;
}) {
  if (!history.length) return null;
  const currentPly = selectedPly ?? history.length;

  return (
    <>
      <div className="history-heading">
        <span>Game moves</span>
      </div>
      <div className="move-history" aria-label="Move history">
        <button
          className={`history-start ${currentPly === 0 ? "current-history" : ""}`}
          aria-label="View starting position"
          aria-current={currentPly === 0 ? "step" : undefined}
          onClick={() => onSelect(0)}
        >
          Start
        </button>
        {history.map((move, index) => {
          const current = currentPly === index + 1;
          return (
            <button
              key={index}
              className={`${index === history.length - 1 ? "latest" : ""} ${current ? "current-history" : ""}`}
              aria-label={`View position after ${gameMoveLabel(move)}`}
              aria-current={current ? "step" : undefined}
              onClick={() => onSelect(index + 1)}
            >
              {(move.color === "w" || index === 0) && (
                <small>
                  {move.before.split(" ")[5]}
                  {move.color === "b" ? "…" : "."}
                </small>
              )}
              <SquareText text={move.san} focusable={false} />
            </button>
          );
        })}
      </div>
    </>
  );
}
