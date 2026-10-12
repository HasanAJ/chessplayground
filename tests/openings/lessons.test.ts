import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { START_FEN } from "../../src/chess/position";
import { languages } from "../../src/i18n/translate";
import { motifs } from "../../src/features/openings/content";
import {
  lessonMoves,
  lessonPositions,
  openings,
  setupLength,
} from "../../src/features/openings/lessons";

test("every attack and defence has legal moves, accurate notation, and complete translations", () => {
  assert.equal(
    new Set(openings.map((lesson) => lesson.id)).size,
    openings.length,
  );
  const usedMotifs = new Set(openings.map((lesson) => lesson.motif));
  assert.deepEqual([...usedMotifs].sort(), Object.keys(motifs).sort());
  for (const lesson of openings) {
    for (const copy of [lesson.name, ...Object.values(motifs[lesson.motif])]) {
      assert.deepEqual(
        Object.keys(copy).sort(),
        Object.keys(languages).sort(),
        lesson.id,
      );
      for (const value of Object.values(copy))
        assert.ok(typeof value === "string" && value.trim(), lesson.id);
    }
    for (const branch of ["trap", "defense"] as const) {
      const positions = lessonPositions(lesson, branch);
      const moves = lessonMoves(lesson, branch);
      assert.equal(positions[0].fen, START_FEN);
      assert.equal(positions.length, moves.length + 1);
      const game = new Chess();
      for (const [index, san] of moves.entries()) {
        const move = game.move(san);
        assert.equal(
          move.san,
          san,
          `${lesson.id}/${branch}: notation for ${san}`,
        );
        assert.equal(
          positions[index + 1].fen,
          game.fen(),
          `${lesson.id}/${branch}: ${san}`,
        );
      }
      if (branch === "defense")
        assert.equal(game.isCheckmate(), false, lesson.id);
    }
    const temptation = setupLength(lesson) + lesson.temptation + 1;
    const positions = lessonPositions(lesson);
    assert.ok(
      temptation > setupLength(lesson) && temptation < positions.length,
      lesson.id,
    );
    assert.notEqual(
      positions[temptation].move?.color,
      lesson.side,
      `${lesson.id}: the opponent takes the bait`,
    );
    assert.notDeepEqual(
      lessonMoves(lesson, "trap"),
      lessonMoves(lesson, "defense"),
      lesson.id,
    );
  }
});

test("claimed mates and material rewards match the actual result of each shown line", () => {
  const minimumGain = {
    rookPawn: 6,
    exchange: 4,
    queen: 8,
    queenForKnight: 6,
    queenForBishop: 6,
    queenForPieces: 3,
    pieceForPawn: 2,
    pieceForPawns: 1,
    rookKnight: 7,
    recoverPiece: 1,
  };
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  for (const lesson of openings) {
    const end = lessonPositions(lesson).at(-1)!;
    const game = new Chess(end.fen);
    if (lesson.reward === "mate") {
      assert.ok(game.isCheckmate(), lesson.id);
      assert.notEqual(game.turn(), lesson.side, lesson.id);
    } else if (lesson.reward in minimumGain) {
      const material = game
        .board()
        .flat()
        .reduce(
          (sum, piece) =>
            sum +
            (piece
              ? values[piece.type] * (piece.color === lesson.side ? 1 : -1)
              : 0),
          0,
        );
      assert.ok(
        material >= minimumGain[lesson.reward as keyof typeof minimumGain],
        `${lesson.id}: material ${material}`,
      );
    }
  }
});

test("captures, castling, checks and knight underpromotion appear correctly in lesson frames", () => {
  const wayward = lessonPositions(
    openings.find((lesson) => lesson.id === "wayward-rook")!,
  );
  const wonRook = new Chess(wayward.at(-1)!.fen);
  assert.equal(wonRook.get("h8")?.color, "w");
  assert.equal(wonRook.get("h8")?.type, "q");
  assert.equal(wonRook.get("e5"), undefined);

  const fishing = lessonPositions(
    openings.find((lesson) => lesson.id === "fishing-pole")!,
  );
  const castled = new Chess(fishing[7].fen);
  assert.equal(castled.get("g1")?.type, "k");
  assert.equal(castled.get("f1")?.type, "r");
  assert.equal(castled.get("e1"), undefined);
  assert.equal(castled.get("h1"), undefined);
  assert.equal(fishing.at(-1)!.checkedKing, "g1");

  const albin = lessonPositions(
    openings.find((lesson) => lesson.id === "albin")!,
  );
  const promotion = albin.find((frame) => frame.move?.promotion === "n")!;
  assert.ok(promotion);
  assert.equal(new Chess(promotion.fen).get("g1")?.type, "n");
  assert.equal(promotion.checkedKing, "e2");
});
