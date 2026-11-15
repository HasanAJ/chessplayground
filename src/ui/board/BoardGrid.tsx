import {
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { Square } from "chess.js";
import type { Position } from "../../domain/chess/position.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { pieceImage, pieceLabel } from "./pieces.ts";
import { useHighlightedSquare } from "./SquareHighlight.tsx";

type Props = {
  position: Position;
  flipped: boolean;
  label: string;
  className?: string;
  lastMove?: { from: Square; to: Square };
  checkedKing?: Square;
  focusSquares?: readonly Square[];
  squareProps?: (square: Square) => ButtonHTMLAttributes<HTMLButtonElement>;
  children?: ReactNode;
};

export function BoardGrid({
  position,
  flipped,
  label,
  className = "",
  lastMove,
  checkedKing,
  focusSquares,
  squareProps,
  children,
}: Props) {
  const { t } = useTranslation();
  const highlighted = useHighlightedSquare();
  const [tabSquare, setTabSquare] = useState<Square>("a8");
  const files = Array.from(flipped ? "hgfedcba" : "abcdefgh");
  const ranks = Array.from({ length: 8 }, (_, index) =>
    flipped ? index + 1 : 8 - index,
  );
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (!squareProps) return;
    const target = event.target as HTMLElement;
    const square = target.closest<HTMLElement>("[data-square]")?.dataset.square;
    if (!square) return;
    let file = files.indexOf(square[0]),
      rank = ranks.indexOf(Number(square[1]));
    switch (event.key) {
      case "ArrowLeft":
        file--;
        break;
      case "ArrowRight":
        file++;
        break;
      case "ArrowUp":
        rank--;
        break;
      case "ArrowDown":
        rank++;
        break;
      case "Home":
        file = 0;
        break;
      case "End":
        file = 7;
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const next =
      `${files[Math.max(0, Math.min(7, file))]}${ranks[Math.max(0, Math.min(7, rank))]}` as Square;
    setTabSquare(next);
    event.currentTarget
      .querySelector<HTMLElement>(`[data-square="${next}"]`)
      ?.focus();
  }
  return (
    <div className="board-grid">
      <div className="rank-labels" aria-hidden="true">
        {ranks.map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>
      <div
        className={`chessboard ${className}`}
        role="group"
        aria-label={label}
        onKeyDown={navigate}
      >
        {ranks.flatMap((rank) =>
          files.map((file) => {
            const square = `${file}${rank}` as Square;
            const piece = position[square];
            const props = squareProps?.(square);
            const classes = [
              "square",
              (file.charCodeAt(0) + rank) % 2 === 0
                ? "dark-square"
                : "light-square",
              [lastMove?.from, lastMove?.to].includes(square) && "last-square",
              square === checkedKing && "king-in-check",
              focusSquares?.includes(square) && "strategy-square",
              highlighted === square && "reference-square",
              props?.className,
            ]
              .filter(Boolean)
              .join(" ");
            const name =
              square +
              (piece ? ` ${pieceLabel(piece, t)}` : t("board.square.empty")) +
              (square === checkedKing ? t("board.square.check") : "");
            const content = (
              <>
                {piece && (
                  <img
                    className="piece"
                    src={pieceImage(piece)}
                    alt=""
                    draggable={false}
                  />
                )}
                {props?.children}
              </>
            );
            return props ? (
              <button
                key={square}
                type="button"
                aria-label={name}
                data-square={square}
                {...props}
                className={classes}
                tabIndex={tabSquare === square ? 0 : -1}
                onFocus={(event) => {
                  setTabSquare(square);
                  props.onFocus?.(event);
                }}
              >
                {content}
              </button>
            ) : (
              <span
                key={square}
                className={classes}
                role="img"
                aria-label={name}
                data-square={square}
              >
                {content}
              </span>
            );
          }),
        )}
        {children}
      </div>
      <div className="file-labels" aria-hidden="true">
        {files.map((file) => (
          <span key={file}>{file}</span>
        ))}
      </div>
    </div>
  );
}
