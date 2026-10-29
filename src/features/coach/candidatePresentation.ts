import { Chess } from "chess.js";
import { english, type Translator } from "../../i18n/translate";
import type { EngineLine } from "../../engine/uci";
import { capturedSquare } from "../../chess/moves";
import { formatEvaluation } from "../../chess/evaluation";
import { boardFocus, type BoardFocus } from "./boardFocus";
import { describeReply } from "./replyDescription";
import { explainMove } from "./explanations";
import { analyzeCandidates, type CandidateAnalysis } from "./candidates";

export type Candidate = CandidateAnalysis & {
  title: string;
  explanation: string;
  explanationFocus?: BoardFocus;
  score: string;
};

// Keep cached analyses' display objects stable across repeated calculations.
const presentations = new WeakMap<
  CandidateAnalysis,
  WeakMap<Translator, Candidate>
>();

export function presentCandidate(
  candidate: CandidateAnalysis,
  t: Translator = english,
): Candidate {
  let translations = presentations.get(candidate);
  if (!translations) {
    translations = new WeakMap();
    presentations.set(candidate, translations);
  }
  const saved = translations.get(t);
  if (saved) return saved;

  const { move, continuation } = candidate;
  const before = new Chess(move.before);
  const after = new Chess(move.after);
  let insight = explainMove(before, after, move, t);
  if (
    candidate.mate !== undefined &&
    candidate.mate > 0 &&
    !after.isCheckmate()
  ) {
    insight = {
      title: t("coach.explanation.matingAttack.title"),
      text: t("coach.explanation.matingAttack.text", candidate.mate),
      focus: boardFocus(t("coach.explanation.matingAttack.focus"), [
        { from: move.from, to: move.to },
      ]),
    };
  } else if (candidate.mate !== undefined && candidate.mate < 0) {
    insight = {
      title: t("coach.explanation.mateDefense.title"),
      text: t("coach.explanation.mateDefense.text"),
      focus: boardFocus(t("coach.explanation.mateDefense.focus"), [
        { from: move.from, to: move.to },
      ]),
    };
  }
  const response = continuation[1];
  const materialWarning =
    !!candidate.materialLoss && candidate.mate === undefined;
  insight = {
    ...insight,
    text: [
      insight.text,
      response?.captured && candidate.mate === undefined
        ? describeReply(response, t, move)
        : "",
      materialWarning ? t("coach.explanation.materialRisk.text") : "",
    ]
      .filter(Boolean)
      .join(" "),
  };
  if (materialWarning && response?.captured) {
    insight = {
      ...insight,
      focus: boardFocus(
        t("coach.explanation.materialRisk.focus"),
        [
          ...(insight.focus?.arrows ?? []),
          { from: response.from, to: response.to },
        ],
        [...(insight.focus?.squares ?? []), capturedSquare(response)],
      ),
    };
  }
  const result = {
    ...candidate,
    title: insight.title,
    explanation: insight.text,
    explanationFocus: insight.focus,
    score: formatEvaluation(candidate, t.language),
  };
  translations.set(t, result);
  return result;
}

export function candidatesFor(
  fen: string,
  lines: EngineLine[],
  t: Translator = english,
): Candidate[] {
  return analyzeCandidates(fen, lines).map((candidate) =>
    presentCandidate(candidate, t),
  );
}
