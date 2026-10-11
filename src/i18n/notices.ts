import type { MessageKey, Translator } from "./translate";

// Raw diagnostics from chess validation, the engine, and saved game state remain
// English. Map them explicitly so editing interface copy cannot change their identity.
const noticeKeys: Record<string, MessageKey> = {
  "The chess engine could not load. Check your connection and retry analysis.":
    "engine.error.load",
  "The engine took too long to load. Try analyzing the position again.":
    "engine.error.loadTimeout",
  "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.":
    "engine.error.start",
  "The engine took too long to respond. Try analyzing the position again.":
    "engine.error.responseTimeout",
  "No complete analysis was returned. Try this position again.":
    "engine.error.incompleteAnalysis",
  "Add both kings to play or calculate.": "position.error.missingBothKings",
  "Move pawns off the first and last ranks to play or calculate.":
    "position.error.pawnOnEdge",
  "Arrange a legal position to play or calculate.":
    "position.error.illegalArrangement",
  "This position is not valid.": "position.error.invalidPosition",
  "The FEN’s move counters must be whole numbers within the supported range.":
    "position.error.moveCounters",
  "Castling availability must list each right (KQkq) once, or use “-” for none.":
    "position.error.castlingRights",
  "An en passant target needs a zero half-move counter because the last move was a pawn move.":
    "position.error.enPassantCounter",
  "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.":
    "position.error.enPassantPawn",
  "The move needs analysis of the resulting position.":
    "coach.review.error.needsAnalysis",
  "The engine returned no legal candidates. Please retry analysis.":
    "engine.error.noLegalCandidates",
  "The engine could not review this move. Try again.":
    "coach.review.error.failed",
  "The engine could not reliably compare this move. Try again.":
    "coach.review.error.comparison",
  "The engine could not check the reply. Try again.":
    "coach.review.error.reply",
  "Your computer difficulty could not be saved in this browser.":
    "computer.error.saveDifficulty",
  "Starting position": "game.history.startingPosition",
  "Browser storage is unavailable or full. Your latest changes may not survive a reload.":
    "game.save.error.unavailable",
  "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.":
    "game.save.error.backup",
  "Continuing from the selected position.": "game.status.continuing",
  "This FEN is not valid.": "position.error.invalidInput",
  "Clipboard access is unavailable. Select the FEN text and copy it manually.":
    "position.error.clipboard",
  "Browser storage could not be read. Your saved game may be unavailable.":
    "game.save.error.readStorage",
  "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.":
    "game.save.error.restoredPosition",
  "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.":
    "game.save.error.freshBoard",
  "Recovery backup could not be verified.": "game.save.error.verifyBackup",
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
  "Position loaded": "position.notice.loaded",
  "Position copied": "position.notice.copied",
  "piece data must use 1–8 for empty squares.": "position.fen.emptySquares",
};

// These notices are retained as English diagnostics in game state. Translate at
// display time so an already visible validation error follows language changes.
export function translateNotice(source: string, t: Translator): string {
  const fenPrefix = "Invalid FEN: ";
  if (source.startsWith(fenPrefix))
    return t(
      "position.error.invalidFen",
      translateNotice(source.slice(fenPrefix.length), t),
    );
  const patterns: [RegExp, MessageKey][] = [
    [
      /^(White|Black) can have at most 8 pawns\. Remove one before adding another\.$/,
      "position.error.pawnLimit",
    ],
    [
      /^(White|Black) can have at most 16 pieces\. Remove one before adding another\.$/,
      "position.error.pieceLimit",
    ],
    [
      /^Add the (white|black) king to play or calculate\.$/,
      "position.error.missingPlayableKing",
    ],
    [
      /^The (white|black) king is in check, but it is (White|Black)'s turn\. Change whose turn it is or move the king to safety\.$/,
      "position.error.inactiveKingInCheck",
    ],
    [
      /^Castling right ([KQkq]) needs the (white|black) king and rook on their original squares\.$/,
      "position.error.castlingPieces",
    ],
    [/^missing (white|black) king$/, "position.error.missingKing"],
    [/^too many (white|black) kings$/, "position.error.tooManyKings"],
  ];
  for (const [pattern, message] of patterns) {
    const match = source.match(pattern);
    if (match)
      return t(
        message,
        ...match
          .slice(1)
          .map((value) =>
            /^(white|black)$/i.test(value)
              ? t(
                  value.toLowerCase() === "white"
                    ? "chess.side.white"
                    : "chess.side.black",
                )
              : value,
          ),
      );
  }
  return Object.hasOwn(noticeKeys, source) ? t(noticeKeys[source]) : source;
}
