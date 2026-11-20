import test from "node:test";
import assert from "node:assert/strict";
import { START_FEN } from "../../src/domain/chess/position.ts";
import { analyzeCandidates } from "../../src/domain/coach/candidates.ts";
import { moveHints } from "../../src/domain/coach/hints.ts";
import { languages, translator } from "../../src/i18n/translate.ts";

function candidate(fen: string, uci: string) {
  const [result] = analyzeCandidates(fen, [
    { rank: 1, depth: 15, cp: 30, pv: [uci] },
  ]);
  assert.ok(result, `${fen}: ${uci} must be legal`);
  return result;
}

test("hints progress from an observed idea to a concrete clue and the starting piece", () => {
  const fixtures = [
    [START_FEN, "g1f3", /back-rank piece/, /knight move.*d4 and e5/],
    [
      START_FEN,
      "e2e4",
      /space.*opening a diagonal for a bishop/,
      /pawn advance.*attacking d5/,
    ],
    [
      START_FEN,
      "c2c4",
      /influence over the center/,
      /pawn advance.*attacking d5/,
    ],
    [
      START_FEN.replace(" w ", " b "),
      "e7e5",
      /space.*opening a diagonal for a bishop/,
      /pawn advance.*attacking d4/,
    ],
    [
      "4k3/8/8/8/4P3/8/8/4K3 w - - 0 1",
      "e4e5",
      /central pawn advance/,
      /advance one square/,
    ],
    [
      "7k/8/5KQ1/8/8/8/8/8 w - - 0 1",
      "g6g7",
      /gives checkmate/,
      /check with your queen/,
    ],
    [
      "7k/P7/8/8/8/8/8/4K3 w - - 0 1",
      "a7a8n",
      /promote a pawn/,
      /promoting to a knight/,
    ],
    [
      "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
      "e5d6",
      /capture of an opposing pawn/,
      /cannot be immediately recaptured/,
    ],
    [
      "4k3/8/8/8/8/8/8/4K2R w K - 0 1",
      "e1g1",
      /king’s safety/,
      /Kingside castling/,
    ],
    [
      "4k3/8/8/8/8/8/4r3/4K3 w - - 0 1",
      "e1e2",
      /king is in check/,
      /checking piece can be captured/,
    ],
    [
      "4k3/8/8/3p4/4N3/8/8/4K3 w - - 0 1",
      "e4f2",
      /attacked piece out of reach/,
      /knight.*cannot be captured immediately/,
    ],
    [
      "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
      "d2d3",
      /undefended piece/,
      /recapture if your pawn on e4 is taken/,
    ],
    [
      "7k/8/8/8/3n4/8/8/R3Q1K1 b - - 0 1",
      "d4c2",
      /two opposing pieces/,
      /queen on e1 and rook on a1/,
    ],
    ["4k3/8/6r1/8/8/5N2/8/4K3 w - - 0 1", "f3e5", /new attack/, /rook on g6/],
    [
      "4k3/8/8/8/8/8/P7/R3K3 w - - 0 1",
      "a1b1",
      /open file/,
      /b-file has no pawns/,
    ],
    [
      "k7/8/8/8/8/8/8/4K1Q1 w - - 0 1",
      "g1e3",
      /influence over the center/,
      /queen move.*e4 and e5/,
    ],
  ] as const;
  for (const [fen, uci, idea, clue] of fixtures) {
    const result = candidate(fen, uci);
    const hints = moveHints(result);
    assert.equal(hints.length, 3, uci);
    assert.match(hints[0].text, idea, uci);
    assert.match(hints[1].text, clue, uci);
    assert.match(hints[2].text, new RegExp(`on ${result.move.from}\\.`), uci);
    for (const language of Object.keys(
      languages,
    ) as (keyof typeof languages)[]) {
      const translated = moveHints(result, translator(language)).map(
        ({ heading, text }) => `${heading} ${text}`,
      );
      assert.equal(translated.length, hints.length);
      assert.doesNotMatch(
        translated.join(" "),
        new RegExp(`\\b${result.move.to}\\b`),
        `${language}: ${uci}`,
      );
      assert.doesNotMatch(
        translated.slice(0, -1).join(" "),
        new RegExp(`\\b${result.move.from}\\b`),
        `${language}: ${uci}`,
      );
      assert.doesNotMatch(translated.join(" "), /\{\d+\}/, language);
    }
  }
});

test("capture clues distinguish legal recaptures without promising a material gain", () => {
  const result = candidate("7k/r1r5/8/1N6/8/8/8/7K w - - 0 1", "b5a7");
  const hints = moveHints(result);
  assert.match(hints[0].text, /opposing rook/);
  assert.match(hints[1].text, /opponent can recapture/);
  assert.doesNotMatch(
    hints.map(({ text }) => text).join(" "),
    /wins|free|undefended/,
  );
});

test("discovered and double checks identify the mechanism instead of claiming the moved piece gives check", () => {
  const fen = "4k3/8/8/8/8/8/4N3/K3R3 w - - 0 1";
  assert.match(
    moveHints(candidate(fen, "e2c3"))[1].text,
    /uncover a check from another/,
  );
  const double = "4k3/8/8/8/8/8/4B3/K3R3 w - - 0 1";
  assert.match(
    moveHints(candidate(double, "e2b5"))[1].text,
    /two pieces at once/,
  );
});

