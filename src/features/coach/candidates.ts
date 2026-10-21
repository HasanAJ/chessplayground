import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move } from "chess.js";
import type { EngineLine } from "../../engine/uci";
import { uciMove } from "../../chess/moves";
import {
  boardFocus,
  describeReply,
  explainMove,
  type BoardFocus,
} from "./explanations";

export type Candidate = EngineLine & {
  move: Move;
  title: string;
  explanation: string;
  explanationFocus?: BoardFocus;
  reply: string;
  continuation: Move[];
  theme: string;
  score: string;
  whiteScore: number;
};
export const MAX_RECOMMENDED_MOVES = 5;
const RECOMMENDATION_CP_GAP = 50;

/** Keep useful alternatives to the first, engine-ranked move. UCI scores favor the mover. */
export function recommendedCandidates(candidates: Candidate[]): Candidate[] {
  const best = candidates[0];
  if (!best) return [];
  return candidates
    .filter((candidate, index) => {
      if (index === 0) return true;
      if (best.mate !== undefined)
        return best.mate > 0
          ? candidate.mate !== undefined && candidate.mate > 0
          : candidate.mate === best.mate;
      if (candidate.mate !== undefined) return candidate.mate > 0;
      return (
        best.cp !== undefined &&
        candidate.cp !== undefined &&
        best.cp - candidate.cp <= RECOMMENDATION_CP_GAP
      );
    })
    .slice(0, MAX_RECOMMENDED_MOVES);
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
              move.san,
            ),
            theme: "mating-attack",
            focus: boardFocus(t("coach.explanation.matingAttack.focus"), [
              { from: move.from, to: move.to },
            ]),
          };
        } else if (line.mate !== undefined && line.mate < 0) {
          insight = {
            title: t("coach.explanation.mateDefense.title"),
            text: t(
              "coach.explanation.mateDefense.text",
              move.san,
            ),
            theme: "mate-defense",
            focus: boardFocus(t("coach.explanation.mateDefense.focus"), [
              { from: move.from, to: move.to },
            ]),
          };
        }
        const continuation: Move[] = [move];
        let reply = t("coach.reply.unavailable");
        if (line.pv[1] && !after.isGameOver()) {
          // An invalid immediate reply rejects the candidate; later errors only
          // shorten the preview. Parse each move once for both prose and frames.
          const response = uciMove(after, line.pv[1]);
          continuation.push(response);
          for (const uci of line.pv.slice(2, 6)) {
            try {
              continuation.push(uciMove(after, uci));
            } catch {
              break;
            }
          }
          reply = describeReply(response, t);
        } else if (after.isGameOver())
          reply = after.isCheckmate()
            ? t("coach.reply.terminal.checkmate")
            : t("coach.reply.terminal.draw");
        const sign = before.turn() === "w" ? 1 : -1;
        const whiteScore =
          line.mate !== undefined
            ? (line.mate >= 0 ? 100 : -100) * sign
            : ((line.cp ?? 0) / 100) * sign;
        const score =
          line.mate !== undefined
            ? `${whiteScore > 0 ? "+" : "−"}M${Math.abs(line.mate)}`
            : `${whiteScore >= 0 ? "+" : "−"}${Math.abs(whiteScore).toLocaleString(t.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return [
          {
            ...line,
            move,
            title: insight.title,
            explanation: insight.text,
            explanationFocus: insight.focus,
            theme: insight.theme,
            reply,
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
