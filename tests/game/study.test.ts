import test from "node:test";
import assert from "node:assert/strict";
import { START_FEN } from "../../src/chess/position";
import {
  createStudy,
  addStudyMove,
  gameAt,
  nodePath,
  parseStudy,
  ROOT,
} from "../../src/chess/study";

test("branches retain the original line and reuse an existing move", () => {
  let study = createStudy(START_FEN);
  study = addStudyMove(study, ROOT, "e2e4");
  const e4 = study.tipId;
  study = addStudyMove(study, e4, "e7e5");
  const main = study.tipId;
  study = addStudyMove(study, e4, "c7c5");
  assert.equal(study.mainTipId, main);
  assert.deepEqual(gameAt(study, main).history(), ["e4", "e5"]);
  assert.deepEqual(gameAt(study).history(), ["e4", "c5"]);
  const reused = addStudyMove(study, e4, "c7c5");
  assert.equal(reused.nodes.length, study.nodes.length);
  assert.equal(reused.tipId, study.tipId);
  assert.equal(nodePath(study).length, 2);
});

test("serialized studies restore branches, current line, and repetition", () => {
  let study = createStudy(START_FEN);
  for (const move of [
    "g1f3",
    "g8f6",
    "f3g1",
    "f6g8",
    "g1f3",
    "g8f6",
    "f3g1",
    "f6g8",
  ])
    study = addStudyMove(study, study.tipId, move);
  const restored = parseStudy(JSON.parse(JSON.stringify(study)));
  assert.equal(gameAt(restored).isThreefoldRepetition(), true);
  assert.equal(restored.tipId, study.tipId);
});

test("saved game validation rejects illegal moves, broken parents, cycles and duplicate IDs", () => {
  const study = addStudyMove(createStudy(START_FEN), ROOT, "e2e4");
  assert.throws(() => parseStudy({ ...study, tipId: "missing" }));
  assert.throws(() =>
    parseStudy({ ...study, nodes: [{ ...study.nodes[0], parent: "missing" }] }),
  );
  assert.throws(() =>
    parseStudy({
      ...study,
      nodes: [{ ...study.nodes[0], parent: study.nodes[0].id }],
    }),
  );
  assert.throws(() =>
    parseStudy({ ...study, nodes: [{ ...study.nodes[0], uci: "e2e5" }] }),
  );
  assert.throws(() =>
    parseStudy({ ...study, nodes: [...study.nodes, study.nodes[0]] }),
  );
});
