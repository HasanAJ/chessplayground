import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { START_FEN } from "../../src/domain/chess/position.ts";
import { english, translator } from "../../src/i18n/translate.ts";
import { analyzeCandidates } from "../../src/domain/coach/candidates.ts";
import { presentCandidate } from "../../src/domain/coach/candidatePresentation.ts";

const line = { rank: 1, depth: 12, cp: 30, pv: ["e2e4", "e7e5"] };

test("localizing a completed candidate reuses its legal continuation and evaluation", (t) => {
  const [analysis] = analyzeCandidates(START_FEN, [line]);
  const moves = t.mock.method(Chess.prototype, "move");
  const original = presentCandidate(analysis);
  const localized = presentCandidate(analysis, translator("es"));
  assert.equal(moves.mock.callCount(), 0);
  assert.equal(localized.continuation, original.continuation);
  assert.equal(localized.move, original.move);
  assert.equal(localized.whiteScore, original.whiteScore);
  assert.notEqual(localized.explanation, original.explanation);
  assert.equal(presentCandidate(analysis, english), original);
});
