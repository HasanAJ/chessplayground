import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement, type DragEvent } from "react";
import type { Square } from "chess.js";
import { checkedGame, START_FEN } from "../../src/chess/position";
import { SESSION_KEY } from "../../src/chess/study";
import { useGameController } from "../../src/features/game/useGameController";
import { useBoardInteractions } from "../../src/features/board/useBoardInteractions";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { useComputerSettings } from "../../src/features/computer/useComputerOpponent";
import { candidatesFor } from "../../src/features/coach/candidates";
import { Continuation } from "../../src/features/coach/MoveDetails";
import { SaveNotice } from "../../src/features/game/SaveNotice";
import { RECOVERY_PREFIX } from "../../src/features/game/storage";
import { createTestRoot } from "../helpers/dom";

async function mount(
  t: TestContext,
  saved: Record<string, string> = {},
  writesFail = false,
) {
  const { dom, root } = createTestRoot(t);
  for (const [key, value] of Object.entries(saved))
    dom.window.localStorage.setItem(key, value);
  if (writesFail)
    dom.window.Storage.prototype.setItem = () => {
      throw new Error("Storage full");
    };
  let current!: {
    game: ReturnType<typeof useGameController>;
    board: ReturnType<typeof useBoardInteractions>;
    preview: ReturnType<typeof useBoardPreview>;
  };
  const candidate = candidatesFor(START_FEN, [
    { rank: 1, depth: 12, cp: 20, pv: ["e2e4", "e7e5", "g1f3"] },
  ])[0];
  function Harness() {
    const computer = useComputerSettings();
    const game = useGameController(computer.disable);
    const preview = useBoardPreview(game.analysisKey, game.playable);
    const board = useBoardInteractions(game, preview, computer, false);
    current = { game, board, preview };
    return createElement(
      "div",
      { id: "board", ref: board.ref },
      createElement(Continuation, {
        candidate,
        preview: preview.inspection,
        onInspect: preview.inspectMove,
      }),
      createElement("button", { id: "outside" }, "Back to board"),
      createElement(SaveNotice, {
        error: game.storageError,
        recovery: game.recovery,
        paused: game.autosavePaused,
        onResume: game.resumeAutosave,
        onDismiss: game.dismissRecovery,
      }),
    );
  }
  await act(() => root.render(createElement(Harness)));
  return { read: () => current, dom, candidate };
}

function drop(from: Square): DragEvent {
  return {
    preventDefault() {},
    dataTransfer: { getData: () => from },
  } as unknown as DragEvent;
}

test("manual legal drags retain study identity, history, counters and autosave", async (t) => {
  const { read, dom } = await mount(t);
  const id = read().game.study.id;
  await act(() => read().game.playMove("e2", "e4"));
  await act(() => read().board.dropPiece(drop("e7"), "e5"));
  assert.equal(read().game.study.id, id);
  assert.deepEqual(read().game.history.map((move) => move.san), ["e4", "e5"]);
  assert.equal(read().game.fen.split(" ")[5], "2");
  assert.equal(
    JSON.parse(dom.window.localStorage.getItem(SESSION_KEY)!).nodes.length,
    2,
  );
});

test("legal drags use chess rules for castling, en passant and promotion", async (t) => {
  const { read } = await mount(t);
  for (const [fen, from, to, san] of [
    ["r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 7 12", "e1", "g1", "O-O"],
    ["4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 19", "e5", "d6", "exd6"],
    ["7k/P7/8/8/8/8/8/4K3 w - - 0 8", "a7", "a8", "a8=N"],
  ] as const) {
    await act(() => read().game.replaceGame(checkedGame(fen)));
    const id = read().game.study.id;
    await act(() => read().board.dropPiece(drop(from), to));
    if (from === "a7") {
      assert.deepEqual(read().game.promotion, { from, to });
      assert.equal(read().game.history.length, 0);
      await act(() => read().board.playMove(from, to, "n"));
    }
    assert.equal(read().game.study.id, id);
    assert.deepEqual(read().game.history.map((move) => move.san), [san]);
  }
});

test("clicked previews survive blur and temporary hover, then Escape restores the game", async (t) => {
  const { read, dom, candidate } = await mount(t);
  const buttons = dom.window.document.querySelectorAll<HTMLButtonElement>(
    ".continuation-moves button",
  );
  await act(() => {
    buttons[1].focus();
    buttons[1].click();
  });
  await act(() => dom.window.document.getElementById("outside")!.focus());
  assert.equal(read().preview.inspection?.ply, 2);
  await act(() => read().preview.inspectMove(candidate, 3, "hover"));
  assert.equal(read().preview.inspection?.ply, 3);
  await act(() => read().preview.inspectMove(candidate, 0, "hover"));
  assert.equal(read().preview.inspection?.ply, 2);
  assert.equal(read().game.fen, START_FEN);
  assert.equal(read().game.history.length, 0);
  await act(() =>
    dom.window.document.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Escape" }),
    ),
  );
  assert.equal(read().preview.boardPreview, false);
});

