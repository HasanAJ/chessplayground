import { memo } from "react";
import type { Move } from "chess.js";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { gameMoveLabel } from "../../domain/chess/position.ts";
import { SquareText } from "../board/SquareHighlight.tsx";

type Props = {
  history: Move[];
  selectedPly: number | null;
  onSelect: (ply: number) => void;
};
export const MoveHistory = memo(function MoveHistory({
  history,
  selectedPly,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  if (history.length === 0) return null;
  const selected = selectedPly ?? history.length;
  const entries = [
    { ply: 0, move: null },
    ...history.map((move, index) => ({ ply: index + 1, move })),
  ];
  return (
    <>
      <div className="history-heading">
        <span>{t("game.history.label")}</span>
      </div>
      <div className="move-history" aria-label={t("game.history.heading")}>
        {entries.map(({ move, ply }) => {
          const current = selected === ply;
          const classes = move
            ? `${ply === history.length ? "latest" : ""} ${current ? "current-history" : ""}`
            : `history-start ${current ? "current-history" : ""}`;
          const number =
            move && (move.color === "w" || ply === 1)
              ? move.before.split(" ")[5] + (move.color === "b" ? "…" : ".")
              : null;
          return (
            <button
              key={ply}
              className={classes}
              aria-label={
                move
                  ? t("game.history.viewMove", gameMoveLabel(move))
                  : t("game.history.viewStart")
              }
              aria-current={current ? "step" : undefined}
              onClick={() => onSelect(ply)}
            >
              {number && <small>{number}</small>}
              {move ? (
                <SquareText text={move.san} focusable={false} />
              ) : (
                t("game.history.start")
              )}
            </button>
          );
        })}
      </div>
    </>
  );
});
