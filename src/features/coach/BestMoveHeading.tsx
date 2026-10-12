import { useTranslation } from "../../i18n/LanguageProvider";
import { SquareText } from "../board/SquareHighlight";
import type { Candidate } from "./candidates";

export function BestMoveHeading({ candidate }: { candidate: Candidate }) {
  const { t } = useTranslation();
  const title =
    candidate.theme === "check" ? t("coach.best.escapeCheck") : candidate.title;
  return (
    <h3
      className="best-move-heading"
      aria-label={`${candidate.move.san} · ${title}`}
    >
      <span className="best-move-san">
        <SquareText text={candidate.move.san} />
      </span>
      <span className="move-title-divider"> · </span>
      <SquareText text={title} />
    </h3>
  );
}
