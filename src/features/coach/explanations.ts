import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move, type Square } from "chess.js";
import { pieceNameKeys, opposite, positionOf } from "../../chess/position";
import { capturedSquare } from "../../chess/moves";

const center: Square[] = ["d4", "e4", "d5", "e5"];
const extendedCenter: Square[] = [
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
const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
export type BoardFocus = {
  label: string;
  squares: Square[];
  arrows: { from: Square; to: Square }[];
};

export function boardFocus(
  label: string,
  arrows: BoardFocus["arrows"],
  squares: Square[] = [],
): BoardFocus {
  return {
    label,
    arrows,
    squares: [
      ...new Set([...squares, ...arrows.flatMap(({ from, to }) => [from, to])]),
    ],
  };
}

export type Explanation = {
  title: string;
  text: string;
  theme: string;
  focus?: BoardFocus;
};

export function explainMove(
  before: Chess,
  after: Chess,
  move: Move,
  t: Translator = english,
): Explanation {
  const piece = t(pieceNameKeys[move.piece]),
    color = move.color;
  const forcing = explainForcingMove(before, after, move, t);
  if (forcing) return forcing;
  const beforePosition = positionOf(before),
    afterPosition = positionOf(after);
  const targets = Object.entries(afterPosition)
    .filter(
      ([sq, p]) =>
        p?.color === opposite(color) &&
        p.type !== "k" &&
        after.attackers(sq as Square, color).includes(move.to) &&
        !before.attackers(sq as Square, color).includes(move.from),
    )
    .sort((a, b) => values[b[1]!.type] - values[a[1]!.type]);
  const jointTarget = targets.find(
    ([sq]) => after.attackers(sq as Square, color).length > 1,
  );
  if (jointTarget) {
    const [sq, target] = jointTarget;
    return {
      title: t("coach.explanation.pressure.title", sq),
      text: t(
        "coach.explanation.pressure.text",
        piece,
        t(pieceNameKeys[target!.type]),
        sq,
      ),
      theme: "pressure",
      focus: boardFocus(
        t("coach.explanation.attack.focus", t(pieceNameKeys[target!.type])),
        after
          .attackers(sq as Square, color)
          .map((from) => ({ from, to: sq as Square })),
      ),
    };
  }
  const newlyDefended = Object.entries(beforePosition)
    .filter(
      ([sq, p]) =>
        p?.color === color &&
        p.type !== "k" &&
        sq !== move.from &&
        before.isAttacked(sq as Square, opposite(color)) &&
        !before.isAttacked(sq as Square, color) &&
        after.attackers(sq as Square, color).includes(move.to),
    )
    .sort((a, b) => values[b[1]!.type] - values[a[1]!.type])[0];
  if (newlyDefended) {
    const [sq, supported] = newlyDefended;
    return {
      title: center.includes(sq as Square)
        ? t("coach.explanation.supportCenter.title")
        : t("coach.explanation.defend.title", t(pieceNameKeys[supported!.type])),
      text: t(
        "coach.explanation.defend.text",
        piece,
        move.to,
        t(pieceNameKeys[supported!.type]),
        sq,
        piece,
      ),
      theme: "support",
      focus: boardFocus(
        t("coach.explanation.defend.focus", t(pieceNameKeys[supported!.type])),
        [{ from: move.to, to: sq as Square }],
      ),
    };
  }
  if (
    before.isAttacked(move.from, opposite(color)) &&
    !after.isAttacked(move.to, opposite(color))
  )
    return {
      title: t("coach.explanation.escapeAttack.title", piece),
      text: t(
        "coach.explanation.escapeAttack.text",
        piece,
        move.from,
        move.to,
      ),
      theme: "piece-safety",
      focus: boardFocus(t("coach.explanation.escapeAttack.focus", piece), [
        { from: move.from, to: move.to },
      ]),
    };
  if (targets[0] && values[targets[0][1]!.type] > values[move.piece])
    return {
      title: t("coach.explanation.attack.title", t(pieceNameKeys[targets[0][1]!.type])),
      text: t(
        "coach.explanation.attack.existing",
        piece,
        move.to,
        t(pieceNameKeys[targets[0][1]!.type]),
        targets[0][0],
      ),
      theme: "pressure",
      focus: boardFocus(
        t("coach.explanation.attack.focus", t(pieceNameKeys[targets[0][1]!.type])),
        [{ from: move.to, to: targets[0][0] as Square }],
      ),
    };
  if (targets[0]) {
    const [square, target] = targets[0];
    return {
      title: t("coach.explanation.attack.title", t(pieceNameKeys[target!.type])),
      text: t(
        "coach.explanation.attack.new",
        piece,
        move.to,
        t(pieceNameKeys[target!.type]),
        square,
      ),
      theme: "pressure",
      focus: boardFocus(
        t("coach.explanation.attack.focus", t(pieceNameKeys[target!.type])),
        [{ from: move.to, to: square as Square }],
      ),
    };
  }
  return explainActivity(after, move, t);
}

function explainForcingMove(
  before: Chess,
  after: Chess,
  move: Move,
  t: Translator = english,
): Explanation | null {
  const piece = t(pieceNameKeys[move.promotion ?? move.piece]);
  const king = Object.entries(positionOf(after)).find(
    ([, p]) => p?.type === "k" && p.color !== move.color,
  )?.[0] as Square;
  const checkers = after.isCheck() ? after.attackers(king, move.color) : [];
  const checkingPieces = checkers
    .map((square) => t("coach.piece.onSquare", t(pieceNameKeys[after.get(square)!.type]), square))
    .join(t("common.join.and"));
  const check = checkers.length
    ? t(
        checkers.length > 1
          ? "coach.explanation.check.plural"
          : "coach.explanation.check.singular",
        checkingPieces,
      )
    : "";
  const promotion = move.promotion
    ? t("coach.explanation.promotion.prefix", piece, move.to)
    : "";
  if (after.isCheckmate())
    return {
      title: t("coach.explanation.checkmate.title"),
      text: t(
        checkers.length > 1
          ? "coach.explanation.checkmate.plural"
          : "coach.explanation.checkmate.singular",
        promotion,
        checkingPieces,
      ),
      theme: "mate",
      focus: boardFocus(
        t("coach.explanation.checkmate.focus"),
        checkers.map((from) => ({ from, to: king })),
      ),
    };
  if (move.promotion)
    return {
      title: t("coach.explanation.promotion.title"),
      text: `${promotion.trim()} ${check || t("coach.explanation.promotion.text", piece)}`,
      theme: "promotion",
      focus: boardFocus(
        t("coach.explanation.promotion.focus"),
        checkers.map((from) => ({ from, to: king })),
        [move.to],
      ),
    };
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return {
      title: t("coach.explanation.castle.title"),
      text: t(
        "coach.explanation.castle.text",
        check ? ` ${check}` : "",
      ),
      theme: "king-safety",
      focus: boardFocus(t("coach.explanation.castle.focus"), [
        { from: move.from, to: move.to },
        {
          from: `${move.isKingsideCastle() ? "h" : "a"}${move.from[1]}` as Square,
          to: `${move.isKingsideCastle() ? "f" : "d"}${move.from[1]}` as Square,
        },
      ]),
    };
  if (before.inCheck())
    return {
      title: t("coach.explanation.escapeCheck.title"),
      text: t(
        "coach.explanation.escapeCheck.text",
        move.san,
        move.captured
          ? t(
              "coach.explanation.escapeCheck.capture",
              t(pieceNameKeys[move.captured]),
              capturedSquare(move),
            )
          : move.piece !== "k"
            ? t("coach.explanation.escapeCheck.block", piece)
            : t("coach.explanation.escapeCheck.kingMove", move.to),
        check
          ? ` ${check}`
          : t("coach.explanation.escapeCheck.safe"),
      ),
      theme: "check",
      focus: boardFocus(
        t("coach.explanation.escapeCheck.focus"),
        [{ from: move.from, to: move.to }],
        Object.entries(positionOf(after))
          .filter(([, p]) => p?.color === move.color && p.type === "k")
          .map(([sq]) => sq as Square),
      ),
    };
  if (move.captured)
    return {
      title: /[+#]/.test(move.san)
        ? t("coach.explanation.captureCheck.title")
        : t("coach.explanation.capture.title", t(pieceNameKeys[move.captured])),
      text: t(
        "coach.explanation.capture.text",
        piece,
        t(pieceNameKeys[move.captured]),
        capturedSquare(move),
        move.isEnPassant() ? t("coach.explanation.capture.enPassant") + move.to : "",
        check ||
          (after.isAttacked(move.to, opposite(move.color))
            ? t(
                "coach.explanation.capture.attacked",
                piece,
                move.to,
              )
            : t(
                "coach.explanation.capture.safe",
                piece,
                move.to,
              )),
      ),
      theme: "material",
      focus: boardFocus(
        t("coach.explanation.capture.focus"),
        [
          { from: move.from, to: move.to },
          ...after
            .attackers(move.to, opposite(move.color))
            .map((from) => ({ from, to: move.to })),
          ...checkers.map((from) => ({ from, to: king })),
        ],
        [capturedSquare(move)],
      ),
    };
  if (/[+#]/.test(move.san))
    return {
      title: t("coach.explanation.check.title"),
      text: t(
        "coach.explanation.check.text",
        check,
      ),
      theme: "forcing",
      focus: boardFocus(
        t("coach.explanation.check.focus"),
        checkers.map((from) => ({ from, to: king })),
      ),
    };
  return null;
}

function explainActivity(
  after: Chess,
  move: Move,
  t: Translator = english,
): Explanation {
  const piece = t(pieceNameKeys[move.piece]);
  const color = move.color;
  const direction = color === "w" ? 1 : -1;
  const develop =
    ["n", "b"].includes(move.piece) &&
    move.from[1] === (color === "w" ? "1" : "8");
  const controlled = center.filter((square) =>
    after.attackers(square, color).includes(move.to),
  );
  const centerReason = controlled.length
    ? t(
        "coach.explanation.develop.centerControl",
        controlled.join(t("common.join.and")),
      )
    : "";
  if (develop)
    return {
      title: t("coach.explanation.develop.title"),
      text: t(
        "coach.explanation.develop.text",
        piece,
        move.to,
        centerReason,
      ),
      theme: "development",
      focus: boardFocus(
        t("coach.explanation.develop.focus"),
        controlled.map((to) => ({ from: move.to, to })),
        [move.from, move.to],
      ),
    };
  if (move.piece === "p" && center.includes(move.to)) {
    const pawnAttacks = [-1, 1].map(
      (offset) =>
        `${String.fromCharCode(move.to.charCodeAt(0) + offset)}${Number(move.to[1]) + direction}` as Square,
    );
    return {
      title: t("coach.explanation.center.title"),
      text: t(
        "coach.explanation.center.text",
        move.to,
        pawnAttacks.join(t("common.join.and")),
      ),
      theme: "center",
      focus: boardFocus(
        t("coach.explanation.center.focus"),
        pawnAttacks.map((to) => ({ from: move.to, to })),
      ),
    };
  }
  if (move.piece === "r") {
    const filePawns = Object.entries(positionOf(after)).filter(
      ([square, p]) => square[0] === move.to[0] && p?.type === "p",
    );
    if (!filePawns.length)
      return {
        title: t("coach.explanation.openFile.title"),
        text: t(
          "coach.explanation.openFile.text",
          move.to[0],
        ),
        theme: "rook-activity",
        focus: boardFocus(
          t("coach.explanation.openFile.focus"),
          [],
          Array.from(
            { length: 8 },
            (_, i) => `${move.to[0]}${i + 1}` as Square,
          ),
        ),
      };
    return {
      title: t("coach.explanation.rook.title", move.to),
      text: "",
      theme: "rook-activity",
      focus: boardFocus(t("coach.explanation.rook.focus"), [
        { from: move.from, to: move.to },
      ]),
    };
  }
  if (move.piece === "k")
    return {
      title: t("coach.explanation.king.title", move.to),
      text: "",
      theme: "king-activity",
      focus: boardFocus(t("coach.explanation.king.focus"), [
        { from: move.from, to: move.to },
      ]),
    };
  if (
    move.piece === "p" &&
    Number(move.to[1]) * direction > Number(move.from[1]) * direction
  )
    return {
      title: t("coach.explanation.pawn.title", move.to),
      text: "",
      theme: "space",
      focus: boardFocus(t("coach.explanation.pawn.focus"), [
        { from: move.from, to: move.to },
      ]),
    };
  if (center.includes(move.to) || extendedCenter.includes(move.to))
    return {
      title: t("coach.explanation.nearCenter.title"),
      text: centerReason,
      theme: "piece-activity",
      focus: boardFocus(
        t("coach.explanation.nearCenter.focus"),
        controlled.map((to) => ({ from: move.to, to })),
        [move.from, move.to],
      ),
    };
  return {
    title: t("coach.explanation.reposition.title", piece, move.to),
    text: "",
    theme: "piece-activity",
    focus: boardFocus(t("coach.explanation.reposition.focus", piece), [
      { from: move.from, to: move.to },
    ]),
  };
}

export function describeReply(move: Move, t: Translator = english): string {
  if (move.san.endsWith("#"))
    return t(
      "coach.reply.checkmate",
      move.san,
      t(pieceNameKeys[move.promotion ?? move.piece]),
      move.to,
    );
  const action =
    move.isKingsideCastle() || move.isQueensideCastle()
      ? t(
          "coach.reply.castle",
          move.isKingsideCastle()
            ? t("chess.castling.kingside")
            : t("chess.castling.queenside"),
        )
      : move.captured
        ? t(
            "coach.reply.capture",
            t(pieceNameKeys[move.captured]),
            capturedSquare(move),
            move.isEnPassant() ? t("coach.reply.enPassant") : "",
            t(pieceNameKeys[move.piece]),
          )
        : t("coach.reply.move", t(pieceNameKeys[move.piece]), move.to);
  const promotion = move.promotion
    ? t("coach.reply.promotion", t(pieceNameKeys[move.promotion]))
    : "";
  const check = move.san.endsWith("+") ? t("coach.reply.check") : "";
  return t("coach.reply.summary", action, promotion, check, move.san);
}
