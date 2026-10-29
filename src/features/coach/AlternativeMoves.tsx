import { useTranslation } from "../../i18n/LanguageProvider";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { GameController } from "../game/useGameController";
import type { BoardPreview } from "../board/useBoardPreview";
import { MoveExploration } from "./MoveDetails";
import type { Candidate } from "./candidatePresentation";
import type { CoachPresentation } from "./useCoachPresentation";
import { moveDescription } from "../../chess/moves";
import { SquareText } from "../board/SquareHighlight";
import { pieceImage } from "../board/pieces";

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
  const { inspection, inspectMove, clearInspection, clearPreview } = preview;
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
          const description = moveDescription(candidate.move, t);
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
                aria-label={[
                  t("coach.alternatives.description", description),
                  candidate.title,
                  `${t("coach.position.evaluation")}: ${candidate.score}`,
                ].join(", ")}
              >
                <span className="candidate-piece" aria-hidden="true">
                  <img
                    src={pieceImage({
                      color: candidate.move.color,
                      type: candidate.move.piece,
                    })}
                    alt=""
                    draggable={false}
                  />
                </span>
                <div className="candidate-info">
                  <div className="candidate-copy">
                    <span className="candidate-title">
                      <SquareText text={description} focusable={false} />
                    </span>
                    <span className="move-strategy-tag">
                      <SquareText text={candidate.title} focusable={false} />
                    </span>
                  </div>
                  <span
                    className="candidate-score"
                    title={t("board.evaluation.legend")}
                  >
                    {candidate.score}
                  </span>
                </div>
                <span className="candidate-expand" aria-hidden="true">
                  <ChevronRight size={14} className="candidate-chevron" />
                </span>
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
                    onClearInspection={clearInspection}
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
