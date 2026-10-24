import { useTranslation } from "../../i18n/LanguageProvider";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { GameController } from "../game/useGameController";
import type { BoardPreview } from "../board/useBoardPreview";
import { MoveExploration } from "./MoveDetails";
import type { Candidate } from "./candidates";
import type { CoachPresentation } from "./useCoachPresentation";
import { moveDescription } from "../../chess/moves";
import { SquareText } from "../board/SquareHighlight";

type Props = {
  candidates: Candidate[];
  onPlayMove: GameController["playMove"];
  preview: BoardPreview;
  presentation: CoachPresentation;
};

export function AlternativeMoves({
  candidates,
  onPlayMove,
  preview,
  presentation,
}: Props) {
  const { t } = useTranslation();
  const { active, setActive, setHovered } = presentation;
  const { inspection, inspectMove, clearPreview } = preview;
  if (candidates.length < 2) return null;
  return (
    <section
      className="alternative-moves"
      aria-label={t("coach.alternatives.heading")}
    >
      <h3>{t("coach.alternatives.heading")}</h3>
      <div className="candidate-list">
        {candidates.slice(1).map((candidate, index) => {
          const i = index + 1;
          return (
            <article
              className={`candidate-card ${active === i ? "expanded" : ""}`}
              key={candidate.move.lan}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                className="candidate-toggle"
                onClick={() => {
                  setActive((current) => (current === i ? null : i));
                  if (active !== i) clearPreview();
                }}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-expanded={active === i}
                aria-label={t(
                  "coach.alternatives.description",
                  candidate.move.san,
                  moveDescription(candidate.move, t),
                  candidate.title,
                )}
              >
                <div className="candidate-info">
                  <div>
                    <span className="move-san">
                      <SquareText text={candidate.move.san} focusable={false} />
                    </span>
                  </div>
                  <span className="candidate-purpose">
                    <SquareText text={candidate.title} focusable={false} />
                  </span>
                  <span className="candidate-move-description">
                    <SquareText
                      text={moveDescription(candidate.move, t)}
                      focusable={false}
                    />
                  </span>
                </div>
                <span className="candidate-score">
                  {candidate.score}
                </span>
                <ChevronRight size={16} className="candidate-chevron" />
              </button>
              {active === i && (
                <div className="candidate-body">
                  {candidate.explanation && (
                    <p className="move-explanation">
                      <SquareText text={candidate.explanation} />
                    </p>
                  )}
                  <MoveExploration
                    candidate={candidate}
                    preview={inspection}
                    onInspect={inspectMove}
                  >
                    <button
                      className="primary-button"
                      onClick={() =>
                        onPlayMove(
                          candidate.move.from,
                          candidate.move.to,
                          candidate.move.promotion,
                        )
                      }
                    >
                      <SquareText
                        text={t("coach.move.play", candidate.move.san)}
                        focusable={false}
                      />
                      <ArrowRight size={15} />
                    </button>
                  </MoveExploration>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
