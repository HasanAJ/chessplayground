import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { START_FEN } from "../../src/chess/position";
import { english, translator, type Translator } from "../../src/i18n/translate";
import { analyzeCandidates } from "../../src/features/coach/candidates";
import {
  candidatesFor,
  presentCandidate,
} from "../../src/features/coach/candidatePresentation";

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

test("unexpected presentation failures surface instead of silently discarding legal candidates", () => {
  const failure = new Error("Broken translation");
  const broken: Translator = Object.assign(
    () => {
      throw failure;
    },
    { language: "en" as const },
  );
  assert.throws(() => candidatesFor(START_FEN, [line], broken), failure);
});
