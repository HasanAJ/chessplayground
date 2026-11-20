import type { Move } from "chess.js";
import { materialBalance } from "../../domain/chess/material.ts";
import {
  opposite,
  sideName,
  type Position,
} from "../../domain/chess/position.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { pieceImage, pieceLabel } from "./pieces.ts";
export function MaterialBalance({
  position,
  history,
}: {
  position: Position;
  history?: readonly Move[];
}) {
  const { t } = useTranslation();
  const balance = materialBalance(position, history);
  if (
    balance.difference === 0 &&
    balance.missing.w.length + balance.missing.b.length === 0
  )
    return null;
  const leader = balance.difference > 0 ? "w" : "b";
  const advantage = t(
    "board.material.advantage",
    sideName(leader, t),
    Math.abs(balance.difference),
  );
  return (
    <section
      className="material-balance"
      aria-label={t("board.material.label")}
    >
      {(["b", "w"] as const).map((color) => {
        const capturedColor = opposite(color);
        const description = t(
          "board.material.missing",
          sideName(capturedColor, t),
        );
        return (
          <div
            key={color}
            className={`material-pieces is-${color}`}
            role="group"
            aria-label={description}
            title={description}
          >
            {balance.missing[capturedColor].map(({ type, count }) => (
              <span
                key={type}
                className="material-piece-stack"
                role="img"
                aria-label={`${pieceLabel({ color: capturedColor, type }, t)} × ${count}`}
              >
                {Array.from({ length: count }, (_, index) => (
                  <img
                    key={index}
                    src={pieceImage({ color: capturedColor, type })}
                    alt=""
                    draggable={false}
                  />
                ))}
                {count > 1 && (
                  <span className="material-piece-count" aria-hidden="true">
                    {count}
                  </span>
                )}
              </span>
            ))}
            {balance.difference !== 0 && color === leader && (
              <span
                className="material-advantage"
                title={advantage}
                aria-label={advantage}
              >
                +{Math.abs(balance.difference)}
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
