import { Chess } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import type { EngineLine } from "../analysis/lines.ts";
import { capturedSquare } from "../chess/moves.ts";
import { materialGain } from "../chess/material.ts";
import { pieceNameKeys } from "../chess/position.ts";
import { formatEvaluation } from "../chess/evaluation.ts";
import { boardFocus, type BoardFocus } from "./boardFocus.ts";
import { describeReply } from "./replyDescription.ts";
import { explainMove, type Explanation } from "./explanations.ts";
import {
  explainContinuationPlan,
  type ContinuationPlan,
} from "./continuationPlans.ts";
import { settledMaterialGain } from "./materialTactics.ts";
import { analyzeCandidates, type CandidateAnalysis } from "./candidates.ts";

export type Candidate = CandidateAnalysis & {
  title: string;
  explanation: string;
  explanationFocus?: BoardFocus;
  plan?: ContinuationPlan;
  score: string;
};
const localized = new WeakMap<
  Translator,
  WeakMap<CandidateAnalysis, Candidate>
>();

function offeredPiece({ move, continuation }: CandidateAnalysis) {
  const reply = continuation[1];
  return reply?.captured &&
    capturedSquare(reply) === move.to &&
    materialGain(continuation.slice(0, 2), move.color) < 0
    ? reply.captured
    : undefined;
}

export function explainCandidate(
  candidate: CandidateAnalysis,
  t: Translator,
): Explanation & { plan?: ContinuationPlan } {
  const { move, mate } = candidate;
  const before = new Chess(move.before),
    after = new Chess(move.after);
  if (mate === undefined || mate === 0 || (mate > 0 && after.isCheckmate())) {
    const immediate = explainMove(before, after, move, t);
    return immediate.kind === "observation"
      ? immediate
      : (explainContinuationPlan(candidate, t) ?? immediate);
  }
  const winning = mate > 0;
  const offered = winning ? offeredPiece(candidate) : undefined;
  return {
    title: t(
      winning
        ? "coach.explanation.matingAttack.title"
        : "coach.explanation.mateDefense.title",
    ),
    text: winning
      ? offered
        ? t(
            "coach.explanation.sacrifice.mate",
            t(pieceNameKeys[offered]),
            move.to,
            mate,
          )
        : t("coach.explanation.matingAttack.text", mate)
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
function captureCompensation(candidate: CandidateAnalysis, t: Translator) {
  const offered = offeredPiece(candidate);
  const reply = candidate.continuation[1];
  const followUp = candidate.continuation[2];
  if (
    !offered ||
    !followUp?.captured ||
    candidate.materialLoss === undefined ||
    settledMaterialGain(
      candidate.continuation.slice(0, 3),
      candidate.move.color,
    ) < 0 ||
    new Chess(candidate.move.before)
      .moves({ square: followUp.from, verbose: true })
      .some((move) => move.to === followUp.to)
  )
    return undefined;
  return t(
    "coach.explanation.sacrifice.capture",
    t(pieceNameKeys[reply.piece]),
    reply.from,
    t(pieceNameKeys[offered]),
    candidate.move.to,
    t(pieceNameKeys[followUp.piece]),
    t(pieceNameKeys[followUp.captured]),
    capturedSquare(followUp),
    reply.promotion
      ? t(
          "coach.explanation.sacrifice.promotion",
          t(pieceNameKeys[reply.promotion]),
        )
      : "",
  );
}

function buildPresentation(
  candidate: CandidateAnalysis,
  t: Translator,
): Candidate {
  const insight = explainCandidate(candidate, t);
  const reply = candidate.continuation[1];
  const ordinaryScore = candidate.mate === undefined;
  const sentences = [insight.text];
  if (ordinaryScore && reply?.captured)
    sentences.push(
      captureCompensation(candidate, t) ??
        describeReply(reply, t, candidate.move),
    );
  const focus =
    ordinaryScore && reply?.captured
      ? boardFocus(
          t("coach.explanation.reply.focus"),
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
    plan: insight.plan,
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
