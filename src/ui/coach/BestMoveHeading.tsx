import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { moveDescription } from "../../domain/chess/moves.ts";
import { SquareText } from "../board/SquareHighlight.tsx";
import type { Candidate } from "../../domain/coach/candidatePresentation.ts";
export function BestMoveHeading({
  candidate: { move },
}: {
  candidate: Candidate;
}) {
  const translation = useTranslation();
  const text = moveDescription(move, translation.t);
  return (
    <h3 className="best-move-heading" aria-label={text}>
      <SquareText text={text} />
    </h3>
  );
}
