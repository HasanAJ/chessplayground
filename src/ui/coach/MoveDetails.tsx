import { useEffect, useId, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { sideName } from "../../domain/chess/position.ts";
import { moveDescription } from "../../domain/chess/moves.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import { movePreviewEvents, type MovePreviewProps } from "./previewEvents.ts";

export function Continuation(props: MovePreviewProps) {
  const { t } = useTranslation();
  const steps = props.candidate.continuation.map((move, index) => ({
    move,
    ply: index + 1,
    description: moveDescription(move, t),
    focus: index === 0 ? props.candidate.explanationFocus : undefined,
    heading:
      index === 0
        ? t("coach.best.heading")
        : index === 1
          ? t("coach.continuation.replyHeading")
          : sideName(move.color, t),
  }));
  return (
    <div className="continuation" aria-label={t("coach.continuation.label")}>
      <p className="exploration-note">{t("coach.exploration.note")}</p>
      <div className="continuation-moves">
        {steps.map(({ move, ply, focus, description, heading }) => {
          const selected =
            props.preview?.candidate === props.candidate &&
            props.preview.ply === ply;
          return (
            <button
              key={move.lan + ply}
              type="button"
              className={selected ? "current-step" : ""}
              aria-pressed={selected}
              aria-label={t(
                "coach.continuation.previewMove",
                ply,
                sideName(move.color, t),
                description,
              )}
              {...movePreviewEvents({ ...props, ply, focus })}
              onClick={() =>
                props.onInspect(props.candidate, ply, "click", focus)
              }
            >
              <span className="continuation-step-label">{heading}</span>
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
  const [expanded, setExpanded] = useState(false);
  const body = useId();
  const { candidate, onClearInspection: clear, onInspect: inspect } = props;
  useEffect(() => () => clear(candidate), [candidate, clear]);
  const toggle = () => {
    if (expanded) clear(candidate);
    else inspect(candidate, 1, "click", candidate.explanationFocus);
    setExpanded(!expanded);
  };
  const events = movePreviewEvents({
    ...props,
    ply: 1,
    focus: candidate.explanationFocus,
    enabled: !expanded,
  });
  return (
    <>
      <div className="plan-actions">
        {children}
        <button
          type="button"
          className="plan-preview"
          aria-expanded={expanded}
          aria-controls={body}
          {...events}
          onClick={toggle}
        >
          <Eye size={14} />{" "}
          {t(expanded ? "coach.exploration.close" : "coach.exploration.open")}
        </button>
      </div>
      <div id={body} className="move-exploration" hidden={!expanded}>
        {expanded && <Continuation {...props} />}
      </div>
    </>
  );
}
