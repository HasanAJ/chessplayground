import test from "node:test";
import assert from "node:assert/strict";
import type { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { startComputerTurn } from "../../src/features/computer/computer";
import { START_FEN } from "../../src/chess/position";

function computerTurn() {
  let search: Parameters<AnalysisEngine["analyze"]>[1];
  let cancelled = false;
  const engine: Pick<AnalysisEngine, "analyze"> = {
    analyze(_fen, callbacks) {
      search = callbacks;
      return () => {
        cancelled = true;
      };
    },
  };
  const moves: string[] = [];
  let waiting = 0;
  let errors = 0;
  const cancel = startComputerTurn(
    engine,
    START_FEN,
    { rootFen: START_FEN, moves: [] },
    "beginner",
    {
      onWaiting() {
        waiting++;
      },
      onMove(uci) {
        moves.push(uci);
      },
      onError() {
        errors++;
      },
    },
  );
  return {
    moves,
    cancel,
    complete: (uci: string) => search.onComplete([], uci),
    get waiting() {
      return waiting;
    },
    get errors() {
      return errors;
    },
    get cancelled() {
      return cancelled;
    },
  };
}

test("a fast computer search waits until one second after the turn starts", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const turn = computerTurn();
  t.mock.timers.tick(250);
  turn.complete("e2e4");
  assert.equal(turn.waiting, 1);
  t.mock.timers.tick(749);
  assert.deepEqual(turn.moves, []);
  t.mock.timers.tick(1);
  assert.deepEqual(turn.moves, ["e2e4"]);
});

test("a slow computer search does not add a second pause", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const turn = computerTurn();
  t.mock.timers.tick(1300);
  turn.complete("g1f3");
  assert.deepEqual(turn.moves, ["g1f3"]);
  assert.equal(turn.waiting, 0);
});

test("pausing or changing the board cancels a computer move waiting to play", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const turn = computerTurn();
  t.mock.timers.tick(200);
  turn.complete("e2e4");
  turn.cancel();
  t.mock.timers.tick(2000);
  assert.deepEqual(turn.moves, []);
  assert.equal(turn.cancelled, true);
});

test("a cancelled computer search cannot schedule a late move", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const turn = computerTurn();
  turn.cancel();
  turn.complete("e2e4");
  t.mock.timers.tick(2000);
  assert.deepEqual(turn.moves, []);
  assert.equal(turn.waiting, 0);
});

test("an invalid computer result reports an error instead of scheduling a move", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const turn = computerTurn();
  turn.complete("(none)");
  t.mock.timers.tick(2000);
  assert.equal(turn.errors, 1);
  assert.equal(turn.waiting, 0);
  assert.deepEqual(turn.moves, []);
});
