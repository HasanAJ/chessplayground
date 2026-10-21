import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { sideName } from "../../chess/position";
import { moveDescription } from "../../chess/moves";
import { SquareText } from "../board/SquareHighlight";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents";

export function Continuation({ candidate, preview, onInspect }: MovePreviewProps) {
  const { t } = useTranslation();
  return (
    <div className="continuation" aria-label={t("coach.continuation.label")}>
      <p className="exploration-note">{t("coach.exploration.note")}</p>
      <div className="continuation-moves">
        {candidate.continuation.map((move, index) => {
          const current =
            preview?.candidate === candidate && preview.ply === index + 1;
          const focus = index === 0 ? candidate.explanationFocus : undefined;
          const description = moveDescription(move, t);
          return (
            <button
              type="button"
              key={move.lan + index}
              className={current ? "current-step" : ""}
              aria-label={t(
                "coach.continuation.previewMove",
                index + 1,
                sideName(move.color, t),
                move.san,
              )}
              aria-pressed={current}
              {...movePreviewEvents(onInspect, candidate, index + 1, focus)}
              onClick={() => onInspect(candidate, index + 1, "click", focus)}
            >
              <span className="continuation-step-label">
                {index === 0
                  ? t("coach.best.heading")
                  : index === 1
                    ? t("coach.continuation.replyHeading")
                    : sideName(move.color, t)}
              </span>
              <span className="continuation-notation">
                <small>
                  {move.before.split(" ")[5]}
                  {move.color === "w" ? "." : "…"}
                </small>{" "}
                <SquareText text={move.san} focusable={false} />
              </span>
              <span className="continuation-description">
                <SquareText text={description} focusable={false} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MoveExploration({
  children,
  ...props
}: MovePreviewProps & { children: ReactNode }) {
  const { t } = useTranslation();
  const { candidate, onInspect } = props;
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => () => onInspect(candidate, 0), [candidate, onInspect]);
  return (
    <>
      <div className="plan-actions">
        {children}
        <button
          type="button"
          className="plan-preview"
          aria-expanded={open}
          aria-controls={id}
          {...movePreviewEvents(
            onInspect,
            candidate,
            open ? 0 : 1,
            candidate.explanationFocus,
          )}
          onClick={() => {
            setOpen(!open);
            if (open) onInspect(candidate, 0);
            else onInspect(candidate, 1, "click", candidate.explanationFocus);
          }}
        >
          <Eye size={14} />{" "}
          {t(open ? "coach.exploration.close" : "coach.exploration.open")}
        </button>
      </div>
      <div id={id} className="move-exploration" hidden={!open}>
        {open && <Continuation {...props} />}
      </div>
    </>
  );
}
