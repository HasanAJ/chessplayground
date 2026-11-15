import { materialBalance } from "../../chess/material";
import { sideName, type Position } from "../../chess/position";
import { useTranslation } from "../../i18n/LanguageProvider";
import { pieceImage, pieceLabel } from "./pieces";

export function MaterialBalance({ position }: { position: Position }) {
  const { t } = useTranslation();
  const { missing, difference } = materialBalance(position);
  if (!missing.b.length && !missing.w.length && difference === 0) return null;
  const leader = difference > 0 ? "w" : "b";
  const advantage = t(
    "board.material.advantage",
    sideName(leader, t),
    Math.abs(difference),
  );

  return (
    <section className="material-balance" aria-label={t("board.material.label")}>
      {(["b", "w"] as const).map((color) => (
        <div
          key={color}
          className={`material-pieces is-${color}`}
          role="group"
          aria-label={t("board.material.missing", sideName(color, t))}
          title={t("board.material.missing", sideName(color, t))}
        >
          {missing[color].map(({ type, count }) => (
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
          {difference !== 0 && color === leader && (
            <span className="material-advantage" title={advantage} aria-label={advantage}>
              +{Math.abs(difference)}
            </span>
          )}
        </div>
      ))}
    </section>
  );
}
