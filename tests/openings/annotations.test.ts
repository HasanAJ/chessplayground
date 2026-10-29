import test from "node:test";
import assert from "node:assert/strict";
import {
  annotations,
  teachingNote,
} from "../../src/features/openings/annotations";
import {
  openings,
  lessonPositions,
  setupLength,
} from "../../src/features/openings/lessons";
import { motifs } from "../../src/features/openings/content";
import { languages } from "../../src/i18n/translate";

const squares = (copy: string) =>
  [...new Set(copy.match(/[a-h][1-8]/g))].sort();

test("every lesson has an annotated preview, bait, outcome and defensive reply in all languages", () => {
  assert.deepEqual(
    Object.keys(annotations).sort(),
    openings.map((lesson) => lesson.id).sort(),
  );
  for (const lesson of openings) {
    const setup = setupLength(lesson);
    const trap = lessonPositions(lesson);
    const previewStep = setup + lesson.previewPly;
    const preview = teachingNote(lesson, "trap", previewStep);
    assert.ok(preview?.arrows.length, `${lesson.id}: visible tactical arrows`);
    for (const [from] of preview.arrows)
      assert.equal(
        trap[previewStep].position[from]?.color,
        lesson.side,
        `${lesson.id}: the preview shows the attacker's threats`,
      );
    assert.ok(
      teachingNote(lesson, "trap", setup + lesson.temptation + 1),
      lesson.id,
    );
    assert.ok(
      teachingNote(lesson, "trap", trap.length - 1),
      `${lesson.id}: outcome`,
    );
    assert.ok(
      teachingNote(lesson, "defense", setup + 1),
      `${lesson.id}: defensive reply`,
    );
    for (const branch of ["trap", "defense"] as const) {
      const notes = annotations[lesson.id][branch];
      const positions = lessonPositions(lesson, branch);
      assert.equal(new Set(notes.map((note) => note.ply)).size, notes.length);
      for (const note of notes) {
        assert.ok(
          note.ply > 0 && note.ply + setup < positions.length,
          lesson.id,
        );
        assert.deepEqual(
          Object.keys(note.explanation).sort(),
          Object.keys(languages).sort(),
        );
        for (const language of Object.keys(
          languages,
        ) as (keyof typeof languages)[]) {
          assert.ok(note.explanation[language].trim());
          assert.deepEqual(
            squares(note.explanation[language]),
            squares(note.explanation.en),
            `${lesson.id}/${branch}/${note.ply}: ${language} square references`,
          );
          for (const copy of [
            motifs[lesson.motif].plan,
            motifs[lesson.motif].temptation,
            motifs[lesson.motif].defense,
          ])
            assert.notEqual(note.explanation[language], copy[language]);
        }
        const position = positions[setup + note.ply].position;
        for (const square of note.squares) assert.match(square, /^[a-h][1-8]$/);
        for (const [from, to] of note.arrows) {
          const piece = position[from];
          assert.ok(
            piece,
            `${lesson.id}/${branch}/${note.ply}: arrow starts on occupied ${from}`,
          );
          assert.notEqual(from, to);
          const dx = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
          const dy = Math.abs(Number(from[1]) - Number(to[1]));
          assert.ok(
            piece.type === "n"
              ? dx * dy === 2
              : piece.type === "b"
                ? dx === dy
                : piece.type === "r"
                  ? dx === 0 || dy === 0
                  : piece.type === "q"
                    ? dx === dy || dx === 0 || dy === 0
                    : piece.type === "k"
                      ? Math.max(dx, dy) === 1
                      : (dx === 0 && dy <= 2) || (dx === 1 && dy === 1),
            `${lesson.id}/${branch}/${note.ply}: ${piece.type} arrow ${from}-${to}`,
          );
        }
      }
    }
  }
});
