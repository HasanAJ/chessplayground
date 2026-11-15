import test from "node:test";
import assert from "node:assert/strict";
import { parseInfo } from "../../src/infrastructure/stockfish/protocol.ts";

test("UCI parsing separates multipv ranks and rejects bounds and incomplete lines", () => {
  assert.deepEqual(
    parseInfo(
      "info depth 14 seldepth 19 multipv 2 score cp 23 nodes 500 pv d2d3 f8c5",
    ),
    { depth: 14, rank: 2, cp: 23, pv: ["d2d3", "f8c5"] },
  );
  assert.equal(parseInfo("info depth 12 score cp 50 lowerbound pv e2e4"), null);
  assert.equal(parseInfo("info nodes 400"), null);
  assert.equal(parseInfo("bestmove e2e4"), null);
});

test("malformed scores, ranks and principal variations cannot enter analysis", () => {
  for (const line of [
    "info depth 10 multipv 0 score cp 10 pv e2e4",
    "info depth 10 score cp NaN pv e2e4",
    "info depth 10 score cp 10 pv e2e4 garbage",
    "info depth 10 score cp 10 pv",
    "info depth 10 score mate 2 lowerbound pv e2e4",
  ])
    assert.equal(parseInfo(line), null, line);
});
