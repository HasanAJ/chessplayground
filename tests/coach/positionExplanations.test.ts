import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { act, createElement } from "react";
import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import {
  english,
  languages,
  translator,
  type Language,
} from "../../src/i18n/translate.ts";
import { betterMoveReason } from "../../src/domain/coach/lessons.ts";
import { localizeReview, reviewMove } from "../../src/domain/coach/grading.ts";
import { BestMoveContent } from "../../src/ui/coach/BestMoveContent.tsx";
import { createTestRoot } from "../helpers/dom.ts";

const bishopFen = "3R4/2r2ppk/7p/p1p2b2/P7/1B3P1P/1P4P1/6K1 w - - 0 1";
const bishopLine = ["b3c4", "c7d7", "d8a8", "f5d3", "c4d3", "d7d3"];
function candidate(fen: string, pv: string[], language: Language = "en") {
  const [result] = candidatesFor(
    fen,
    [{ rank: 1, depth: 21, cp: 62, pv }],
    translator(language),
  );
  assert.ok(result, "the fixture must be a legal continuation");
  assert.equal(result.continuation.length, pv.length);
  return result;
}

test("the bishop screenshot explains the blockade and pressure without an inline continuation", () => {
  const result = candidate(bishopFen, bishopLine);
  assert.equal(result.title, "Block their pawn’s advance");
  assert.match(
    result.explanation,
    /bishop on c4 blocks their pawn on c5 from advancing/,
  );
  assert.match(result.explanation, /keeps pressure on their pawn on f7/);
  assert.doesNotMatch(result.explanation, /attacks d5|→|Rd7|Ra8/);
  assert.deepEqual(result.explanationFocus?.arrows, [{ from: "b3", to: "c4" }]);
  assert.ok(result.explanationFocus?.squares.includes("c5"));
  assert.equal(
    betterMoveReason(result, undefined, english),
    result.explanation,
  );
});

test("blockades work for Black and do not require a bishop", () => {
  const blackFen = "6k1/1p4p1/1b3p1p/p7/P1P2B2/7P/2R2PPK/3r4 b - - 0 1";
  const result = candidate(blackFen, ["b6c5", "c2d2", "d1a1"]);
  assert.match(result.explanation, /bishop on c5 blocks their pawn on c4/);
  assert.match(result.explanation, /keeps pressure on their pawn on f2/);
  assert.doesNotMatch(result.explanation, /possible continuation|→/);
  const rook = candidate("7k/8/2p5/8/8/8/8/2R4K w - - 0 1", ["c1c5"]);
  assert.match(rook.explanation, /rook on c5 blocks their pawn on c6/);
});

test("quiet moves do not invent a pawn blockade or new center control", () => {
  const pinned = candidate("8/7k/8/8/4p3/8/8/KB4B1 w - - 0 1", ["g1e3"]);
  assert.doesNotMatch(pinned.explanation, /blocks their pawn/);
  const unchangedControl = candidate("7k/7p/8/8/8/1B6/P7/7K w - - 0 1", [
    "b3c4",
  ]);
  assert.doesNotMatch(unchangedControl.explanation, /attacks d5/);
});

test("the main card keeps its explanation short and Explore still previews every move", async (t) => {
  const { root, dom } = createTestRoot(t);
  const result = candidate(bishopFen, bishopLine);
  const inspected: number[] = [];
  await act(() =>
    root.render(
      createElement(BestMoveContent, {
        candidate: result,
        forcedMove: false,
        preview: null,
        onInspect(_candidate, ply) {
          inspected.push(ply);
        },
        onClearInspection() {},
        onPlay() {},
      }),
    ),
  );
  const document = dom.window.document;
  const explanation = document.querySelector("p")!.textContent!;
  assert.match(explanation, /blocks their pawn on c5/);
  assert.doesNotMatch(explanation, /possible continuation|→|Rd7|Ra8/);
  assert.equal(
    document.querySelectorAll(".continuation-moves button").length,
    0,
  );
  await act(() =>
    document.querySelector<HTMLButtonElement>(".plan-preview")!.click(),
  );
  const steps = document.querySelectorAll<HTMLButtonElement>(
    ".continuation-moves button",
  );
  assert.equal(steps.length, bishopLine.length);
  assert.match(steps[1].textContent!, /Rook from c7 to d7/);
  assert.match(steps[2].textContent!, /Rook from d8 to a8/);
  await act(() => steps[2].click());
  assert.deepEqual(inspected, [1, 3]);
  assert.deepEqual(
    result.continuation.map((step) => step.lan),
    bishopLine,
  );
});

