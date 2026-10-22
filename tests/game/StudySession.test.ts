import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { StudySession } from "../../src/chess/StudySession";
import { START_FEN } from "../../src/chess/position";
import { createStudy, nodePath, parseStudy, ROOT } from "../../src/chess/study";

test("incremental moves preserve earlier snapshots and match the full rules engine", () => {
  const session = new StudySession(createStudy(START_FEN));
  const expected = new Chess();
  const snapshots = [session.snapshot];
  for (const san of ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O"]) {
    const move = expected.move(san);
    const next = session.play(session.snapshot.study.tipId, move.lan);
    assert.equal(next.positionGame.fen(), expected.fen());
    assert.deepEqual(next.history.map((item) => item.san), expected.history());
    assert.equal(next.outcomes.at(-1)!.drawn, expected.isDraw());
    snapshots.push(next);
  }
  for (const [ply, snapshot] of snapshots.entries()) {
    assert.equal(snapshot.history.length, ply);
    assert.equal(snapshot.outcomes.length, ply + 1);
    assert.equal(snapshot.study.nodes.length, ply);
    assert.equal(snapshot.positionGame.fen(), snapshot.history.at(-1)?.after ?? START_FEN);
  }
});

test("branching retains the original line and reuses existing moves after reload", (t) => {
  const session = new StudySession(createStudy(START_FEN));
  session.play(ROOT, "e2e4");
  const e4 = session.snapshot.study.tipId;
  session.play(e4, "e7e5");
  const original = session.snapshot;
  session.play(e4, "c7c5");
  const sicilian = session.snapshot.study.tipId;
  assert.equal(session.snapshot.study.mainTipId, original.study.tipId);
  assert.deepEqual(session.snapshot.history.map((move) => move.san), ["e4", "c5"]);
  assert.equal(original.positionGame.get("e5")?.type, "p");
  const calls = t.mock.method(Chess.prototype, "move");
  session.play(sicilian, "g1f3");
  assert.equal(calls.mock.callCount(), 1);
  const restored = new StudySession(parseStudy(JSON.parse(JSON.stringify(session.snapshot.study))));
  const reused = restored.play(e4, "e7e5");
  assert.equal(reused.study.nodes.length, session.snapshot.study.nodes.length);
  assert.equal(reused.study.tipId, original.study.tipId);
  assert.deepEqual(reused.history.map((move) => move.san), ["e4", "e5"]);
});

test("repetition survives incremental play, reload, and branching from earlier history", () => {
  const session = new StudySession(createStudy(START_FEN));
  for (const uci of ["g1f3", "g8f6", "f3g1", "f6g8", "g1f3", "g8f6", "f3g1"])
    session.play(session.snapshot.study.tipId, uci);
  const beforeDraw = session.snapshot;
  session.play(beforeDraw.study.tipId, "f6g8");
  assert.match(session.snapshot.outcomes.at(-1)!.terminal!, /repetition/i);
  assert.equal(session.snapshot.outcomes.at(-1)!.drawn, true);
  assert.equal(beforeDraw.outcomes.at(-1)!.drawn, false);
  assert.equal(session.snapshot.outcomes[4].drawn, false);
  const restored = new StudySession(parseStudy(JSON.parse(JSON.stringify(session.snapshot.study))));
  assert.equal(restored.snapshot.outcomes.at(-1)!.drawn, true);
  const parent = nodePath(restored.snapshot.study)[5].id;
  const branch = restored.play(parent, "e2e4");
  assert.equal(branch.outcomes.at(-1)!.terminal, null);
  assert.equal(branch.history.length, 7);
  assert.equal(branch.study.nodes.length, 9);
});

test("an invalid branch move leaves the live game and saved snapshot usable", () => {
  const session = new StudySession(createStudy(START_FEN));
  session.play(ROOT, "e2e4");
  session.play(session.snapshot.study.tipId, "e7e5");
  const saved = session.snapshot;
  assert.throws(() => session.play(ROOT, "e2e5"));
  assert.equal(session.snapshot, saved);
  const next = session.play(saved.study.tipId, "g1f3");
  assert.deepEqual(next.history.map((move) => move.san), ["e4", "e5", "Nf3"]);
});
