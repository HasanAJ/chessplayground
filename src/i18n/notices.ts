import type { Message, Translator } from "./translate";

// These notices are retained as English diagnostics in game state. Translate at
// display time so an already visible validation error follows language changes.
export function translateNotice(source: string, t: Translator): string {
  const fenPrefix = "Invalid FEN: ";
  if (source.startsWith(fenPrefix))
    return t(
      "Invalid FEN: {0}",
      translateNotice(source.slice(fenPrefix.length), t),
    );
  const patterns: [RegExp, Message][] = [
    [
      /^(White|Black) can have at most 8 pawns\. Remove one before adding another\.$/,
      "{0} can have at most 8 pawns. Remove one before adding another.",
    ],
    [
      /^(White|Black) can have at most 16 pieces\. Remove one before adding another\.$/,
      "{0} can have at most 16 pieces. Remove one before adding another.",
    ],
    [
      /^Add the (white|black) king to play or calculate\.$/,
      "Add the {0} king to play or calculate.",
    ],
    [
      /^The (white|black) king is in check, but it is (White|Black)'s turn\. Change whose turn it is or move the king to safety\.$/,
      "The {0} king is in check, but it is {1}'s turn. Change whose turn it is or move the king to safety.",
    ],
    [
      /^Castling right ([KQkq]) needs the (white|black) king and rook on their original squares\.$/,
      "Castling right {0} needs the {1} king and rook on their original squares.",
    ],
    [/^missing (white|black) king$/, "Missing {0} king."],
    [/^too many (white|black) kings$/, "Too many {0} kings."],
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
              ? t(value.toLowerCase() === "white" ? "White" : "Black")
              : value,
          ),
      );
  }
  return t(source as Message);
}
