import {
  Chess,
  validateFen,
  type Color,
  type Move,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { fenNotice } from "./fenNotice.ts";
import {
  notice,
  NoticeError,
  noticeFromError,
  type Diagnostic,
  type Notice,
} from "../../i18n/notices.ts";
import {
  english,
  type MessageKey,
  type Translator,
} from "../../i18n/translate.ts";

export type Piece = { color: Color; type: PieceSymbol };
export type Position = Partial<Record<Square, Piece>>;
export const START_FEN = new Chess().fen();
export const pieceNameKeys = {
  p: "chess.piece.pawn",
  n: "chess.piece.knight",
  b: "chess.piece.bishop",
  r: "chess.piece.rook",
  q: "chess.piece.queen",
  k: "chess.piece.king",
} as const satisfies Record<PieceSymbol, MessageKey>;
export const opposite = (color: Color): Color => (color === "w" ? "b" : "w");
const sideKey = (color: Color) =>
  color === "w" ? "chess.side.white" : "chess.side.black";
const sideNotice = (color: Color) => notice(sideKey(color));
export const sideName = (color: Color, t: Translator = english) =>
  t(sideKey(color));
export const gameMoveLabel = (move: Move) =>
  `${move.before.split(" ")[5]}${move.color === "w" ? "." : "…"} ${move.san}`;
const castling = [
  { flag: "K", color: "w", king: "e1", rook: "h1" },
  { flag: "Q", color: "w", king: "e1", rook: "a1" },
  { flag: "k", color: "b", king: "e8", rook: "h8" },
  { flag: "q", color: "b", king: "e8", rook: "a8" },
] as const;

export function positionOf(game: Chess): Position {
  const position: Position = {};
  for (const rank of game.board())
    for (const piece of rank)
      if (piece)
        position[piece.square] = { color: piece.color, type: piece.type };
  return position;
}

export function pieceLimitError(position: Position): Notice | null {
  for (const color of ["w", "b"] as const) {
    const pieces = Object.values(position).filter(
      (piece) => piece?.color === color,
    );
    if (pieces.filter((piece) => piece?.type === "p").length > 8)
      return notice("position.error.pawnLimit", sideNotice(color));
    if (pieces.length > 16)
      return notice("position.error.pieceLimit", sideNotice(color));
  }
  return null;
}

/** Validate custom-position semantics beyond chess.js's syntactic FEN checks. */
export function checkedGame(input: string): Chess {
  const fields = input.trim().split(/\s+/);
  if (fields.length >= 2 && fields.length < 6) {
    const defaults = ["", "", "-", "-", "0", "1"];
    while (fields.length < 6) fields.push(defaults[fields.length]);
  }
  const fen = fields.join(" ");
  const validation = validateFen(fen);
  if (!validation.ok)
    throw new NoticeError(
      validation.error
        ? fenNotice(validation.error)
        : notice("position.error.invalidPosition"),
      validation.error,
    );
  const [placement, , rights, ep, counter] = fields;
  if (
    !fields
      .slice(4)
      .every(
        (field) => /^\d+$/.test(field) && Number.isSafeInteger(Number(field)),
      )
  )
    throw new NoticeError(notice("position.error.moveCounters"));
  if (
    rights !== "-" &&
    (!/^[KQkq]+$/.test(rights) || new Set(rights).size !== rights.length)
  )
    throw new NoticeError(notice("position.error.castlingRights"));
  if (placement.includes("0"))
    throw new NoticeError(
      notice("position.error.invalidFen", notice("position.fen.emptySquares")),
    );
  const game = new Chess(fen);
  const position = positionOf(game);
  const limit = pieceLimitError(position);
  if (limit) throw new NoticeError(limit);
  const previous = opposite(game.turn());
  const king = Object.entries(position).find(
    ([, piece]) => piece?.type === "k" && piece.color === previous,
  )![0] as Square;
  if (game.isAttacked(king, game.turn()))
    throw new NoticeError(
      notice(
        "position.error.inactiveKingInCheck",
        sideNotice(previous),
        sideNotice(game.turn()),
      ),
    );
  if (ep !== "-") {
    if (Number(counter) !== 0)
      throw new NoticeError(notice("position.error.enPassantCounter"));
    const pawn =
      position[`${ep[0]}${game.turn() === "w" ? "5" : "4"}` as Square];
    const origin = `${ep[0]}${game.turn() === "w" ? "7" : "2"}` as Square;
    if (
      position[ep as Square] ||
      position[origin] ||
      pawn?.type !== "p" ||
      pawn.color !== previous
    )
      throw new NoticeError(notice("position.error.enPassantPawn"));
  }
  for (const right of castling) {
    if (!rights.includes(right.flag)) continue;
    if (
      position[right.king]?.type !== "k" ||
      position[right.king]?.color !== right.color ||
      position[right.rook]?.type !== "r" ||
      position[right.rook]?.color !== right.color
    )
      throw new NoticeError(
        notice(
          "position.error.castlingPieces",
          right.flag,
          sideNotice(right.color),
        ),
      );
  }
  return game;
}

export function setupFen(position: Position, turn: Color, rights: string) {
  const rows = Array.from({ length: 8 }, (_, index) => {
    let row = "";
    let empty = 0;
    for (const file of "abcdefgh") {
      const piece = position[`${file}${8 - index}` as Square];
      if (!piece) {
        empty++;
        continue;
      }
      if (empty) row += empty;
      empty = 0;
      row += piece.color === "w" ? piece.type.toUpperCase() : piece.type;
    }
    return row + (empty || "");
  });
  return `${rows.join("/")} ${turn} ${rights || "-"} - 0 1`;
}

export function editPosition(
  position: Position,
  rights: string,
  square: Square,
  piece?: Piece,
  from?: Square,
) {
  if (from && (!piece || from === square)) return { position, rights };
  const next = { ...position };
  if (from) delete next[from];
  if (piece?.type === "k") {
    for (const existing of Object.keys(next) as Square[])
      if (next[existing]?.color === piece.color && next[existing]?.type === "k")
        delete next[existing];
  }
  if (piece) next[square] = { ...piece };
  else delete next[square];
  const touched = new Set([square, from]);
  const validRights = castling.filter(
    (right) =>
      rights.includes(right.flag) &&
      !touched.has(right.king) &&
      !touched.has(right.rook) &&
      !(piece?.type === "k" && piece.color === right.color),
  );
  return {
    position: next,
    rights: validRights.map((right) => right.flag).join(""),
  };
}

export function withTurn(fen: string, turn: Color) {
  const game = checkedGame(fen);
  if (game.turn() === turn) return game;
  const fields = game.fen().split(" ");
  fields[1] = turn;
  fields[3] = "-";
  return checkedGame(fields.join(" "));
}

export function arrangementIssue(
  position: Position,
  turn: Color,
  rights: string,
): Diagnostic | null {
  const kings = new Set(
    Object.values(position)
      .filter((piece) => piece?.type === "k")
      .map((piece) => piece!.color),
  );
  if (!kings.size) return null;
  if (kings.size === 1)
    return notice(
      "position.error.missingPlayableKing",
      sideNotice(kings.has("w") ? "b" : "w"),
    );
  if (
    Object.entries(position).some(
      ([square, piece]) =>
        piece?.type === "p" && ["1", "8"].includes(square[1]),
    )
  )
    return notice("position.error.pawnOnEdge");
  try {
    checkedGame(setupFen(position, turn, rights));
    return null;
  } catch (error) {
    const diagnostic = noticeFromError(
      error,
      notice("position.error.illegalArrangement"),
    );
    return typeof diagnostic !== "string" &&
      diagnostic.key === "position.error.invalidFen"
      ? (diagnostic.values[0] as Diagnostic)
      : diagnostic;
  }
}

export function ending(game: Chess, t: Translator = english): string | null {
  if (game.isCheckmate())
    return t("game.ending.checkmate", sideName(opposite(game.turn()), t));
  const draw = game.isStalemate()
    ? "game.ending.stalemate"
    : game.isThreefoldRepetition()
      ? "game.ending.repetition"
      : game.isInsufficientMaterial()
        ? "game.ending.insufficientMaterial"
        : game.isDrawByFiftyMoves()
          ? "game.ending.fiftyMoves"
          : null;
  return draw ? t(draw) : null;
}
export function gameOutcome(game: Chess) {
  const terminal = ending(game);
  return { terminal, drawn: terminal !== null && !game.isCheckmate() };
}