test("stalemate takes priority over an apparent defensive plan", () => {
  const result = candidate("kN1K4/8/2N5/8/8/8/8/8 w - - 0 1", ["d8c7"]);
  assert.equal(new Chess(result.move.after).isStalemate(), true);
  assert.equal(result.title, "End the game in a draw");
  assert.equal(result.explanation, english("game.ending.stalemate"));
});

test("a pinned former defender is not named as the pawn's existing support", () => {
  const result = candidate("4r2k/8/5n2/8/6P1/4N3/8/R3K3 w - - 0 1", [
    "a1a2",
    "h8h7",
    "a2g2",
  ]);
  assert.match(
    result.explanation,
    /rook can head toward g2 to help defend your pawn on g4/,
  );
  assert.doesNotMatch(result.explanation, /only defender|knight on e3/);
});

test("a capture ending in insufficient material explains the draw", () => {
  const result = candidate("7k/r7/8/1N6/8/8/8/7K w - - 0 1", ["b5a7"]);
  assert.equal(result.title, "End the game in a draw");
  assert.equal(result.explanation, english("game.ending.insufficientMaterial"));
});

test("quiet best-move feedback has an honest fallback in every language", () => {
  const quiet = candidate(
    "2k4r/2r2p2/4p3/3nP3/1p1P2p1/1K4B1/1PPR3P/2R5 b - - 0 1",
    ["c8d7", "c1g1"],
  );
  assert.equal(quiet.explanation, "");
  const review = reviewMove(quiet.move, quiet, undefined, false, quiet);
  for (const language of Object.keys(languages) as Language[]) {
    const t = translator(language);
    const localized = localizeReview(review, t);
    assert.equal(localized.label, "Best move");
    assert.equal(localized.text, t("coach.review.good.best"));
  }
});

test("pawn moves explain newly opened bishop diagonals for both colors", () => {
  const start = new Chess().fen();
  for (const [fen, pv, bishop] of [
    [start, ["e2e4"], "f1"],
    [start.replace(" w ", " b "), ["e7e5"], "f8"],
    [start, ["g2g3"], "f1"],
  ] as const) {
    const result = candidate(fen, [...pv]);
    assert.match(
      result.explanation,
      new RegExp(`opens a diagonal for your bishop on ${bishop}`),
    );
  }
  const pinned = candidate("2r4k/8/8/8/8/1P6/2B5/2K5 w - - 0 1", ["b3b4"]);
  assert.doesNotMatch(pinned.explanation, /opens a diagonal/);
  assert.doesNotMatch(
    candidate(start, ["c2c3"]).explanation,
    /opens a diagonal/,
  );
});

test("rook moves distinguish joining an open file from staying on the same file", () => {
  const fen = "4k3/8/8/8/8/8/8/R3K3 w - - 0 1";
  assert.doesNotMatch(candidate(fen, ["a1a2"]).title, /open file/);
  assert.match(candidate(fen, ["a1b1"]).explanation, /b-file.*no pawns/);
});

