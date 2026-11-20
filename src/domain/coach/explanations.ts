import { Chess, type Move, type Square } from "chess.js";
import { english, type Translator } from "../../i18n/translate.ts";
import {
  ending,
  opposite,
  pieceNameKeys,
  positionOf,
  withTurn,
} from "../chess/position.ts";
import { capturedSquare } from "../chess/moves.ts";
import { pieceValues } from "../chess/material.ts";
import { boardFocus, type BoardFocus } from "./boardFocus.ts";

export type Explanation = {
  title: string;
  text: string;
  focus?: BoardFocus;
};
type MoveExplanation = Explanation & { kind: "observation" | "activity" };
const center: Square[] = ["d4", "e4", "d5", "e5"];
const nearCenter: Square[] = [
  "c3",
  "d3",
  "e3",
  "f3",
  "c4",
  "f4",
  "c5",
  "f5",
  "c6",
  "d6",
  "e6",
  "f6",
];
function explanation(
  title: string,
  text: string,
  label: string,
  arrows: BoardFocus["arrows"],
  squares: Square[] = [],
): MoveExplanation {
  return {
    kind: "observation",
    title,
    text,
    focus: boardFocus(label, arrows, squares),
  };
}

/** Explain observed board facts in priority order; an attack is never a promised capture. */
export function explainMove(
  before: Chess,
  after: Chess,
  move: Move,
  t: Translator = english,
): MoveExplanation {
  const name = (type: Move["piece"]) => t(pieceNameKeys[type]);
  const piece = name(move.promotion ?? move.piece);
  const travel = [{ from: move.from, to: move.to }];
  const king = after
    .board()
    .flat()
    .find((piece) => piece?.type === "k" && piece.color !== move.color)?.square;
  const checkers =
    king && after.isCheck() ? after.attackers(king, move.color) : [];
  const checkingArrows = king
    ? checkers.map((from) => ({ from, to: king }))
    : [];
  const directCheck = checkers.length === 1 && checkers[0] === move.to;
  const checkerNames = directCheck
    ? piece
    : checkers
        .map((square) =>
          t("coach.piece.onSquare", name(after.get(square)!.type), square),
        )
        .join(t("common.join.and"));
  const checkText = checkers.length
    ? t(
        checkers.length === 1
          ? "coach.explanation.check.singular"
          : "coach.explanation.check.plural",
        checkerNames,
      )
    : "";
  const promotion = move.promotion
    ? t("coach.explanation.promotion.prefix", piece, move.to)
    : "";

  if (after.isCheckmate())
    return explanation(
      t("coach.explanation.checkmate.title"),
      move.promotion && directCheck
        ? t("coach.explanation.promotion.checkmate", piece, move.to)
        : t(
            checkers.length > 1
              ? "coach.explanation.checkmate.plural"
              : "coach.explanation.checkmate.singular",
            promotion,
            checkerNames,
          ),
      t("coach.explanation.checkmate.focus"),
      checkingArrows,
    );
  if (after.isDraw())
    return explanation(
      t("coach.explanation.draw.title"),
      ending(after, t)!,
      t("coach.explanation.draw.focus"),
      travel,
    );
  if (move.promotion)
    return explanation(
      t("coach.explanation.promotion.title"),
      directCheck
        ? t("coach.explanation.promotion.check", piece, move.to)
        : promotion.trim() + (checkText ? ` ${checkText}` : ""),
      t("coach.explanation.promotion.focus"),
      checkingArrows,
      [move.to],
    );
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const kingside = move.isKingsideCastle();
    return explanation(
      t("coach.explanation.castle.title"),
      t("coach.explanation.castle.text", checkText ? ` ${checkText}` : ""),
      t("coach.explanation.castle.focus"),
      [
        ...travel,
        {
          from: `${kingside ? "h" : "a"}${move.from[1]}` as Square,
          to: `${kingside ? "f" : "d"}${move.from[1]}` as Square,
        },
      ],
    );
  }
  if (before.isCheck()) {
    const escape = move.captured
      ? t(
          "coach.explanation.escapeCheck.capture",
          name(move.captured),
          capturedSquare(move),
        )
      : move.piece === "k"
        ? t("coach.explanation.escapeCheck.kingMove", move.to)
        : t("coach.explanation.escapeCheck.block", piece);
    const ownKing = after
      .board()
      .flat()
      .find(
        (piece) => piece?.type === "k" && piece.color === move.color,
      )?.square;
    return explanation(
      t("coach.explanation.escapeCheck.title"),
      t(
        "coach.explanation.escapeCheck.text",
        escape,
        checkText ? ` ${checkText}` : "",
      ),
      t("coach.explanation.escapeCheck.focus"),
      travel,
      ownKing ? [ownKing] : [],
    );
  }
  if (move.captured)
    return explanation(
      checkers.length
        ? t("coach.explanation.captureCheck.title")
        : t("coach.explanation.capture.title", name(move.captured)),
      t(
        directCheck
          ? "coach.explanation.captureCheck.text"
          : "coach.explanation.capture.text",
        piece,
        name(move.captured),
        capturedSquare(move),
        move.isEnPassant()
          ? t("coach.explanation.capture.enPassant") + move.to
          : "",
        checkText ? ` ${checkText}` : "",
      ),
      t("coach.explanation.capture.focus"),
      [
        ...travel,
        ...after
          .attackers(move.to, opposite(move.color))
          .map((from) => ({ from, to: move.to })),
        ...checkingArrows,
      ],
      [capturedSquare(move)],
    );
  if (checkers.length)
    return explanation(
      t("coach.explanation.check.title"),
      checkText,
      t("coach.explanation.check.focus"),
      checkingArrows,
    );

  const newTargets = Object.entries(positionOf(after))
    .filter(
      ([square, target]) =>
        target?.color !== move.color &&
        target?.type !== "k" &&
        after.attackers(square as Square, move.color).includes(move.to) &&
        !before.attackers(square as Square, move.color).includes(move.from),
    )
    .sort((a, b) => pieceValues[b[1]!.type] - pieceValues[a[1]!.type]);
  const pressure = newTargets.find(
    ([square]) => after.attackers(square as Square, move.color).length > 1,
  );
  if (pressure) {
    const [square, target] = pressure;
    return explanation(
      t("coach.explanation.pressure.title", square),
      t("coach.explanation.pressure.text", piece, name(target!.type), square),
      t("coach.explanation.attack.focus", name(target!.type)),
      after
        .attackers(square as Square, move.color)
        .map((from) => ({ from, to: square as Square })),
    );
  }
  const defended = Object.entries(positionOf(before))
    .filter(
      ([square, target]) =>
        target?.color === move.color &&
        target.type !== "k" &&
        square !== move.from &&
        before.isAttacked(square as Square, opposite(move.color)) &&
        !before.isAttacked(square as Square, move.color) &&
        after.attackers(square as Square, move.color).includes(move.to),
    )
    .sort((a, b) => pieceValues[b[1]!.type] - pieceValues[a[1]!.type])[0];
  if (defended) {
    const [square, target] = defended;
    return explanation(
      center.includes(square as Square)
        ? t("coach.explanation.supportCenter.title")
        : t("coach.explanation.defend.title", name(target!.type)),
      t("coach.explanation.defend.text", piece, name(target!.type), square),
      t("coach.explanation.defend.focus", name(target!.type)),
      [{ from: move.to, to: square as Square }],
    );
  }
  if (
    before.isAttacked(move.from, opposite(move.color)) &&
    !after.isAttacked(move.to, opposite(move.color))
  )
    return explanation(
      t("coach.explanation.escapeAttack.title", piece),
      [
        t("coach.explanation.escapeAttack.text", piece),
        newTargets.length
          ? t(
              "coach.explanation.attack.text",
              piece,
              name(newTargets[0][1]!.type),
              newTargets[0][0],
            )
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      t("coach.explanation.escapeAttack.focus", piece),
      [
        ...travel,
        ...newTargets
          .slice(0, 1)
          .map(([to]) => ({ from: move.to, to: to as Square })),
      ],
    );
  if (newTargets.length) {
    const [square, target] = newTargets[0];
    return explanation(
      t("coach.explanation.attack.title", name(target!.type)),
      t("coach.explanation.attack.text", piece, name(target!.type), square),
      t("coach.explanation.attack.focus", name(target!.type)),
      [{ from: move.to, to: square as Square }],
    );
  }
  const pawnSquare =
    `${move.to[0]}${Number(move.to[1]) + (move.color === "w" ? 1 : -1)}` as Square;
  const pawn = before.get(pawnSquare);
  if (
    pawn?.type === "p" &&
    pawn.color !== move.color &&
    !before.get(move.to) &&
    withTurn(before.fen(), pawn.color)
      .moves({ square: pawnSquare, verbose: true })
      .some((advance) => advance.to === move.to && !advance.captured)
  ) {
    const pressure = Object.entries(positionOf(after))
      .filter(
        ([square, target]) =>
          target?.color !== move.color &&
          target?.type !== "k" &&
          before.attackers(square as Square, move.color).includes(move.from) &&
          after.attackers(square as Square, move.color).includes(move.to),
      )
      .sort((a, b) => pieceValues[b[1]!.type] - pieceValues[a[1]!.type])[0];
    return explanation(
      t("coach.explanation.blockade.title"),
      [
        t("coach.explanation.blockade.text", piece, move.to, pawnSquare),
        pressure
          ? t(
              "coach.explanation.blockade.pressure",
              name(pressure[1]!.type),
              pressure[0],
            )
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      t("coach.explanation.blockade.focus"),
      travel,
      [pawnSquare],
    );
  }
  return { ...activity(before, after, move, t), kind: "activity" };
}

function activity(
  before: Chess,
  board: Chess,
  move: Move,
  t: Translator,
): Explanation {
  const piece = t(pieceNameKeys[move.piece]);
  const travel = [{ from: move.from, to: move.to }];
  const controlled = center.filter(
    (square) =>
      board.attackers(square, move.color).includes(move.to) &&
      !before.attackers(square, move.color).includes(move.from),
  );
  const control = controlled.length
    ? t(
        "coach.explanation.develop.centerControl",
        controlled.join(t("common.join.and")),
      )
    : "";
  const controlArrows = controlled.map((to) => ({ from: move.to, to }));
  const openedBishop = before
    .board()
    .flat()
    .find((bishop) => {
      if (
        bishop?.type !== "b" ||
        bishop.color !== move.color ||
        board.get(bishop.square)?.type !== "b" ||
        board.get(bishop.square)?.color !== bishop.color ||
        !before.attackers(move.from, move.color).includes(bishop.square)
      )
        return false;
      const previous = new Set(
        before
          .moves({ square: bishop.square, verbose: true })
          .map((step) => step.to),
      );
      return withTurn(board.fen(), move.color)
        .moves({ square: bishop.square, verbose: true })
        .some((step) => step.to !== move.from && !previous.has(step.to));
    });
  const diagonal = openedBishop
    ? t("coach.explanation.openDiagonal.text", openedBishop.square)
    : "";
  if (
    ["n", "b"].includes(move.piece) &&
    move.from[1] === (move.color === "w" ? "1" : "8")
  )
    return explanation(
      t("coach.explanation.develop.title"),
      t("coach.explanation.develop.text", piece, control).trim(),
      t("coach.explanation.develop.focus"),
      controlArrows,
      [move.from, move.to],
    );
  if (move.piece === "p" && center.includes(move.to)) {
    const targets = [-1, 1].map(
      (offset) =>
        `${String.fromCharCode(move.to.charCodeAt(0) + offset)}${Number(move.to[1]) + (move.color === "w" ? 1 : -1)}` as Square,
    );
    return explanation(
      t("coach.explanation.center.title"),
      [
        t("coach.explanation.center.text", targets.join(t("common.join.and"))),
        diagonal,
      ]
        .filter(Boolean)
        .join(" "),
      t("coach.explanation.center.focus"),
      targets.map((to) => ({ from: move.to, to })),
    );
  }
  if (openedBishop)
    return explanation(
      t("coach.explanation.openDiagonal.title"),
      diagonal,
      t("coach.explanation.develop.focus"),
      travel,
      [openedBishop.square],
    );
  if (move.piece === "r") {
    const open = !Object.entries(positionOf(board)).some(
      ([square, piece]) => square[0] === move.to[0] && piece?.type === "p",
    );
    return open && move.from[0] !== move.to[0]
      ? explanation(
          t("coach.explanation.openFile.title"),
          t("coach.explanation.openFile.text", move.to[0]),
          t("coach.explanation.openFile.focus"),
          [],
          Array.from(
            { length: 8 },
            (_, index) => `${move.to[0]}${index + 1}` as Square,
          ),
        )
      : explanation(
          t("coach.explanation.rook.title", move.to),
          "",
          t("coach.explanation.rook.focus"),
          travel,
        );
  }
  if (move.piece === "k")
    return explanation(
      t("coach.explanation.king.title", move.to),
      "",
      t("coach.explanation.king.focus"),
      travel,
    );
  if (
    move.piece === "p" &&
    (Number(move.to[1]) - Number(move.from[1])) *
      (move.color === "w" ? 1 : -1) >
      0
  )
    return explanation(
      t("coach.explanation.pawn.title", move.to),
      "",
      t("coach.explanation.pawn.focus"),
      travel,
    );
  if ([...center, ...nearCenter].includes(move.to))
    return explanation(
      t("coach.explanation.nearCenter.title"),
      control,
      t("coach.explanation.nearCenter.focus"),
      controlArrows,
      [move.from, move.to],
    );
  return explanation(
    t("coach.explanation.reposition.title", piece, move.to),
    "",
    t("coach.explanation.reposition.focus", piece),
    travel,
  );
}
