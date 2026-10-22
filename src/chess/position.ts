import { english, type MessageKey, type Translator } from "../i18n/translate";
import {
  Chess,
  validateFen,
  type Color,
  type Move,
  type PieceSymbol,
  type Square,
} from "chess.js";

export type Position = Partial<
  Record<Square, { type: PieceSymbol; color: Color }>
>;
export const START_FEN = new Chess().fen();
export const pieceNameKeys = {
  p: "chess.piece.pawn",
  n: "chess.piece.knight",
  b: "chess.piece.bishop",
  r: "chess.piece.rook",
  q: "chess.piece.queen",
  k: "chess.piece.king",
} as const satisfies Record<PieceSymbol, MessageKey>;
export const sideName = (color: Color, t: Translator = english) =>
  t(color === "w" ? "chess.side.white" : "chess.side.black");
export const opposite = (color: Color): Color => (color === "w" ? "b" : "w");
export const gameMoveLabel = (move: Move) =>
  `${move.before.split(" ")[5]}${move.color === "w" ? "." : "…"} ${move.san}`;

export function positionOf(game: Chess): Position {
  return Object.fromEntries(
    game
      .board()
      .flat()
      .filter((p) => p !== null)
      .map((p) => [p.square, { type: p.type, color: p.color }]),
  );
}

export function withTurn(fen: string, turn: Color): Chess {
  const game = checkedGame(fen);
  if (game.turn() === turn) return game;
  const fields = game.fen().split(" ");
  fields[1] = turn;
  fields[3] = "-"; // An en passant chance belongs to the original side to move.
  return checkedGame(fields.join(" "));
}

export function setupFen(
  position: Position,
  turn: Color,
  rights: string,
): string {
  const rows = [];
  for (let rank = 8; rank >= 1; rank--) {
    let row = "",
      empty = 0;
    for (const file of "abcdefgh") {
      const piece = position[`${file}${rank}` as Square];
      if (!piece) {
        empty++;
        continue;
      }
      if (empty) {
        row += empty;
        empty = 0;
      }
      row += piece.color === "w" ? piece.type.toUpperCase() : piece.type;
    }
    if (empty) row += empty;
    rows.push(row);
  }
  return `${rows.join("/")} ${turn} ${rights || "-"} - 0 1`;
}

export function editPosition(
  position: Position,
  rights: string,
  square: Square,
  piece?: { type: PieceSymbol; color: Color },
  from?: Square,
): { position: Position; rights: string } {
  if (from && (!piece || from === square)) return { position, rights };
  const next = { ...position };
  if (from) delete next[from];
  if (piece) {
    if (piece.type === "k")
      for (const sq of Object.keys(next) as Square[])
        if (next[sq]?.type === "k" && next[sq]?.color === piece.color)
          delete next[sq];
    next[square] = piece;
  } else delete next[square];

  const touched = new Set([square, from]);
  const castlingSquares: Record<string, Square[]> = {
    K: ["e1", "h1"],
    Q: ["e1", "a1"],
    k: ["e8", "h8"],
    q: ["e8", "a8"],
  };
  return {
    position: next,
    rights: rights
      .split("")
      .filter(
        (flag) =>
          !(
            piece?.type === "k" &&
            (piece.color === "w") === (flag === flag.toUpperCase())
          ) && !(castlingSquares[flag] ?? []).some((sq) => touched.has(sq)),
      )
      .join(""),
  };
}

export function pieceLimitError(position: Position): string | null {
  for (const color of ["w", "b"] as Color[]) {
    const pieces = Object.values(position).filter(
      (piece) => piece?.color === color,
    );
    if (pieces.filter((piece) => piece?.type === "p").length > 8)
      return `${sideName(color)} can have at most 8 pawns. Remove one before adding another.`;
    if (pieces.length > 16)
      return `${sideName(color)} can have at most 16 pieces. Remove one before adding another.`;
  }
  return null;
}

