import { Chess, type Move, type Square } from "chess.js";
import type { Translator } from "../../i18n/translate.ts";
import {
  ending,
  opposite,
  pieceNameKeys,
  withTurn,
} from "../chess/position.ts";
import { pieceValues } from "../chess/material.ts";
import { capturedSquare } from "../chess/moves.ts";
import { boardFocus } from "./boardFocus.ts";
import type { CandidateAnalysis } from "./candidates.ts";
import { explainMove, type Explanation } from "./explanations.ts";

const PLAN_PLIES = 7;

function canSupport(board: Chess, from: Square, target: Square) {
  const captures = board
    .moves({ verbose: true })
    .filter((reply) => reply.captured && capturedSquare(reply) === target);
  // No legal capture can mean that the added defender already prevents a king capture.
  return (
    captures.length === 0 ||
    captures.some((reply) =>
      new Chess(reply.after)
        .moves({ square: from, verbose: true })
        .some((recapture) => recapture.captured && recapture.to === reply.to),
    )
  );
}

/** Follow a quiet move's piece, and describe only goals reached in the supplied line. */
export function explainContinuationPlan(
  { move, continuation }: CandidateAnalysis,
  t: Translator,
): Explanation | undefined {
  const before = new Chess(move.before);
  const targets = before
    .board()
    .flat()
    .filter((piece) => piece !== null)
    .filter((piece) => piece.type !== "k")
    .sort((a, b) => pieceValues[b.type] - pieceValues[a.type]);
  const name = (type: Move["piece"]) => t(pieceNameKeys[type]);
  const route: Square[] = [move.from];
  const plan = (title: string, text: string, target: Square): Explanation => ({
    title,
    text,
    // The first preview still shows the first move, not the future position.
    focus: boardFocus(
      t("coach.explanation.plan.focus"),
      [{ from: move.from, to: move.to }],
      [target],
    ),
  });

  for (const step of continuation.slice(0, PLAN_PLIES)) {
    if (step.color !== move.color) {
      if (step.captured || step.promotion || /[+#]$/.test(step.san)) break;
      continue;
    }
    if (step.from !== route.at(-1) || route.includes(step.to)) break;
    route.push(step.to);
    const after = new Chess(step.after);

    if (after.isDraw())
      return plan(
        t("coach.explanation.draw.title"),
        t("coach.explanation.plan.outcome", ending(after, t)!),
        step.to,
      );

    if (
      route.length > 2 &&
      (step.captured || step.promotion || after.isCheck())
    ) {
      const outcome = explainMove(new Chess(step.before), after, step, t);
      return plan(
        t(
          step.promotion
            ? "coach.explanation.plan.promotion.title"
            : step.captured
              ? "coach.explanation.plan.capture.title"
              : "coach.explanation.plan.check.title",
        ),
        t("coach.explanation.plan.outcome", outcome.text),
        step.captured ? capturedSquare(step) : step.to,
      );
    }

    const defended = targets.find(
      (target) =>
        target.color === move.color &&
        target.square !== move.from &&
        after.get(target.square)?.type === target.type &&
        after.get(target.square)?.color === target.color &&
        before.isAttacked(target.square, opposite(move.color)) &&
        after.isAttacked(target.square, opposite(move.color)) &&
        !before.attackers(target.square, move.color).includes(move.from) &&
        after.attackers(target.square, move.color).includes(step.to) &&
        canSupport(after, step.to, target.square),
    );
    if (defended) {
      const opponent = withTurn(before.fen(), opposite(move.color));
      const defenders = before
        .attackers(defended.square, move.color)
        .filter((from) => canSupport(opponent, from, defended.square));
      const defender = defenders.length === 1 ? defenders[0] : undefined;
      const sharedDefense =
        defender &&
        after.get(defender)?.type === before.get(defender)?.type &&
        after.get(defender)?.color === move.color &&
        after.attackers(defended.square, move.color).includes(defender) &&
        canSupport(after, defender, defended.square)
          ? t(
              "coach.explanation.plan.sharedDefense",
              name(before.get(defender)!.type),
              defender,
            )
          : "";
      return plan(
        t("coach.explanation.plan.defend.title", name(defended.type)),
        [
          t(
            "coach.explanation.plan.defend.text",
            name(move.piece),
            step.to,
            name(defended.type),
            defended.square,
          ),
          sharedDefense,
        ]
          .filter(Boolean)
          .join(" "),
        defended.square,
      );
    }

    const attacks = targets.filter(
      (target) =>
        target.color !== move.color &&
        after.get(target.square)?.type === target.type &&
        after.get(target.square)?.color === target.color &&
        !before.attackers(target.square, move.color).includes(move.from) &&
        after.attackers(target.square, move.color).includes(step.to),
    );
    if (!attacks.length) continue;
    const fields = after.fen().split(" ");
    fields[1] = move.color;
    fields[3] = "-";
    const legalTargets = new Set(
      new Chess(fields.join(" "))
        .moves({ square: step.to, verbose: true })
        .filter((capture) => capture.captured)
        .map((capture) => capture.to),
    );
    const attacked = attacks.find((target) => legalTargets.has(target.square));
    if (attacked)
      return plan(
        t("coach.explanation.plan.attack.title"),
        t(
          "coach.explanation.plan.attack.text",
          name(move.piece),
          step.to,
          name(attacked.type),
          attacked.square,
        ),
        attacked.square,
      );
  }
  return undefined;
}
