import { translateNotice } from "../../src/i18n/notices";
import { english } from "../../src/i18n/translate";
import test from "node:test";
import assert from "node:assert/strict";
import { Chess, type Square } from "chess.js";
import {
  arrangementIssue,
  checkedGame,
  editPosition,
  ending,
  pieceLimitError,
  positionOf,
  setupFen,
  START_FEN,
  withTurn,
} from "../../src/chess/position";
import { watchOutFor } from "../../src/features/coach/warnings";

test("incomplete arrangements explain what is needed before play", () => {
  assert.equal(arrangementIssue({}, "w", ""), null);
  assert.equal(
    translateNotice(arrangementIssue({ e1: { color: "w", type: "k" } }, "w", ""), english),
    "Add the Black king to play or calculate.",
  );
  assert.equal(
    translateNotice(arrangementIssue({ e8: { color: "b", type: "k" } }, "b", ""), english),
    "Add the White king to play or calculate.",
  );
  const kings = {
    e1: { color: "w", type: "k" },
    e8: { color: "b", type: "k" },
  } as const;
  assert.equal(
    translateNotice(arrangementIssue({ ...kings, a1: { color: "w", type: "p" } }, "w", ""), english),
    "Move pawns off the first and last ranks to play or calculate.",
  );
});

test("arrangement guidance follows position legality and the chosen next player", () => {
  assert.equal(arrangementIssue(positionOf(new Chess()), "w", "KQkq"), null);
  const checkingPosition = positionOf(
    new Chess("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1"),
  );
  assert.match(
    translateNotice(arrangementIssue(checkingPosition, "w", ""), english),
    /Black king is in check.*White's turn/,
  );
  assert.equal(arrangementIssue(checkingPosition, "b", ""), null);
  assert.match(
    translateNotice(arrangementIssue(
      { e1: { color: "w", type: "k" }, e2: { color: "b", type: "k" } },
      "w",
      "",
    ), english),
    /king is in check/,
  );
});

test("free placement moves either color anywhere without changing the original board", () => {
  const initial = positionOf(new Chess());
  const first = editPosition(initial, "KQkq", "d5", initial.e2, "e2");
  const second = editPosition(
    first.position,
    first.rights,
    "d4",
    initial.e7,
    "e7",
  );
  assert.equal(first.position.e2, undefined);
  assert.deepEqual(first.position.d5, { type: "p", color: "w" });
  assert.deepEqual(second.position.d4, { type: "p", color: "b" });
  assert.equal(second.position.e7, undefined);
  assert.deepEqual(initial, positionOf(new Chess()));
  assert.equal(
    checkedGame(setupFen(second.position, "w", second.rights)).turn(),
    "w",
  );
});

test("free replacement and removal clear only the affected castling rights", () => {
  const initial = positionOf(new Chess());
  const replaced = editPosition(initial, "KQkq", "a8", initial.b1, "b1");
  assert.deepEqual(replaced.position.a8, { type: "n", color: "w" });
  assert.equal(replaced.rights, "KQk");
  const removed = editPosition(replaced.position, replaced.rights, "h1");
  assert.equal(removed.position.h1, undefined);
  assert.equal(removed.rights, "Qk");
  const king = editPosition(
    removed.position,
    removed.rights,
    "e4",
    initial.e1,
    "e1",
  );
  assert.equal(king.position.e1, undefined);
  assert.deepEqual(king.position.e4, { type: "k", color: "w" });
  assert.equal(king.rights, "k");
});

test("same-square placement is unchanged and invalid arrangements stay editable", () => {
  const initial = positionOf(new Chess());
  assert.deepEqual(editPosition(initial, "KQkq", "e1", initial.e1, "e1"), {
    position: initial,
    rights: "KQkq",
  });
  const invalid = editPosition(initial, "KQkq", "a8", initial.a2, "a2");
  assert.deepEqual(invalid.position.a8, { type: "p", color: "w" });
  assert.throws(() =>
    checkedGame(setupFen(invalid.position, "w", invalid.rights)),
  );
});

test("placing a king from a tray relocates its existing king and clears its castling rights", () => {
  const original = positionOf(new Chess());
  const edited = editPosition(original, "KQkq", "d4", {
    color: "w",
    type: "k",
  });
  assert.equal(edited.position.e1, undefined);
  assert.deepEqual(edited.position.d4, { color: "w", type: "k" });
  assert.equal(
    Object.values(edited.position).filter(
      (piece) => piece?.color === "w" && piece.type === "k",
    ).length,
    1,
  );
  assert.equal(edited.rights, "kq");
  assert.deepEqual(original.e1, { color: "w", type: "k" });
});

test("an empty board can be rebuilt from tray pieces before validation", () => {
  const white = editPosition({}, "", "e1", { color: "w", type: "k" });
  assert.throws(() => checkedGame(setupFen(white.position, "w", white.rights)));
  const black = editPosition(white.position, white.rights, "e8", {
    color: "b",
    type: "k",
  });
  const rebuilt = editPosition(black.position, black.rights, "d1", {
    color: "w",
    type: "q",
  });
  assert.equal(
    checkedGame(setupFen(rebuilt.position, "b", rebuilt.rights)).turn(),
    "b",
  );
  assert.deepEqual(white.position, { e1: { color: "w", type: "k" } });
});

