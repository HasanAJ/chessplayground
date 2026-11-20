import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { moveHints } from "../../domain/coach/hints.ts";
import type { Candidate } from "../../domain/coach/candidatePresentation.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { SquareText } from "../board/SquareHighlight.tsx";

export function HintContent({ candidate }: { candidate: Candidate }) {
  const { t } = useTranslation();
  const hints = useMemo(() => moveHints(candidate, t), [candidate, t]);
  const [step, setStep] = useState(0);
  const hint = hints[step];
  return (
    <>
      <div className="hint-current" role="status" aria-atomic="true">
        {hints.length > 1 && (
          <div className="hint-heading">
            <span className="hint-label">
              <Lightbulb size={16} aria-hidden="true" />
              {t("coach.hint.progress", step + 1, hints.length)}
            </span>
            <div className="hint-progress" aria-hidden="true">
              {hints.map((_, index) => (
                <span
                  key={index}
                  className={index <= step ? "is-reached" : undefined}
                />
              ))}
            </div>
          </div>
        )}
        <h3>{hint.heading}</h3>
        <p className="hint-description">
          <SquareText text={hint.text} />
        </p>
      </div>
      {hints.length > 1 && (
        <div className="hint-navigation">
          <button
            type="button"
            className="hint-nav-button hint-previous"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span>{t("coach.hint.previous")}</span>
          </button>
          <button
            type="button"
            className="hint-nav-button hint-next"
            disabled={step === hints.length - 1}
            onClick={() => setStep(step + 1)}
          >
            <span>{t("coach.hint.next")}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