export function arrangementIssue(
  position: Position,
  turn: Color,
  rights: string,
): string | null {
  const pieces = Object.values(position);
  const missing = (["w", "b"] as Color[]).filter(
    (color) =>
      !pieces.some((piece) => piece?.color === color && piece.type === "k"),
  );
  if (missing.length === 2) return "Add both kings to play or calculate.";
  if (missing.length === 1)
    return `Add the ${sideName(missing[0]).toLowerCase()} king to play or calculate.`;
  if (
    Object.entries(position).some(
      ([square, piece]) =>
        piece?.type === "p" && (square[1] === "1" || square[1] === "8"),
    )
  )
    return "Move pawns off the first and last ranks to play or calculate.";
  try {
    checkedGame(setupFen(position, turn, rights));
    return null;
  } catch (cause) {
    return cause instanceof Error
      ? cause.message.replace(/^Invalid FEN: /, "")
      : "Arrange a legal position to play or calculate.";
  }
}

export function checkedGame(fen: string): Chess {
  const fields = fen.trim().split(/\s+/);
  if (fields.length >= 2 && fields.length < 6)
    fields.push(...["-", "-", "0", "1"].slice(fields.length - 2));
  fen = fields.join(" ");
  const result = validateFen(fen);
  if (!result.ok)
    throw new Error(result.error ?? "This position is not valid.");
  const rights = fields[2];
  const ep = fields[3];
  if (
    fields
      .slice(4)
      .some(
        (value) => !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)),
      )
  ) {
    throw new Error(
      "The FEN’s move counters must be whole numbers within the supported range.",
    );
  }
  if (
    rights !== "-" &&
    (!/^[KQkq]+$/.test(rights) || new Set(rights).size !== rights.length)
  ) {
    throw new Error(
      "Castling availability must list each right (KQkq) once, or use “-” for none.",
    );
  }
  if (fields[0].includes("0")) {
    throw new Error("Invalid FEN: piece data must use 1–8 for empty squares.");
  }
  const game = new Chess(fen);
  const position = positionOf(game);
  const limitError = pieceLimitError(position);
  if (limitError) throw new Error(limitError);
  const previousSide = opposite(game.turn());
  const king = Object.entries(position).find(
    ([, piece]) => piece?.color === previousSide && piece.type === "k",
  )![0] as Square;
  if (game.isAttacked(king, game.turn())) {
    throw new Error(
      `The ${sideName(previousSide).toLowerCase()} king is in check, but it is ${sideName(game.turn())}'s turn. Change whose turn it is or move the king to safety.`,
    );
  }
  if (ep !== "-") {
    if (Number(fields[4]) !== 0) {
      throw new Error(
        "An en passant target needs a zero half-move counter because the last move was a pawn move.",
      );
    }
    const pawnSquare = `${ep[0]}${game.turn() === "w" ? "5" : "4"}` as Square;
    const originSquare = `${ep[0]}${game.turn() === "w" ? "7" : "2"}` as Square;
    if (
      position[ep as Square] ||
      position[originSquare] ||
      position[pawnSquare]?.type !== "p" ||
      position[pawnSquare]?.color !== opposite(game.turn())
    ) {
      throw new Error(
        "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.",
      );
    }
  }
  for (const [flag, kingSquare, rookSquare, color] of [
    ["K", "e1", "h1", "w"],
    ["Q", "e1", "a1", "w"],
    ["k", "e8", "h8", "b"],
    ["q", "e8", "a8", "b"],
  ] as const) {
    if (
      rights.includes(flag) &&
      (position[kingSquare]?.type !== "k" ||
        position[kingSquare]?.color !== color ||
        position[rookSquare]?.type !== "r" ||
        position[rookSquare]?.color !== color)
    ) {
      throw new Error(
        `Castling right ${flag} needs the ${sideName(color).toLowerCase()} king and rook on their original squares.`,
      );
    }
  }
  return game;
}

export function ending(game: Chess, t: Translator = english): string | null {
  if (game.isCheckmate())
    return t("game.ending.checkmate", sideName(opposite(game.turn()), t));
  if (game.isStalemate())
    return t("game.ending.stalemate");
  if (game.isThreefoldRepetition()) return t("game.ending.repetition");
  if (game.isInsufficientMaterial())
    return t("game.ending.insufficientMaterial");
  if (game.isDrawByFiftyMoves()) return t("game.ending.fiftyMoves");
  return null;
}

export function gameOutcome(game: Chess) {
  const terminal = ending(game);
  return { terminal, drawn: terminal !== null && !game.isCheckmate() };
}
