import test from "node:test";
import assert from "node:assert/strict";
import { START_FEN } from "../../src/domain/chess/position.ts";
import {
  createStudy,
  addStudyMove,
  parseStudy,
  ROOT,
} from "../../src/domain/chess/study.ts";

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