test("compensation identifies the specific capturing reply for both colors", () => {
  for (const [fen, pv, target] of [
    ["2q4k/1pr5/8/8/8/8/6B1/2R4K w - - 0 1", ["g2b7", "c7b7", "c1c8"], "c8"],
    ["2r4k/6b1/8/8/8/8/1PR5/2Q4K b - - 0 1", ["g7b2", "c2b2", "c8c1"], "c1"],
  ] as const) {
    const result = candidate(fen, [...pv]);
    const queenCapture = new Chess(result.move.after)
      .moves({ verbose: true })
      .find(
        (reply) =>
          reply.piece === "q" && reply.captured && reply.to === result.move.to,
      );
    assert.ok(queenCapture, "another piece can capture the offered bishop");
    assert.equal(
      new Chess(queenCapture.after)
        .moves({ verbose: true })
        .some((move) => move.lan === pv[2]),
      false,
      "the compensating capture is only available after the specified rook reply",
    );
    assert.match(
      result.explanation,
      new RegExp(`If their rook from ${pv[1].slice(0, 2)} takes your bishop`),
    );
    assert.match(
      result.explanation,
      new RegExp(`your rook can take their queen on ${target}`),
    );
    assert.doesNotMatch(
      result.explanation,
      /→|exchange costs|give up more material/,
    );
    assert.equal(
      reviewMove(result.move, result, undefined, false, result).text,
      result.explanation,
    );
  }
});

test("compensation names the promotion choice in the capturing reply", () => {
  const fen = "6k1/8/8/R7/8/2B4K/1p5P/r7 w - - 0 1";
  for (const [promotion, piece] of [
    ["q", "queen"],
    ["n", "knight"],
  ] as const) {
    const result = candidate(fen, ["a5a1", `b2a1${promotion}`, "c3a1"]);
    assert.match(
      result.explanation,
      new RegExp(
        `If their pawn from b2 takes your rook on a1 and promotes to a ${piece}, your bishop can take their ${piece} on a1`,
      ),
    );
    for (const language of Object.keys(languages) as Language[]) {
      const localized = candidate(
        fen,
        ["a5a1", `b2a1${promotion}`, "c3a1"],
        language,
      );
      const t = translator(language);
      assert.ok(
        localized.explanation.includes(
          t(
            "coach.explanation.sacrifice.promotion",
            t(promotion === "q" ? "chess.piece.queen" : "chess.piece.knight"),
          ),
        ),
      );
      assert.doesNotMatch(localized.explanation, /\{\d+\}/);
    }
  }
});

test("compensation is not inferred from an existing capture, a losing trade, or an invalid tail", () => {
  const pv = ["g2b7", "c7b7", "c1c8"];
  const losing = candidate("2r4k/1pr5/8/8/8/8/6Q1/2R4K w - - 0 1", pv);
  const existing = candidate("2q4k/rp6/8/8/8/8/6B1/2R4K w - - 0 1", [
    "g2b7",
    "a7b7",
    "c1c8",
  ]);
  const [invalid] = candidatesFor("2q4k/1pr5/8/8/8/8/6B1/2R4K w - - 0 1", [
    { rank: 1, depth: 21, cp: 62, pv: [...pv, "h8h8"] },
  ]);
  assert.equal(invalid.continuation.length, 3);
  for (const result of [losing, existing, invalid]) {
    assert.doesNotMatch(result.explanation, /If their/);
    assert.match(result.explanation, /Their rook can take/);
  }
});

test("the screenshot explanation and terminal outcome translate in every language", () => {
  for (const language of Object.keys(languages) as Language[]) {
    const t = translator(language);
    const result = candidate(bishopFen, bishopLine, language);
    assert.equal(result.title, t("coach.explanation.blockade.title"));
    assert.match(result.explanation, /c4.*c5/);
    assert.match(result.explanation, /f7/);
    assert.doesNotMatch(result.explanation, /\{\d+\}|→|Rd7|Ra8/);
    const draw = candidate(
      "kN1K4/8/2N5/8/8/8/8/8 w - - 0 1",
      ["d8c7"],
      language,
    );
    assert.equal(draw.explanation, t("game.ending.stalemate"));
  }
});
