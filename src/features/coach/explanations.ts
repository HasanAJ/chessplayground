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
): Explanation {
  const piece = names[move.piece],
    color = move.color;
  const forcing = explainForcingMove(before, after, move);
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
      title: `Build pressure on ${sq}`,
      text: `Your ${piece} joins another piece in attacking their ${names[target!.type]} on ${sq}. They now have more than one attacker to deal with.`,
      theme: "pressure",
      focus: boardFocus(
        `See the attack on their ${names[target!.type]}`,
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
        ? "Support your center"
        : `Defend your ${names[supported!.type]}`,
      text: `Your ${piece} on ${move.to} now defends the ${names[supported!.type]} on ${sq}. If they capture it, your ${piece} may be able to capture back; check the reply before trading.`,
      theme: "support",
      focus: boardFocus(`See the defense of your ${names[supported!.type]}`, [
        { from: move.to, to: sq as Square },
      ]),
    };
  }
  if (
    before.isAttacked(move.from, opposite(color)) &&
    !after.isAttacked(move.to, opposite(color))
  )
    return {
      title: `Move your ${piece} out of danger`,
      text: `Your ${piece} was under attack on ${move.from}. On ${move.to}, none of their pieces currently attack it.`,
      theme: "piece-safety",
      focus: boardFocus(`See your ${piece} move out of danger`, [
        { from: move.from, to: move.to },
      ]),
    };
  if (targets[0] && values[targets[0][1]!.type] > values[move.piece])
    return {
      title: `Attack the ${names[targets[0][1]!.type]}`,
      text: `Your ${piece} on ${move.to} attacks their ${names[targets[0][1]!.type]} on ${targets[0][0]}. Watch for a retreat, a defense, or a threat of their own.`,
      theme: "pressure",
      focus: boardFocus(
        `See the attack on their ${names[targets[0][1]!.type]}`,
        [{ from: move.to, to: targets[0][0] as Square }],
      ),
    };
  if (targets[0]) {
    const [square, target] = targets[0];
    return {
      title: `Attack the ${names[target!.type]}`,
      text: `Your ${piece} on ${move.to} now attacks their ${names[target!.type]} on ${square}. They may move it or defend it, so look at the reply before counting on a capture.`,
      theme: "pressure",
      focus: boardFocus(`See the attack on their ${names[target!.type]}`, [
        { from: move.to, to: square as Square },
      ]),
    };
  }
  return explainActivity(after, move);
}

