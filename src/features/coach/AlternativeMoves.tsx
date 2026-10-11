import { ArrowRight, ChevronRight } from "lucide-react";
import type { BoardController } from "../board/useBoardInteractions";
import type { BoardPreview } from "../board/useBoardPreview";
import { CandidateDetails } from "./MoveDetails";
import type { Candidate } from "./candidates";
import type { CoachPresentation } from "./useCoachPresentation";
import { moveDescription } from "../../chess/moves";
import { SquareText } from "../board/SquareHighlight";

type Props = {
  candidates: Candidate[];
  board: BoardController;
  preview: BoardPreview;
  presentation: CoachPresentation;
};

export function AlternativeMoves({
  candidates,
  board,
  preview,
  presentation,
}: Props) {
  const { active, setActive, setHovered } = presentation;
  const { inspection, inspectMove, clearPreview } = preview;
  const { playSuggestedMove: playMove } = board;
  if (candidates.length < 2) return null;
  return (
    <section aria-label="Other good options">
      <div className="candidates-heading">
        <h3>Other good options</h3>
      </div>
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
                aria-label={`Alternative: ${candidate.move.san}. ${moveDescription(candidate.move)}. ${candidate.title}`}
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
                      text={moveDescription(candidate.move)}
                      focusable={false}
                    />
                  </span>
                </div>
                <span
                  className="candidate-score"
                  title="Position estimate in pawn units: + favors White, − favors Black."
                >
                  {candidate.score}
                </span>
                <ChevronRight size={16} className="candidate-chevron" />
              </button>
              {active === i && (
                <div className="candidate-body">
                  <CandidateDetails
                    candidate={candidate}
                    preview={inspection}
                    onInspect={inspectMove}
                  />
                  <button
                    className="play-move"
                    onClick={() =>
                      playMove(
                        candidate.move.from,
                        candidate.move.to,
                        candidate.move.promotion,
                      )
                    }
                  >
                    <SquareText
                      text={`Play ${candidate.move.san}`}
                      focusable={false}
                    />
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
