import { Chess } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import type { EngineLine } from "../analysis/lines.ts";
import { capturedSquare } from "../chess/moves.ts";
import { formatEvaluation } from "../chess/evaluation.ts";
import { boardFocus, type BoardFocus } from "./boardFocus.ts";
import { describeReply } from "./replyDescription.ts";
import { explainMove } from "./explanations.ts";
import { analyzeCandidates, type CandidateAnalysis } from "./candidates.ts";

export type Candidate = CandidateAnalysis & {
  title: string;
  explanation: string;
  explanationFocus?: BoardFocus;
  score: string;
};
const localized = new WeakMap<
  Translator,
  WeakMap<CandidateAnalysis, Candidate>
>();

function insightFor(candidate: CandidateAnalysis, t: Translator) {
  const { move, mate } = candidate;
  const before = new Chess(move.before),
    after = new Chess(move.after);
  if (mate === undefined || mate === 0 || (mate > 0 && after.isCheckmate()))
    return explainMove(before, after, move, t);
  const winning = mate > 0;
  return {
    title: t(
      winning
        ? "coach.explanation.matingAttack.title"
        : "coach.explanation.mateDefense.title",
    ),
    text: winning
      ? t("coach.explanation.matingAttack.text", mate)
      : t("coach.explanation.mateDefense.text"),
    focus: boardFocus(
      t(
        winning
          ? "coach.explanation.matingAttack.focus"
          : "coach.explanation.mateDefense.focus",
      ),
      [{ from: move.from, to: move.to }],
    ),
  };
}
function buildPresentation(
  candidate: CandidateAnalysis,
  t: Translator,
): Candidate {
  const insight = insightFor(candidate, t);
  const reply = candidate.continuation[1];
  const ordinaryScore = candidate.mate === undefined;
  const atRisk = ordinaryScore && !!candidate.materialLoss;
  const sentences = [insight.text];
  if (ordinaryScore && reply?.captured)
    sentences.push(describeReply(reply, t, candidate.move));
  if (atRisk) sentences.push(t("coach.explanation.materialRisk.text"));
  const focus =
    atRisk && reply?.captured
      ? boardFocus(
          t("coach.explanation.materialRisk.focus"),
          [
            ...(insight.focus?.arrows ?? []),
            { from: reply.from, to: reply.to },
          ],
          [...(insight.focus?.squares ?? []), capturedSquare(reply)],
        )
      : insight.focus;
  return {
    ...candidate,
    title: insight.title,
    explanation: sentences.filter(Boolean).join(" "),
    explanationFocus: focus,
    score: formatEvaluation(candidate, t.language),
  };
}

export function presentCandidate(
  candidate: CandidateAnalysis,
  t: Translator = english,
): Candidate {
  let cache = localized.get(t);
  if (!cache) {
    cache = new WeakMap();
    localized.set(t, cache);
  }
  let presentation = cache.get(candidate);
  if (!presentation) {
    presentation = buildPresentation(candidate, t);
    cache.set(candidate, presentation);
  }
  return presentation;
}
export function candidatesFor(
  fen: string,
  lines: EngineLine[],
  t: Translator = english,
) {
  return analyzeCandidates(fen, lines).map((candidate) =>
    presentCandidate(candidate, t),
  );
}