function explainForcingMove(
  before: Chess,
  after: Chess,
  move: Move,
): Explanation | null {
  const piece = names[move.promotion ?? move.piece];
  const king = Object.entries(positionOf(after)).find(
    ([, p]) => p?.type === "k" && p.color !== move.color,
  )?.[0] as Square;
  const checkers = after.isCheck() ? after.attackers(king, move.color) : [];
  const checkingPieces = checkers
    .map((square) => `${names[after.get(square)!.type]} on ${square}`)
    .join(" and ");
  const check = checkers.length
    ? `Your ${checkingPieces} ${checkers.length > 1 ? "give" : "gives"} check.`
    : "";
  const promotion = move.promotion
    ? `Your pawn promotes to a ${piece} on ${move.to}. `
    : "";
  if (after.isCheckmate())
    return {
      title: "Finish with checkmate",
      text: `${promotion}Your ${checkingPieces} ${checkers.length > 1 ? "deliver" : "delivers"} checkmate. Their king has no way out.`,
      theme: "mate",
      focus: boardFocus(
        "See the checkmate",
        checkers.map((from) => ({ from, to: king })),
      ),
    };
  if (move.promotion)
    return {
      title: "Promote your pawn",
      text: `${promotion.trim()} ${check || `You now have a ${piece} in place of that pawn. Look at the reply to see how they respond.`}`,
      theme: "promotion",
      focus: boardFocus(
        "See the promotion",
        checkers.map((from) => ({ from, to: king })),
        [move.to],
      ),
    };
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return {
      title: "Castle and bring your rook into play",
      text: `Castling moves your king away from the center and brings your rook toward the middle.${check ? ` ${check}` : ""}`,
      theme: "king-safety",
      focus: boardFocus("See the king and rook move", [
        { from: move.from, to: move.to },
        {
          from: `${move.isKingsideCastle() ? "h" : "a"}${move.from[1]}` as Square,
          to: `${move.isKingsideCastle() ? "f" : "d"}${move.from[1]}` as Square,
        },
      ]),
    };
  if (before.inCheck())
    return {
      title: "Get your king out of check",
      text: `${move.san} gets you out of check${move.captured ? ` and takes the ${names[move.captured]} on ${capturedSquare(move)}` : move.piece !== "k" ? ` by blocking the attack with your ${piece}` : ` by moving your king to ${move.to}`}.${check ? ` ${check}` : " Your king is no longer under attack, so you can continue playing."}`,
      theme: "check",
      focus: boardFocus(
        "See how you escape check",
        [{ from: move.from, to: move.to }],
        Object.entries(positionOf(after))
          .filter(([, p]) => p?.color === move.color && p.type === "k")
          .map(([sq]) => sq as Square),
      ),
    };
  if (move.captured)
    return {
      title: /[+#]/.test(move.san)
        ? "Capture with check"
        : `Capture the ${names[move.captured]}`,
      text: `Your ${piece} takes the ${names[move.captured]} on ${capturedSquare(move)}${move.isEnPassant() ? " en passant, landing on " + move.to : ""}. ${check || (after.isAttacked(move.to, opposite(move.color)) ? `Their pieces attack your ${piece} on ${move.to}; preview the reply to check whether they capture back.` : `None of their pieces currently attack your ${piece} on ${move.to}.`)}`,
      theme: "material",
      focus: boardFocus(
        "See the capture and possible attackers",
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
      title: "Give check",
      text: `${check} Your opponent has to deal with the attack on their king.`,
      theme: "forcing",
      focus: boardFocus(
        "See the attack on their king",
        checkers.map((from) => ({ from, to: king })),
      ),
    };
  return null;
}

function explainActivity(after: Chess, move: Move): Explanation {
  const piece = names[move.piece];
  const color = move.color;
  const direction = color === "w" ? 1 : -1;
  const develop =
    ["n", "b"].includes(move.piece) &&
    move.from[1] === (color === "w" ? "1" : "8");
  const controlled = center.filter((square) =>
    after.attackers(square, color).includes(move.to),
  );
  const centerReason = controlled.length
    ? `From here, it attacks ${controlled.join(" and ")}, helping you control the center.`
    : "Bringing pieces off the starting row gives you more pieces to use in your next moves.";
  if (develop)
    return {
      title: "Bring another piece into play",
      text: `Your ${piece} comes off the back rank to ${move.to}. ${centerReason}`,
      theme: "development",
      focus: boardFocus(
        "See your piece and the center squares",
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
      title: "Claim the center",
      text: `Your pawn takes space in the center on ${move.to}. It attacks ${pawnAttacks.join(" and ")}, helping limit where their pieces can move safely.`,
      theme: "center",
      focus: boardFocus(
        "See the pawn’s control of the center",
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
        title: "Put your rook on an open file",
        text: `There are no pawns on the ${move.to[0]}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.`,
        theme: "rook-activity",
        focus: boardFocus(
          "See the open file",
          [],
          Array.from(
            { length: 8 },
            (_, i) => `${move.to[0]}${i + 1}` as Square,
          ),
        ),
      };
    return {
      title: "Improve your rook’s position",
      text: `Try your rook on ${move.to}. Play through the reply below to see which lines and targets it can work with.`,
      theme: "rook-activity",
      focus: boardFocus("See your rook’s move", [
        { from: move.from, to: move.to },
      ]),
    };
  }
  if (move.piece === "k")
    return {
      title: "Improve your king’s position",
      text: `Your king steps from ${move.from} to ${move.to}. Check what their pieces can do before choosing its next square.`,
      theme: "king-activity",
      focus: boardFocus("See your king’s move", [
        { from: move.from, to: move.to },
      ]),
    };
  if (
    move.piece === "p" &&
    Number(move.to[1]) * direction > Number(move.from[1]) * direction
  )
    return {
      title: "Gain space with your pawn",
      text: `Your pawn moves up to ${move.to}, claiming more space. Keep an eye on the squares it leaves behind.`,
      theme: "space",
      focus: boardFocus("See your pawn’s advance", [
        { from: move.from, to: move.to },
      ]),
    };
  if (center.includes(move.to) || extendedCenter.includes(move.to))
    return {
      title: "Improve a piece near the center",
      text: `Your ${piece} moves to ${move.to}, near the center. ${controlled.length ? centerReason : "Preview the reply to see how they can respond before choosing its next move."}`,
      theme: "piece-activity",
      focus: boardFocus(
        "See the move near the center",
        controlled.map((to) => ({ from: move.to, to })),
        [move.from, move.to],
      ),
    };
  return {
    title: `Reposition your ${piece}`,
    text: `Try your ${piece} on ${move.to}. Play through the next few moves to see how your opponent can respond and where your pieces end up.`,
    theme: "piece-activity",
    focus: boardFocus(`See your ${piece}’s move`, [
      { from: move.from, to: move.to },
    ]),
  };
}

export function describeReply(move: Move): string {
  if (move.san.endsWith("#"))
    return `They can checkmate with ${move.san} (${names[move.promotion ?? move.piece]} to ${move.to}).`;
  const action =
    move.isKingsideCastle() || move.isQueensideCastle()
      ? `castle ${move.isKingsideCastle() ? "kingside" : "queenside"}`
      : move.captured
        ? `take your ${names[move.captured]} on ${capturedSquare(move)}${move.isEnPassant() ? " en passant" : ""} with their ${names[move.piece]}`
        : `move their ${names[move.piece]} to ${move.to}`;
  const promotion = move.promotion
    ? ` and promote to a ${names[move.promotion]}`
    : "";
  const check = move.san.endsWith("+") ? " and give check" : "";
  return `They may ${action}${promotion}${check} (${move.san}).`;
}
