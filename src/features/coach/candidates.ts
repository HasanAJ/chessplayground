import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move } from "chess.js";
import type { EngineLine } from "../../engine/uci";
import { capturedSquare, uciMove } from "../../chess/moves";
import { formatEvaluation } from "../../chess/evaluation";
import { boardFocus, type BoardFocus } from "./boardFocus";
import { describeReply } from "./replyDescription";
import { explainMove } from "./explanations";
import { readContinuation } from "./continuation";

export type Candidate = EngineLine & {
  move: Move;
  title: string;
  explanation: string;
  explanationFocus?: BoardFocus;
  continuation: Move[];
  score: string;
  whiteScore: number;
};
export const MAX_RECOMMENDED_MOVES = 5;
const RECOMMENDATION_CP_GAP = 50;

/** Qualify alternatives at the completed depth, keeping the final choice first. */
export function recommendedCandidates(
  candidates: Candidate[],
  best = candidates[0],
): Candidate[] {
  if (!best) return [];
  const comparisonBest = candidates[0];
  const alternatives = candidates.filter((candidate) => {
    if (candidate.move.lan === best.move.lan) return false;
    // A newer mate result can rule out alternatives from the completed batch.
    if (
      best.mate !== undefined &&
      (best.mate > 0 ? (candidate.mate ?? 0) <= 0 : candidate.mate !== best.mate)
    ) return false;
    if (best.mate === undefined && (candidate.mate ?? 0) < 0) return false;
    if (comparisonBest.mate !== undefined)
      return comparisonBest.mate > 0
        ? candidate.mate !== undefined && candidate.mate > 0
        : candidate.mate === comparisonBest.mate;
    if (candidate.mate !== undefined) return candidate.mate > 0;
    return (
      comparisonBest.cp !== undefined &&
      candidate.cp !== undefined &&
      comparisonBest.cp - candidate.cp <= RECOMMENDATION_CP_GAP
    );
  });
  return [best, ...alternatives].slice(0, MAX_RECOMMENDED_MOVES);
}

export function candidatesFor(
  fen: string,
  lines: EngineLine[],
  t: Translator = english,
): Candidate[] {
  return [...lines]
    .sort((a, b) => a.rank - b.rank)
    .flatMap((line) => {
      const before = new Chess(fen),
        after = new Chess(fen);
      try {
        const move = uciMove(after, line.pv[0]);
        let insight = explainMove(before, after, move, t);
        if (line.mate !== undefined && line.mate > 0 && !after.isCheckmate()) {
          insight = {
            title: t("coach.explanation.matingAttack.title"),
            text: t(
              "coach.explanation.matingAttack.text",
              line.mate,
            ),
            focus: boardFocus(t("coach.explanation.matingAttack.focus"), [
              { from: move.from, to: move.to },
            ]),
          };
        } else if (line.mate !== undefined && line.mate < 0) {
          insight = {
            title: t("coach.explanation.mateDefense.title"),
            text: t("coach.explanation.mateDefense.text"),
            focus: boardFocus(t("coach.explanation.mateDefense.focus"), [
              { from: move.from, to: move.to },
            ]),
          };
        }
        const {
          moves: continuation,
          materialLoss: lineMaterialLoss,
        } = readContinuation(after, move, line.pv);
        const response = continuation[1];
        const materialWarning =
          !!lineMaterialLoss && line.mate === undefined;
        insight = {
          ...insight,
          text: [
            insight.text,
            response?.captured && line.mate === undefined
              ? describeReply(response, t, move)
              : "",
            materialWarning ? t("coach.explanation.materialRisk.text") : "",
          ].filter(Boolean).join(" "),
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
        const sign = before.turn() === "w" ? 1 : -1;
        const whiteScore =
          line.mate !== undefined
            ? (line.mate >= 0 ? 100 : -100) * sign
            : ((line.cp ?? 0) / 100) * sign;
        const score = formatEvaluation({ whiteScore, mate: line.mate }, t.language);
        return [
          {
            ...line,
            move,
            title: insight.title,
            explanation: insight.text,
            explanationFocus: insight.focus,
            continuation,
            whiteScore,
            score,
          },
        ];
      } catch {
        return [];
      }
    });
}
