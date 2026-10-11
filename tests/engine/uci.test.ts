import test from "node:test";
import assert from "node:assert/strict";
import { parseInfo } from "../../src/engine/uci";

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
