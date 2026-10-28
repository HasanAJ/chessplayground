import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { checkedGame } from "../../src/chess/position";
import { watchOutFor } from "../../src/features/coach/warnings";

test("a position without a threat has no warning target or highlights", () => {
  const warning = watchOutFor(new Chess());
  assert.equal(warning.target, null);
  assert.deepEqual(warning.attackers, []);
});

test("check highlights the king and every checking piece", () => {
  const warning = watchOutFor(checkedGame("k3r3/8/8/8/1b6/8/8/4K3 w - - 0 1"));
  assert.match(warning.text, /king is in check/);
  assert.equal(warning.target, "e1");
  assert.deepEqual(new Set(warning.attackers), new Set(["e8", "b4"]));
});

test("an undefended piece warning identifies its target and multiple attackers", () => {
  const warning = watchOutFor(
    checkedGame("4r2k/1b6/8/8/4Q3/8/8/6K1 w - - 0 1"),
  );
  assert.match(warning.text, /queen on e4 is under attack/);
  assert.equal(warning.target, "e4");
  assert.deepEqual(new Set(warning.attackers), new Set(["e8", "b7"]));
});

test("defended attacks do not create warnings or board highlights", () => {
  const warning = watchOutFor(
    checkedGame("4r2k/8/8/8/4P3/3P4/8/6K1 w - - 0 1"),
  );
  assert.equal(warning.target, null);
  assert.deepEqual(warning.attackers, []);
});

test("warnings use the side to move when Black is threatened", () => {
  const warning = watchOutFor(checkedGame("7k/8/8/4q3/8/8/8/4R2K b - - 0 1"));
  assert.match(warning.text, /queen on e5 is under attack/);
  assert.equal(warning.target, "e5");
  assert.deepEqual(warning.attackers, ["e1"]);
});
