import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { positionSummary, type Candidate } from "./candidates";
import type { StrategyInsight } from "./strategy";
import { SquareText } from "../board/SquareHighlight";

export function PositionDetails({
  candidate,
  insight,
  forcedMove,
  inCheck,
  highlighted,
  onHighlightChange,
  onHighlightPreviewChange,
  children,
}: {
  candidate: Candidate;
  insight: StrategyInsight | null;
  forcedMove: boolean;
  inCheck: boolean;
  highlighted: boolean;
  onHighlightChange: (enabled: boolean) => void;
  onHighlightPreviewChange: (enabled: boolean) => void;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    onHighlightPreviewChange(hovered || focused);
    return () => onHighlightPreviewChange(false);
  }, [hovered, focused, onHighlightPreviewChange]);
  return (
    <details
      className="position-details"
      onToggle={(event) => {
        if (!event.currentTarget.open) {
          setHovered(false);
          setFocused(false);
          onHighlightChange(false);
        }
      }}
    >
      <summary>{t("About this position")}</summary>
      <div className="position-details-body">
        <div className="strategy-foot">
          <span>
            <SquareText text={positionSummary(candidate, t)} />
          </span>
          <span className="score-pill">{candidate.score}</span>
        </div>
        {children}
        {insight && (
          <>
            {insight.change && !inCheck && (
              <div className="plan-change">
                <span>{t("WHAT CHANGED")}</span>
                <p>
                  <SquareText text={insight.change} />
                </p>
              </div>
            )}
            <ul>
              {insight.facts.map((fact) => (
                <li key={fact}>
                  <SquareText text={fact} />
                </li>
              ))}
            </ul>
            {!forcedMove && (
              <p className="plan-comparison">
                <SquareText text={insight.comparison} />
              </p>
            )}
            {insight.squares.length > 0 && (
              <button
                className="text-action"
                aria-pressed={highlighted}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={(event) =>
                  setFocused(event.currentTarget.matches(":focus-visible"))
                }
                onBlur={() => setFocused(false)}
                onClick={() => onHighlightChange(!highlighted)}
              >
                <Eye size={13} />{" "}
                {highlighted
                  ? t("Hide key squares")
                  : t("Highlight key squares")}
              </button>
            )}
            {highlighted && insight.squares.length > 0 && (
              <p className="key-squares-note" role="status">
                <span aria-hidden="true" />
                <span>
                  <SquareText
                    text={t(
                      "Teal outlines mark the squares discussed above: {0}.",
                      insight.squares.join(", "),
                    )}
                  />
                </span>
              </p>
            )}
          </>
        )}
      </div>
    </details>
  );
}