test("piece limits apply to incomplete boards before either king is added", () => {
  for (const color of ["w", "b"] as const) {
    let position = {};
    for (const square of [
      "a2",
      "b2",
      "c2",
      "d2",
      "e2",
      "f2",
      "g2",
      "h2",
    ] as Square[])
      position = editPosition(position, "", square, {
        color,
        type: "p",
      }).position;
    assert.equal(pieceLimitError(position), null);
    const ninthPawn = editPosition(position, "", "a3", { color, type: "p" });
    assert.match(translateNotice(pieceLimitError(ninthPawn.position), english), /at most 8 pawns/);
  }
});

test("piece limits allow 16 pieces and promoted pieces but reject a seventeenth", () => {
  for (const color of ["w", "b"] as const) {
    const position = Object.fromEntries(
      [
        "a2",
        "b2",
        "c2",
        "d2",
        "e2",
        "f2",
        "g2",
        "h2",
        "a3",
        "b3",
        "c3",
        "d3",
        "e3",
        "f3",
        "g3",
        "h3",
      ].map((square) => [square, { color, type: "q" as const }]),
    );
    assert.equal(pieceLimitError(position), null);
    const extra = editPosition(position, "", "a4", { color, type: "n" });
    assert.match(translateNotice(pieceLimitError(extra.position), english), /at most 16 pieces/);
  }
});

test("replacement and relocation at the piece limit do not count as additions", () => {
  const position = positionOf(new Chess());
  const replaced = editPosition(position, "KQkq", "a2", {
    color: "w",
    type: "q",
  });
  assert.equal(pieceLimitError(replaced.position), null);
  const moved = editPosition(position, "KQkq", "a3", position.a2, "a2");
  assert.equal(pieceLimitError(moved.position), null);
  const extra = editPosition(position, "KQkq", "a3", { color: "w", type: "q" });
  assert.throws(
    () => checkedGame(setupFen(extra.position, "w", extra.rights)),
    /at most 16 pieces/,
  );
});

test("choosing the next player preserves pieces and castling rights", () => {
  const black = withTurn(START_FEN, "b");
  assert.equal(black.turn(), "b");
  assert.deepEqual(positionOf(black), positionOf(new Chess()));
  assert.equal(black.fen().split(" ")[2], "KQkq");
  assert.equal(withTurn(black.fen(), "w").fen(), START_FEN);
});

test("changing the next player clears the original side's en passant chance", () => {
  const fen = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2";
  assert.equal(withTurn(fen, "w").fen().split(" ")[3], "d6");
  assert.equal(withTurn(fen, "b").fen().split(" ")[3], "-");
});

test("the next player cannot leave the nonmoving king in check", () => {
  const fen = "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1";
  assert.equal(withTurn(fen, "b").turn(), "b");
  assert.throws(() => withTurn(fen, "w"), /check/i);
});

test("setup round-trips a position and preserves explicit castling rights", () => {
  const game = checkedGame(setupFen(positionOf(new Chess()), "w", "KQkq"));
  assert.equal(game.fen(), START_FEN);
  assert.equal(
    checkedGame(setupFen(positionOf(new Chess()), "b", "")).turn(),
    "b",
  );
});

test("setup rejects missing kings, back-rank pawns, adjacent kings and wrong turn in check", () => {
  for (const fen of [
    "8/8/8/8/8/8/8/8 w - - 0 1",
    "4k3/8/8/8/8/8/8/P3K3 w - - 0 1",
    "8/8/8/8/8/8/4k3/4K3 w - - 0 1",
    "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1",
  ])
    assert.throws(() => checkedGame(fen));
  assert.doesNotThrow(() => checkedGame("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1"));
});

test("setup rejects castling rights without a matching rook and king", () => {
  assert.throws(() => checkedGame("4k3/8/8/8/8/8/8/4K3 w K - 0 1"), /Castling/);
  assert.doesNotThrow(() => checkedGame("4k3/8/8/8/8/8/8/4K2R w K - 0 1"));
});

test("FEN import rejects impossible en passant metadata and accepts surrounding whitespace", () => {
  assert.throws(
    () => checkedGame("4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1"),
    /en passant/,
  );
  assert.equal(checkedGame(`  ${START_FEN}  `).fen(), START_FEN);
});

test("check, checkmate and drawn positions are identified", () => {
  const checked = checkedGame("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1");
  assert.match(watchOutFor(checked).text, /check/);
  const mate = checkedGame("7k/6Q1/5K2/8/8/8/8/8 b - - 0 1");
  assert.equal(ending(mate), "White wins by checkmate.");
  assert.match(
    ending(checkedGame("4k3/8/8/8/8/8/8/4K3 w - - 0 1"))!,
    /enough material/,
  );
  assert.equal(ending(new Chess()), null);
});
