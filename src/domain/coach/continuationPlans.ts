import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";
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

type PlanPiece = { square: Square; type: PieceSymbol };
export type ContinuationPlan =
  | { kind: "defend"; step: Move; target: PlanPiece; defender?: PlanPiece }
  | { kind: "attack"; step: Move; target: PlanPiece }
  | { kind: "draw" | "capture" | "check" | "promotion"; step: Move };

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

/** Follow a quiet move's piece and keep only goals reached in the supplied line. */
function findContinuationPlan({
  move,
  continuation,
}: CandidateAnalysis): ContinuationPlan | undefined {
  const before = new Chess(move.before);
  const targets = before
    .board()
    .flat()
    .filter((piece) => piece !== null)
    .filter((piece) => piece.type !== "k")
    .sort((a, b) => pieceValues[b.type] - pieceValues[a.type]);
  const route: Square[] = [move.from];

  for (const step of continuation.slice(0, PLAN_PLIES)) {
    if (step.color !== move.color) {
      if (step.captured || step.promotion || /[+#]$/.test(step.san)) break;
      continue;
    }
    if (step.from !== route.at(-1) || route.includes(step.to)) break;
    route.push(step.to);
    const after = new Chess(step.after);

    if (after.isDraw()) return { kind: "draw", step };

    if (
      route.length > 2 &&
      (step.captured || step.promotion || after.isCheck())
    )
      return {
        kind: step.promotion
          ? "promotion"
          : step.captured
            ? "capture"
            : "check",
        step,
      };

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
      const square = defenders.length === 1 ? defenders[0] : undefined;
      const defender =
        square &&
        after.get(square)?.type === before.get(square)?.type &&
        after.get(square)?.color === move.color &&
        after.attackers(defended.square, move.color).includes(square) &&
        canSupport(after, square, defended.square)
          ? { square, type: before.get(square)!.type }
          : undefined;
      return { kind: "defend", step, target: defended, defender };
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
    if (attacked) return { kind: "attack", step, target: attacked };
  }
  return undefined;
}

export function explainContinuationPlan(
  candidate: CandidateAnalysis,
  t: Translator,
): (Explanation & { plan: ContinuationPlan }) | undefined {
  const plan = findContinuationPlan(candidate);
  if (!plan) return undefined;
  const { move } = candidate;
  const { kind, step } = plan;
  const name = (type: PieceSymbol) => t(pieceNameKeys[type]);
  const explain = (title: string, text: string, target: Square) => ({
    title,
    text,
    plan,
    focus: boardFocus(
      t("coach.explanation.plan.focus"),
      [{ from: move.from, to: move.to }],
      [target],
    ),
  });
  if (kind === "defend" || kind === "attack") {
    const { target } = plan;
    const description = t(
      `coach.explanation.plan.${kind}.text`,
      name(move.piece),
      step.to,
      name(target.type),
      target.square,
    );
    const defender = kind === "defend" ? plan.defender : undefined;
    const sharedDefense = defender
      ? t(
          "coach.explanation.plan.sharedDefense",
          name(defender.type),
          defender.square,
        )
      : "";
    return explain(
      t(`coach.explanation.plan.${kind}.title`, name(target.type)),
      [description, sharedDefense].filter(Boolean).join(" "),
      target.square,
    );
  }
  const after = new Chess(step.after);
  const outcome =
    kind === "draw"
      ? ending(after, t)!
      : explainMove(new Chess(step.before), after, step, t).text;
  return explain(
    t(
      kind === "draw"
        ? "coach.explanation.draw.title"
        : `coach.explanation.plan.${kind}.title`,
    ),
    t("coach.explanation.plan.outcome", outcome),
    kind !== "draw" && step.captured ? capturedSquare(step) : step.to,
  );
}
