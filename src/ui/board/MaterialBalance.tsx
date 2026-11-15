import { materialBalance } from "../../domain/chess/material.ts";
import { sideName, type Position } from "../../domain/chess/position.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { pieceImage, pieceLabel } from "./pieces.ts";
export function MaterialBalance({ position }: { position: Position }) {
  const { t } = useTranslation();
  const balance = materialBalance(position);
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
        const description = t("board.material.missing", sideName(color, t));
        return (
          <div
            key={color}
            className={`material-pieces is-${color}`}
            role="group"
            aria-label={description}
            title={description}
          >
            {balance.missing[color].map(({ type, count }) => (
              <span key={type} className="material-piece-stack">
                {Array.from({ length: count }, (_, index) => (
                  <img
                    key={index}
                    src={pieceImage({ color, type })}
                    alt={pieceLabel({ color, type }, t)}
                    draggable={false}
                  />
                ))}
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
