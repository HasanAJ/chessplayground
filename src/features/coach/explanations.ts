import { english, type Translator } from "../../i18n/translate";
import { Chess, type Move, type Square } from "chess.js";
import { names, opposite, positionOf } from "../../chess/position";
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
  const piece = t(names[move.piece]),
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
      title: t("Build pressure on {0}", sq),
      text: t(
        "Your {0} joins another piece in attacking their {1} on {2}. They now have more than one attacker to deal with.",
        piece,
        t(names[target!.type]),
        sq,
      ),
      theme: "pressure",
      focus: boardFocus(
        t("See the attack on their {0}", t(names[target!.type])),
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
        ? t("Support your center")
        : t("Defend your {0}", t(names[supported!.type])),
      text: t(
        "Your {0} on {1} now defends the {2} on {3}. If they capture it, your {4} may be able to capture back; check the reply before trading.",
        piece,
        move.to,
        t(names[supported!.type]),
        sq,
        piece,
      ),
      theme: "support",
      focus: boardFocus(
        t("See the defense of your {0}", t(names[supported!.type])),
        [{ from: move.to, to: sq as Square }],
      ),
    };
  }
  if (
    before.isAttacked(move.from, opposite(color)) &&
    !after.isAttacked(move.to, opposite(color))
  )
    return {
      title: t("Move your {0} out of danger", piece),
      text: t(
        "Your {0} was under attack on {1}. On {2}, none of their pieces currently attack it.",
        piece,
        move.from,
        move.to,
      ),
      theme: "piece-safety",
      focus: boardFocus(t("See your {0} move out of danger", piece), [
        { from: move.from, to: move.to },
      ]),
    };
  if (targets[0] && values[targets[0][1]!.type] > values[move.piece])
    return {
      title: t("Attack the {0}", t(names[targets[0][1]!.type])),
      text: t(
        "Your {0} on {1} attacks their {2} on {3}. Watch for a retreat, a defense, or a threat of their own.",
        piece,
        move.to,
        t(names[targets[0][1]!.type]),
        targets[0][0],
      ),
      theme: "pressure",
      focus: boardFocus(
        t("See the attack on their {0}", t(names[targets[0][1]!.type])),
        [{ from: move.to, to: targets[0][0] as Square }],
      ),
    };
  if (targets[0]) {
    const [square, target] = targets[0];
    return {
      title: t("Attack the {0}", t(names[target!.type])),
      text: t(
        "Your {0} on {1} now attacks their {2} on {3}. They may move it or defend it, so look at the reply before counting on a capture.",
        piece,
        move.to,
        t(names[target!.type]),
        square,
      ),
      theme: "pressure",
      focus: boardFocus(
        t("See the attack on their {0}", t(names[target!.type])),
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
  const piece = t(names[move.promotion ?? move.piece]);
  const king = Object.entries(positionOf(after)).find(
    ([, p]) => p?.type === "k" && p.color !== move.color,
  )?.[0] as Square;
  const checkers = after.isCheck() ? after.attackers(king, move.color) : [];
  const checkingPieces = checkers
    .map((square) => t("{0} on {1}", t(names[after.get(square)!.type]), square))
    .join(t(" and "));
  const check = checkers.length
    ? t(
        checkers.length > 1 ? "Your {0} give check." : "Your {0} gives check.",
        checkingPieces,
      )
    : "";
  const promotion = move.promotion
    ? t("Your pawn promotes to a {0} on {1}. ", piece, move.to)
    : "";
  if (after.isCheckmate())
    return {
      title: t("Finish with checkmate"),
      text: t(
        checkers.length > 1
          ? "{0}Your {1} deliver checkmate. Their king has no way out."
          : "{0}Your {1} delivers checkmate. Their king has no way out.",
        promotion,
        checkingPieces,
      ),
      theme: "mate",
      focus: boardFocus(
        t("See the checkmate"),
        checkers.map((from) => ({ from, to: king })),
      ),
    };
  if (move.promotion)
    return {
      title: t("Promote your pawn"),
      text: `${promotion.trim()} ${check || t("You now have a {0} in place of that pawn. Look at the reply to see how they respond.", piece)}`,
      theme: "promotion",
      focus: boardFocus(
        t("See the promotion"),
        checkers.map((from) => ({ from, to: king })),
        [move.to],
      ),
    };
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return {
      title: t("Castle and bring your rook into play"),
      text: t(
        "Castling moves your king away from the center and brings your rook toward the middle.{0}",
        check ? ` ${check}` : "",
      ),
      theme: "king-safety",
      focus: boardFocus(t("See the king and rook move"), [
        { from: move.from, to: move.to },
        {
          from: `${move.isKingsideCastle() ? "h" : "a"}${move.from[1]}` as Square,
          to: `${move.isKingsideCastle() ? "f" : "d"}${move.from[1]}` as Square,
        },
      ]),
    };
  if (before.inCheck())
    return {
      title: t("Get your king out of check"),
      text: t(
        "{0} gets you out of check{1}.{2}",
        move.san,
        move.captured
          ? t(
              " and takes the {0} on {1}",
              t(names[move.captured]),
              capturedSquare(move),
            )
          : move.piece !== "k"
            ? t(" by blocking the attack with your {0}", piece)
            : t(" by moving your king to {0}", move.to),
        check
          ? ` ${check}`
          : t(
              " Your king is no longer under attack, so you can continue playing.",
            ),
      ),
      theme: "check",
      focus: boardFocus(
        t("See how you escape check"),
        [{ from: move.from, to: move.to }],
        Object.entries(positionOf(after))
          .filter(([, p]) => p?.color === move.color && p.type === "k")
          .map(([sq]) => sq as Square),
      ),
    };
  if (move.captured)
    return {
      title: /[+#]/.test(move.san)
        ? t("Capture with check")
        : t("Capture the {0}", t(names[move.captured])),
      text: t(
        "Your {0} takes the {1} on {2}{3}. {4}",
        piece,
        t(names[move.captured]),
        capturedSquare(move),
        move.isEnPassant() ? t(" en passant, landing on ") + move.to : "",
        check ||
          (after.isAttacked(move.to, opposite(move.color))
            ? t(
                "Their pieces attack your {0} on {1}; preview the reply to check whether they capture back.",
                piece,
                move.to,
              )
            : t(
                "None of their pieces currently attack your {0} on {1}.",
                piece,
                move.to,
              )),
      ),
      theme: "material",
      focus: boardFocus(
        t("See the capture and possible attackers"),
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
      title: t("Give check"),
      text: t(
        "{0} Your opponent has to deal with the attack on their king.",
        check,
      ),
      theme: "forcing",
      focus: boardFocus(
        t("See the attack on their king"),
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
  const piece = t(names[move.piece]);
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
        "From here, it attacks {0}, helping you control the center.",
        controlled.join(t(" and ")),
      )
    : t(
        "Bringing pieces off the starting row gives you more pieces to use in your next moves.",
      );
  if (develop)
    return {
      title: t("Bring another piece into play"),
      text: t(
        "Your {0} comes off the back rank to {1}. {2}",
        piece,
        move.to,
        centerReason,
      ),
      theme: "development",
      focus: boardFocus(
        t("See your piece and the center squares"),
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
      title: t("Claim the center"),
      text: t(
        "Your pawn takes space in the center on {0}. It attacks {1}, helping limit where their pieces can move safely.",
        move.to,
        pawnAttacks.join(t(" and ")),
      ),
      theme: "center",
      focus: boardFocus(
        t("See the pawn’s control of the center"),
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
        title: t("Put your rook on an open file"),
        text: t(
          "There are no pawns on the {0}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.",
          move.to[0],
        ),
        theme: "rook-activity",
        focus: boardFocus(
          t("See the open file"),
          [],
          Array.from(
            { length: 8 },
            (_, i) => `${move.to[0]}${i + 1}` as Square,
          ),
        ),
      };
    return {
      title: t("Improve your rook’s position"),
      text: t(
        "Try your rook on {0}. Play through the reply below to see which lines and targets it can work with.",
        move.to,
      ),
      theme: "rook-activity",
      focus: boardFocus(t("See your rook’s move"), [
        { from: move.from, to: move.to },
      ]),
    };
  }
  if (move.piece === "k")
    return {
      title: t("Improve your king’s position"),
      text: t(
        "Your king steps from {0} to {1}. Check what their pieces can do before choosing its next square.",
        move.from,
        move.to,
      ),
      theme: "king-activity",
      focus: boardFocus(t("See your king’s move"), [
        { from: move.from, to: move.to },
      ]),
    };
  if (
    move.piece === "p" &&
    Number(move.to[1]) * direction > Number(move.from[1]) * direction
  )
    return {
      title: t("Gain space with your pawn"),
      text: t(
        "Your pawn moves up to {0}, claiming more space. Keep an eye on the squares it leaves behind.",
        move.to,
      ),
      theme: "space",
      focus: boardFocus(t("See your pawn’s advance"), [
        { from: move.from, to: move.to },
      ]),
    };
  if (center.includes(move.to) || extendedCenter.includes(move.to))
    return {
      title: t("Improve a piece near the center"),
      text: t(
        "Your {0} moves to {1}, near the center. {2}",
        piece,
        move.to,
        controlled.length
          ? centerReason
          : t(
              "Preview the reply to see how they can respond before choosing its next move.",
            ),
      ),
      theme: "piece-activity",
      focus: boardFocus(
        t("See the move near the center"),
        controlled.map((to) => ({ from: move.to, to })),
        [move.from, move.to],
      ),
    };
  return {
    title: t("Reposition your {0}", piece),
    text: t(
      "Try your {0} on {1}. Play through the next few moves to see how your opponent can respond and where your pieces end up.",
      piece,
      move.to,
    ),
    theme: "piece-activity",
    focus: boardFocus(t("See your {0}’s move", piece), [
      { from: move.from, to: move.to },
    ]),
  };
}

export function describeReply(move: Move, t: Translator = english): string {
  if (move.san.endsWith("#"))
    return t(
      "They can checkmate with {0} ({1} to {2}).",
      move.san,
      t(names[move.promotion ?? move.piece]),
      move.to,
    );
  const action =
    move.isKingsideCastle() || move.isQueensideCastle()
      ? t(
          "castle {0}",
          move.isKingsideCastle() ? t("kingside") : t("queenside"),
        )
      : move.captured
        ? t(
            "take your {0} on {1}{2} with their {3}",
            t(names[move.captured]),
            capturedSquare(move),
            move.isEnPassant() ? t(" en passant") : "",
            t(names[move.piece]),
          )
        : t("move their {0} to {1}", t(names[move.piece]), move.to);
  const promotion = move.promotion
    ? t(" and promote to a {0}", t(names[move.promotion]))
    : "";
  const check = move.san.endsWith("+") ? t(" and give check") : "";
  return t("They may {0}{1}{2} ({3}).", action, promotion, check, move.san);
}
