import { translateNotice } from "../../src/i18n/notices";
import { english } from "../../src/i18n/translate";
import test from "node:test";
import assert from "node:assert/strict";
import { START_FEN } from "../../src/chess/position";
import {
  addStudyMove,
  createStudy,
  replayStudy,
  ROOT,
} from "../../src/chess/study";
import {
  preserveRecovery,
  readSavedSession,
  RECOVERY_PREFIX,
  SESSION_KEY,
} from "../../src/features/game/storage";
import {
  COMPUTER_DIFFICULTY_KEY,
  readDifficulty,
} from "../../src/features/computer/preferences";

const storage = (values: Record<string, string>) => ({
  getItem: (key: string) => values[key] ?? null,
});

test("saved sessions preserve their active history and take precedence over the legacy position", () => {
  const study = addStudyMove(createStudy(START_FEN), ROOT, "e2e4");
  const { study: restored, recovery } = readSavedSession(
    storage({
      [SESSION_KEY]: JSON.stringify(study),
      "tempo-position": START_FEN,
    }),
  );
  assert.equal(restored.id, study.id);
  assert.deepEqual(replayStudy(restored).history.map((move) => move.san), ["e4"]);
  assert.equal(recovery, null);
});

test("a legacy position opens as a new playable game when no session exists", () => {
  const fen = "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 37 42";
  assert.equal(
    replayStudy(readSavedSession(storage({ "tempo-position": fen })).study).game.fen(),
    fen,
  );
});

test("corrupt saved data falls back to a playable starting position", () => {
  for (const saved of [
    "{broken",
    JSON.stringify({ version: 99 }),
    JSON.stringify({ ...createStudy(START_FEN), nodes: [null] }),
  ]) {
    const loaded = readSavedSession(storage({ [SESSION_KEY]: saved }));
    assert.equal(replayStudy(loaded.study).game.fen(), START_FEN);
    assert.deepEqual(loaded.recovery?.data, { [SESSION_KEY]: saved });
  }
});

test("unavailable browser storage still permits a fresh game and computer play", () => {
  const blocked = {
    getItem(): never {
      throw new Error("Storage blocked");
    },
  };
  const loaded = readSavedSession(blocked);
  assert.equal(replayStudy(loaded.study).game.fen(), START_FEN);
  assert.match(translateNotice(loaded.storageError, english), /could not be read/);
  assert.equal(readDifficulty(blocked), "medium");
});

test("all five saved difficulty choices are restored, and unknown values use Medium", () => {
  for (const level of ["beginner", "easy", "medium", "hard", "expert"] as const)
    assert.equal(
      readDifficulty(storage({ [COMPUTER_DIFFICULTY_KEY]: level })),
      level,
    );
  for (const level of ["", "impossible", "toString", "__proto__"])
    assert.equal(
      readDifficulty(storage({ [COMPUTER_DIFFICULTY_KEY]: level })),
      "medium",
    );
});

test("a corrupt session preserves its exact data and recovers a valid fallback FEN", () => {
  const fen = "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 37 42";
  const values = { [SESSION_KEY]: "{broken", "tempo-position": fen };
  const loaded = readSavedSession(storage(values));
  assert.equal(replayStudy(loaded.study).game.fen(), fen);
  assert.deepEqual(loaded.recovery?.data, { [SESSION_KEY]: "{broken" });
  assert.match(translateNotice(loaded.recovery!.message, english), /without its move history/);
  assert.match(translateNotice(loaded.recovery!.message, english), /Autosave is paused/);
  assert.deepEqual(values, { [SESSION_KEY]: "{broken", "tempo-position": fen });
});

test("both malformed saves, including an empty session, remain available for recovery", () => {
  const data = { [SESSION_KEY]: "", "tempo-position": "bad FEN" };
  const loaded = readSavedSession(storage(data));
  assert.equal(replayStudy(loaded.study).game.fen(), START_FEN);
  assert.deepEqual(loaded.recovery?.data, data);
});

test("resuming saving preserves each original payload under a separate recovery key", () => {
  const values: Record<string, string> = { [SESSION_KEY]: "{broken" };
  const source = {
    ...storage(values),
    setItem(key: string, value: string) {
      values[key] = value;
    },
  };
  const recovery = readSavedSession(source).recovery!;
  preserveRecovery(recovery, source);
  preserveRecovery(recovery, source);
  const backups = Object.keys(values).filter((key) =>
    key.startsWith(RECOVERY_PREFIX),
  );
  assert.equal(backups.length, 2);
  for (const key of backups)
    assert.deepEqual(JSON.parse(values[key]), recovery.data);
  assert.equal(values[SESSION_KEY], "{broken");
});

test("failed or discarded recovery writes cannot authorize overwriting the original", () => {
  const values = { [SESSION_KEY]: "{broken" };
  const source = storage(values);
  const recovery = readSavedSession(source).recovery!;
  assert.throws(
    () =>
      preserveRecovery(recovery, {
        ...source,
        setItem() {
          throw new Error("Quota exceeded");
        },
      }),
    /Quota/,
  );
  assert.throws(
    () => preserveRecovery(recovery, { ...source, setItem() {} }),
    /verified/,
  );
  assert.equal(values[SESSION_KEY], "{broken");
});
