import { ArrowRight, ChevronRight } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { moveDescription } from "../../domain/chess/moves.ts";
import type { Candidate } from "../../domain/coach/candidatePresentation.ts";
import { pieceImage } from "../board/pieces.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import { MoveExploration } from "./MoveDetails.tsx";
import type { CoachPanelProps } from "./coachContracts.ts";
type Props = Pick<
  CoachPanelProps,
  "onPlayMove" | "preview" | "presentation"
> & { candidates: Candidate[] };
function Alternative({
  candidate,
  rank,
  ...props
}: Omit<Props, "candidates"> & { candidate: Candidate; rank: number }) {
  const { t } = useTranslation();
  const { presentation: focus, preview } = props;
  const open = focus.active === rank;
  const description = moveDescription(candidate.move, t);
  const play = () =>
    props.onPlayMove(
      candidate.move.from,
      candidate.move.to,
      candidate.move.promotion,
    );
  const toggle = () => {
    focus.setActive(open ? null : rank);
    if (!open) preview.clearPreview();
  };
  const label = [
    t("coach.alternatives.description", description),
    candidate.title,
    `${t("coach.position.evaluation")}: ${candidate.score}`,
  ].join(", ");
  return (
    <article
      className={`candidate-card ${open ? "expanded" : ""}`}
      onMouseEnter={() => focus.setHovered(rank)}
      onMouseLeave={() => focus.setHovered(null)}
    >
      <button
        className="candidate-toggle"
        onClick={toggle}
        onFocus={() => focus.setHovered(rank)}
        onBlur={() => focus.setHovered(null)}
        aria-expanded={open}
        aria-label={label}
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
      {open && (
        <div className="candidate-body">
          {candidate.explanation && (
            <p className="move-explanation">
              <SquareText text={candidate.explanation} />
            </p>
          )}
          <MoveExploration
            candidate={candidate}
            preview={preview.inspection}
            onInspect={preview.inspectMove}
            onClearInspection={preview.clearInspection}
          >
            <button className="primary-button" onClick={play}>
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
}
export function AlternativeMoves({ candidates, ...props }: Props) {
  const { t } = useTranslation();
  const alternatives = candidates.slice(1);
  return alternatives.length ? (
    <section
      className="alternative-moves"
      aria-label={t("coach.alternatives.heading")}
    >
      <h3>{t("coach.alternatives.heading")}</h3>
      <div className="candidate-list">
        {alternatives.map((candidate, index) => (
          <Alternative
            {...props}
            key={candidate.move.lan}
            candidate={candidate}
            rank={index + 1}
          />
        ))}
      </div>
    </section>
  ) : null;
}
