import test from "node:test";
import assert from "node:assert/strict";
import { Chess, type Color } from "chess.js";
import {
  practicePositions,
  practiceSources,
} from "../../src/content/practice/positions.ts";
import { checkedGame, START_FEN } from "../../src/domain/chess/position.ts";
import {
  choosePracticePosition,
  RECENT_PRACTICE_LIMIT,
} from "../../src/domain/practice/positions.ts";
import { uciMove } from "../../src/domain/chess/moves.ts";

test("practice positions replay legally and start distinct, playable exercises", () => {
  const seen = new Set<string>();
  for (const position of practicePositions) {
    const replay = new Chess();
    for (const move of practiceSources[position.id].split(" "))
      uciMove(replay, move);
    assert.equal(replay.fen(), position.fen, position.id);
    const game = checkedGame(position.fen);
    assert.equal(game.isGameOver(), false, position.id);
    assert.equal(game.isCheck(), false, position.id);
    assert.ok(game.moves().length > 2, position.id);
    const key = position.fen.split(" ").slice(0, 4).join(" ");
    assert.equal(seen.has(key), false, position.id);
    seen.add(key);
  }
  for (const phase of ["middlegame", "endgame"])
    for (const side of ["w", "b"])
      assert.ok(
        practicePositions.filter(
          (p) => p.phase === phase && p.fen.split(" ")[1] === side,
        ).length >
          RECENT_PRACTICE_LIMIT + 1,
        `${phase}, ${side}: enough choices after excluding recent positions`,
      );
});

test("sampling both phases respects the player's side, current board, and five recent picks", () => {
  for (const side of [undefined, "w", "b"] as (Color | undefined)[]) {
    let currentFen = START_FEN;
    let recent: string[] = [];
    for (let index = 0; index < 40; index++) {
      let call = 0;
      const phase = index % 2 === 0 ? "middlegame" : "endgame";
      const position = choosePracticePosition(
        practicePositions,
        { recent, currentFen, side },
        () => (call++ === 0 ? (index % 2) * 0.9 : index % 3 === 0 ? 0 : 0.999),
      );
      assert.equal(position.phase, phase);
      if (side) assert.equal(position.fen.split(" ")[1], side);
      assert.equal(recent.includes(position.id), false);
      assert.notEqual(
        position.fen.split(" ").slice(0, 4).join(" "),
        currentFen.split(" ").slice(0, 4).join(" "),
      );
      recent = [...recent, position.id].slice(-RECENT_PRACTICE_LIMIT);
      currentFen = position.fen;
    }
  }
});
