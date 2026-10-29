import { notice, type Diagnostic, type Notice } from "../i18n/notices";
import type { MessageKey } from "../i18n/translate";

// chess.js exposes validation errors as text, so adapt them at the input boundary.
const fenKeys: Record<string, MessageKey> = {
  "must contain six space-delimited fields": "position.fen.fields",
  "move number must be a positive integer": "position.fen.moveNumber",
  "half move counter number must be a non-negative integer":
    "position.fen.halfMoveCounter",
  "en-passant square is invalid": "position.fen.enPassantSquare",
  "castling availability is invalid": "position.fen.castlingRights",
  "side-to-move is invalid": "position.fen.sideToMove",
  "piece data does not contain 8 '/'-delimited rows": "position.fen.rows",
  "piece data is invalid (consecutive number)":
    "position.fen.consecutiveNumbers",
  "piece data is invalid (invalid piece)": "position.fen.invalidPiece",
  "piece data is invalid (too many squares in rank)": "position.fen.rankSize",
  "illegal en-passant square": "position.fen.illegalEnPassant",
  "some pawns are on the edge rows": "position.fen.pawnOnEdge",
};

export function fenNotice(message: string): Notice {
  const detail = message.replace(/^Invalid FEN: /, "");
  let reason: Diagnostic = detail;
  if (Object.hasOwn(fenKeys, detail)) reason = notice(fenKeys[detail]);
  const king = detail.match(/^(missing|too many) (white|black) kings?$/);
  if (king)
    reason = notice(
      king[1] === "missing"
        ? "position.error.missingKing"
        : "position.error.tooManyKings",
      notice(king[2] === "white" ? "chess.side.white" : "chess.side.black"),
    );
  return notice("position.error.invalidFen", reason);
}
