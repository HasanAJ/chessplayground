import { useTranslation } from "../../i18n/LanguageProvider";
import { moveDescription } from "../../chess/moves";
import { SquareText } from "../board/SquareHighlight";
import type { Candidate } from "./candidates";

export function BestMoveHeading({ candidate }: { candidate: Candidate }) {
  const { t } = useTranslation();
  const title = moveDescription(candidate.move, t);
  return (
    <h3 className="best-move-heading" aria-label={title}>
      <SquareText text={title} />
    </h3>
  );
}