test("castling checks and checkmates use the castling clue", () => {
  const fixtures = [
    ["5k2/8/8/8/8/8/8/4K2R w K - 0 1", "e1g1", "O-O+", /Kingside castling/],
    [
      "5k2/4p1pB/8/1B6/8/8/8/4K2R w K - 0 1",
      "e1g1",
      "O-O#",
      /Kingside castling/,
    ],
    ["3k4/8/8/8/8/8/8/R3K3 w Q - 0 1", "e1c1", "O-O-O+", /Queenside castling/],
    [
      "3k4/2p1p3/8/1B3B2/8/8/8/R3K3 w Q - 0 1",
      "e1c1",
      "O-O-O#",
      /Queenside castling/,
    ],
  ] as const;
  for (const [fen, uci, notation, clue] of fixtures) {
    const result = candidate(fen, uci);
    assert.equal(result.move.san, notation);
    const hints = moveHints(result);
    assert.match(
      hints[0].text,
      notation.endsWith("#") ? /gives checkmate/ : /gives check\./,
    );
    assert.match(hints[1].text, clue);
    assert.doesNotMatch(
      hints.map(({ text }) => text).join(" "),
      new RegExp(`\\b${result.move.to}\\b`),
    );
  }
});

test("pinned pieces that cannot recapture are not described as defenders", () => {
  const defense = candidate("3r3k/8/8/5n2/8/4B3/3R4/3K4 w - - 0 1", "d2d3");
  assert.doesNotMatch(
    moveHints(defense)
      .map(({ text }) => text)
      .join(" "),
    /support|recapture|undefended/,
  );
});

test("unexplained quiet moves go straight to the piece clue instead of inventing advice", () => {
  for (const [fen, uci] of [
    [START_FEN, "a2a3"],
    ["4k3/8/8/8/8/P7/8/R3K3 w - - 0 1", "a1a2"],
    ["4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "e1d1"],
  ]) {
    const result = candidate(fen, uci);
    const hints = moveHints(result);
    assert.equal(hints.length, 1, uci);
    assert.match(hints[0].text, new RegExp(`\\b${result.move.from}\\b`));
    assert.doesNotMatch(hints[0].text, new RegExp(`\\b${result.move.to}\\b`));
  }
});

test("replacing a bishop's attack with a pawn's attack does not claim extra central influence", () => {
  const result = candidate("7k/8/8/8/8/1B6/2P5/7K w - - 0 1", "c2c4");
  const hints = moveHints(result);
  assert.equal(hints.length, 1);
  assert.doesNotMatch(hints[0].text, /d5/);
});

test("pinned rooks and pawns do not receive central attack clues", () => {
  const rook = moveHints(
    candidate("4r2k/8/8/2q5/8/4R3/8/4K3 w - - 0 1", "e3e5"),
  );
  assert.equal(rook.length, 1);
  assert.doesNotMatch(rook[0].text, /d5/);
  const pawn = moveHints(candidate("4r2k/8/8/8/8/8/4P3/4K3 w - - 0 1", "e2e4"));
  assert.match(pawn[0].text, /central pawn advance/);
  assert.match(pawn[1].text, /advance two squares/);
  assert.doesNotMatch(
    pawn.map(({ text }) => text).join(" "),
    /d5|attacking|bishop/,
  );
});

test("opening a diagonal is mentioned only when a bishop gains legal moves overall", () => {
  const blocked = moveHints(
    candidate("k7/8/8/8/8/2B5/3P4/7K w - - 0 1", "d2d4"),
  );
  assert.match(blocked[1].text, /advance two squares/);
  assert.doesNotMatch(
    blocked.map(({ text }) => text).join(" "),
    /bishop|diagonal|e5/,
  );
  const freed = moveHints(
    candidate("k7/8/8/8/8/2B5/3P4/2B4K w - - 0 1", "d2d4"),
  );
  assert.match(freed[0].text, /opening a diagonal for a bishop/);
  assert.match(freed[1].text, /pawn advance that opens a diagonal/);
  assert.doesNotMatch(freed[1].text, /attacking|e5/);
});

test("checking captures and capturing forks explain the tactic before the captured material", () => {
  const check = moveHints(candidate("7k/6q1/8/8/8/8/6Q1/7K w - - 0 1", "g2g7"));
  assert.match(check[0].text, /capture that also gives check/);
  assert.match(check[1].text, /check with your queen/);
  const discovery = moveHints(
    candidate("4k3/8/8/8/8/2p5/4N3/K3R3 w - - 0 1", "e2c3"),
  );
  assert.match(discovery[0].text, /capture that also gives check/);
  assert.match(discovery[1].text, /uncover a check from another/);
  const fork = moveHints(
    candidate("7k/8/8/8/3n4/8/2P5/R3Q1K1 b - - 0 1", "d4c2"),
  );
  assert.match(fork[0].text, /two opposing pieces/);
  assert.match(fork[1].text, /queen on e1 and rook on a1/);
  for (const [hints, destination] of [
    [check, "g7"],
    [discovery, "c3"],
    [fork, "c2"],
  ] as const)
    assert.doesNotMatch(
      hints.map(({ text }) => text).join(" "),
      new RegExp(`\\b${destination}\\b`),
    );
});

test("a mating line that starts without check does not direct the learner to checks", () => {
  const [result] = analyzeCandidates("7k/8/6K1/8/6Q1/8/8/8 w - - 0 1", [
    { rank: 1, depth: 15, mate: 2, pv: ["g4f5", "h8g8", "f5c8"] },
  ]);
  assert.ok(result);
  assert.equal(result.move.san, "Qf5");
  assert.equal(result.continuation.at(-1)!.san, "Qc8#");
  const hints = moveHints(result);
  assert.match(hints[0].text, /forced mating line/);
  assert.match(hints[1].text, /move that does not give check/);
  assert.doesNotMatch(
    hints
      .slice(0, 2)
      .map(({ text }) => text)
      .join(" "),
    /f5|c8/,
  );
});
