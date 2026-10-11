import test from "node:test";
import assert from "node:assert/strict";
import { checkedGame, ending } from "../../src/chess/position";

const CASTLING_FEN = "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 37 42";

test("short FEN imports accept board, side and castling rights", () => {
  const short = "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq";
  const game = checkedGame(` \n${short.split(" ").join("  \t")}\n `);
  assert.equal(game.fen(), `${short} - 0 1`);
  assert.deepEqual(game.get("f4"), { type: "p", color: "w" });
  assert.equal(game.turn(), "b");
});

test("short FEN imports fill only omitted trailing fields", () => {
  const [board] = CASTLING_FEN.split(" ");
  for (const [suffix, complete] of [
    ["b", "b - - 0 1"],
    ["b KQkq", "b KQkq - 0 1"],
    ["b KQkq -", "b KQkq - 0 1"],
    ["b KQkq - 37", "b KQkq - 37 1"],
  ])
    assert.equal(
      checkedGame(`${board} ${suffix}`).fen(),
      `${board} ${complete}`,
    );
});

test("short FEN imports retain supplied en passant rights", () => {
  const game = checkedGame("4k3/8/8/3pP3/8/8/8/4K3 w - d6");
  assert.equal(game.fen(), "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1");
  assert.equal(game.move("exd6").flags, "e");
});

test("short FEN imports still reject invalid supplied fields and field counts", () => {
  const [board] = CASTLING_FEN.split(" ");
  for (const suffix of ["b KQkq - 1.5", "b KKQkq", "b KQkq z6", "x KQkq"])
    assert.throws(() => checkedGame(`${board} ${suffix}`));
  for (const fen of ["", board, `${CASTLING_FEN} extra`])
    assert.throws(() => checkedGame(fen), /six.*fields/i);
});

test("FEN import retains all fields and permits castling for either side", () => {
  for (const side of ["w", "b"] as const) {
    const fen = CASTLING_FEN.replace(" b ", ` ${side} `);
    const game = checkedGame(fen);
    assert.equal(game.fen(), fen);
    const move = game.move("O-O");
    assert.equal(move.flags, "k");
    assert.equal(game.get(side === "w" ? "g1" : "g8")?.type, "k");
    assert.equal(game.get(side === "w" ? "f1" : "f8")?.type, "r");
    assert.equal(game.fen().split(" ")[5], side === "w" ? "42" : "43");
  }
});

test("FEN import retains and plays en passant for White and Black", () => {
  for (const [fen, move, target, removed] of [
    ["4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 19", "exd6", "d6", "d5"],
    ["4k3/8/8/8/3Pp3/8/8/4K3 b - d3 0 19", "exd3", "d3", "d4"],
  ] as const) {
    const game = checkedGame(fen);
    assert.equal(game.fen(), fen);
    assert.equal(game.move(move).flags, "e");
    assert.equal(game.get(target)?.type, "p");
    assert.equal(game.get(removed), undefined);
    assert.equal(game.fen().split(" ")[4], "0");
  }
});

test("FEN import accepts pasted whitespace and respects the fifty-move counter", () => {
  assert.equal(
    checkedGame(` \n${CASTLING_FEN.split(" ").join("  \t")}\n `).fen(),
    CASTLING_FEN,
  );
  const game = checkedGame(CASTLING_FEN.replace("37 42", "99 42"));
  assert.equal(ending(game), null);
  game.move("Rh7");
  assert.equal(ending(game), "Draw by the fifty-move rule.");
});

test("FEN import rejects malformed counters instead of silently truncating them", () => {
  for (const value of ["1.5", "42oops", "1e3", "+2", "9007199254740992"]) {
    assert.throws(
      () => checkedGame(CASTLING_FEN.replace("37 42", `${value} 42`)),
      /counter/i,
    );
    assert.throws(
      () => checkedGame(CASTLING_FEN.replace("37 42", `37 ${value}`)),
      /counter/i,
    );
  }
});

test("FEN import rejects duplicated or mixed castling availability", () => {
  for (const rights of ["KKQkq", "KQkq-", "--", "qq", "-K"]) {
    assert.throws(
      () => checkedGame(CASTLING_FEN.replace("KQkq", rights)),
      /castling/i,
    );
  }
});

test("FEN import rejects zero-width board runs", () => {
  assert.throws(
    () => checkedGame("4k0r2/8/8/8/8/8/8/4K3 w - - 0 1"),
    /piece data/i,
  );
});

test("an en passant target cannot have a nonzero half-move clock", () => {
  assert.throws(
    () => checkedGame("4k3/8/8/3pP3/8/8/8/4K3 w - d6 9 19"),
    /en passant/i,
  );
});
