import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Square } from "chess.js";
import type { Position } from "../../chess/position";
import { useTranslation } from "../../i18n/LanguageProvider";
import { pieceImage, pieceLabel } from "./pieces";
import { useHighlightedSquare } from "./SquareHighlight";

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

/** Shared board artwork; squares become controls only in the playing workspace. */
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
  const highlightedSquare = useHighlightedSquare();
  const files = (flipped ? "hgfedcba" : "abcdefgh").split("");
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
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
              (lastMove?.from === square || lastMove?.to === square) &&
                "last-square",
              square === checkedKing && "king-in-check",
              focusSquares?.includes(square) && "strategy-square",
              square === highlightedSquare && "reference-square",
              props?.className,
            ]
              .filter(Boolean)
              .join(" ");
            const squareLabel = `${square}${piece ? ` ${pieceLabel(piece, t)}` : t("board.square.empty")}${square === checkedKing ? t("board.square.check") : ""}`;
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
                aria-label={squareLabel}
                data-square={square}
                {...props}
                className={classes}
              >
                {content}
              </button>
            ) : (
              <span
                key={square}
                className={classes}
                role="img"
                aria-label={squareLabel}
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