test("kept previews clear when playing a suggestion or changing the position", async (t) => {
  const { read, candidate } = await mount(t);
  await act(() => read().preview.inspectMove(candidate, 2, "click"));
  await act(() => read().board.playSuggestedMove("e2", "e4"));
  assert.equal(read().preview.boardPreview, false);
  assert.deepEqual(read().game.history.map((move) => move.san), ["e4"]);
  await act(() => read().preview.inspectMove(candidate, 1, "click"));
  await act(() => read().game.newGame());
  assert.equal(read().preview.boardPreview, false);
});

test("unreadable sessions are untouched until recovery is explicitly resolved", async (t) => {
  const fen = "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 37 42";
  const { read, dom } = await mount(t, {
    [SESSION_KEY]: "{broken",
    "tempo-position": fen,
  });
  const storage = dom.window.localStorage;
  assert.equal(read().game.autosavePaused, true);
  assert.equal(read().game.fen, fen);
  await act(() => read().game.playMove("e8", "d7"));
  assert.equal(storage.getItem(SESSION_KEY), "{broken");
  assert.equal(storage.getItem("tempo-position"), fen);
  const notice = dom.window.document.querySelector(".save-notice")!;
  const buttons = Array.from(notice.querySelectorAll("button"));
  assert.equal(buttons.length, 1);
  assert.equal(buttons[0].textContent, "Keep current game & resume saving");
  await act(() =>
    buttons
      .find((button) => button.textContent?.includes("resume saving"))!
      .click(),
  );
  assert.equal(read().game.autosavePaused, false);
  const backup = Object.keys(storage).find((key) =>
    key.startsWith(RECOVERY_PREFIX),
  )!;
  assert.deepEqual(JSON.parse(storage.getItem(backup)!), {
    [SESSION_KEY]: "{broken",
  });
  assert.deepEqual(
    JSON.parse(storage.getItem(SESSION_KEY)!).nodes.map(
      (node: { uci: string }) => node.uci,
    ),
    ["e8d7"],
  );
  const dismiss = Array.from(notice.querySelectorAll("button")).find(
    (button) => button.textContent === "Dismiss recovery notice",
  )!;
  await act(() => dismiss.click());
  assert.equal(dom.window.document.querySelector(".save-notice"), null);
});

test("quota failures keep recovery paused and expose a complete save warning", async (t) => {
  const { read, dom } = await mount(t, { [SESSION_KEY]: "{broken" }, true);
  await act(() => read().game.resumeAutosave());
  assert.equal(read().game.autosavePaused, true);
  assert.equal(dom.window.localStorage.getItem(SESSION_KEY), "{broken");
  assert.match(
    dom.window.document.querySelector(".save-notice")!.textContent!,
    /Autosave remains paused/,
  );
  assert.match(
    dom.window.document.querySelector(".save-notice")!.textContent!,
    /Your latest changes may not survive a reload/,
  );
});

test("ordinary autosave failures keep play usable and show a live save warning", async (t) => {
  const { read, dom } = await mount(t, {}, true);
  await act(() => read().game.playMove("e2", "e4"));
  assert.deepEqual(read().game.history.map((move) => move.san), ["e4"]);
  const notice = dom.window.document.querySelector(".save-notice")!;
  assert.equal(notice.getAttribute("role"), "status");
  assert.match(
    notice.textContent!,
    /Your latest changes may not survive a reload/,
  );
  assert.equal(notice.querySelector("button"), null);
});

test("repetition outcomes follow the displayed history and a continued branch", async (t) => {
  const { read } = await mount(t);
  for (const [from, to] of [
    ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"],
    ["g1", "f3"], ["g8", "f6"], ["f3", "g1"], ["f6", "g8"],
  ] as const)
    await act(() => read().game.playMove(from, to));
  assert.match(read().game.terminal!, /repetition/i);
  assert.equal(read().board.terminal, read().game.terminal);
  const finished = read().game.study;
  await act(() => read().game.playMove("e2", "e4"));
  assert.equal(read().game.study, finished, "terminal games reject further moves");
  await act(() => read().game.showHistory(4));
  assert.equal(read().game.analysisTerminal, null);
  assert.equal(read().board.terminal, null);
  await act(() => read().game.playMove("e2", "e4"));
  assert.equal(read().game.terminal, null);
  assert.equal(read().board.terminal, null);
  assert.equal(read().game.study.id, finished.id);
  assert.equal(read().game.study.mainTipId, finished.tipId);
  assert.equal(read().game.study.nodes.length, 9);
  assert.deepEqual(read().game.history.map((move) => move.san), ["Nf3", "Nf6", "Ng1", "Ng8", "e4"]);
});
