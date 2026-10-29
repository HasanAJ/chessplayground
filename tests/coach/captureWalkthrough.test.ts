import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidatePresentation";
import { reviewMove } from "../../src/features/coach/grading";
import { CoachPanel } from "../../src/features/coach/CoachPanel";
import { useCoachPresentation } from "../../src/features/coach/useCoachPresentation";
import type { Recommendations } from "../../src/features/coach/useRecommendations";
import { BoardPanel } from "../../src/features/board/BoardPanel";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { useComputerSettings } from "../../src/features/computer/useComputerSettings";
import { useGameController } from "../../src/features/game/useGameController";
import { walkthroughPresentation } from "../../src/features/board/walkthroughPresentation";
import { english } from "../../src/i18n/translate";
import { createTestRoot } from "../helpers/dom";

const fen = "r3q1k1/p1R5/2p5/2P2Q2/4P3/8/Pb6/2K5 w - - 0 11";

async function mount(t: TestContext) {
  const { root, dom } = createTestRoot(t);
  dom.window.localStorage.setItem("tempo-position", fen);
  const animations: { square: string; frames: Keyframe[]; canceled: boolean }[] = [];
  dom.window.HTMLElement.prototype.animate = function (frames) {
    const animation = {
      square: this.closest("[data-square]")!.getAttribute("data-square")!,
      frames: frames as Keyframe[],
      canceled: false,
      cancel() { this.canceled = true; },
    };
    animations.push(animation);
    return animation as unknown as Animation;
  };
  const played = candidatesFor(fen, [{
    rank: 2, depth: 20, cp: -300,
    pv: ["c1b2", "e8b8", "b2c1", "b8c7", "f5c5"],
  }])[0];
  const best = candidatesFor(fen, [{ rank: 1, depth: 20, cp: 300, pv: ["c1d2"] }])[0];
  const review = reviewMove(played.move, best, undefined, false, played);
  let game!: ReturnType<typeof useGameController>;
  let preview!: ReturnType<typeof useBoardPreview>;
  function Harness() {
    const computer = useComputerSettings();
    game = useGameController(computer.disable);
    preview = useBoardPreview(game.analysisKey, game.playable);
    const recommendations: Recommendations = {
      candidates: [], best: undefined, thinking: false, requested: false, current: false,
      analysis: null, calculate() {}, clear() {},
    };
    const highlights = useCoachPresentation(game, recommendations, preview);
    return createElement("div", null,
      createElement(BoardPanel, {
        game, preview, computer, highlights, analysis: recommendations,
        botTurn: false, selectionReset: 0,
        onDraggingChange() {}, onNewGame() {}, onShowHistory() {},
      }),
      createElement(CoachPanel, {
        game, preview, computer, recommendations, presentation: highlights,
        opponent: { turn: false, busy: false, state: "idle", retry() {} },
        onPlayMove: game.playMove,
        feedback: game.lastMove ? { key: game.analysisKey, state: "ready", review } : null,
        feedbackPly: game.history.length,
        onReviewRetry() {}, onCalculate() {}, onNewGame() {}, onShowHistory() {},
      }),
    );
  }
  await act(() => root.render(createElement(Harness)));
  await act(() => game.playMove("c1", "b2"));
  const document = dom.window.document;
  for (const square of document.querySelectorAll<HTMLElement>(".chessboard [data-square]")) {
    const coordinate = square.dataset.square!;
    square.getBoundingClientRect = () => ({
      x: (coordinate.charCodeAt(0) - 97) * 50,
      y: (8 - Number(coordinate[1])) * 50,
    }) as DOMRect;
  }
  const button = (label: string) => Array.from(document.querySelectorAll<HTMLButtonElement>(".coach-panel button"))
    .find((element) => element.textContent?.trim() === label)!;
  return {
    document, animations, button,
    get game() { return game; },
    get preview() { return preview; },
  };
}

test("the capture walkthrough connects the played move, check, reply, and capture without changing the game", async (t) => {
  const view = await mount(t);
  const { document, button } = view;
  const original = { fen: view.game.fen, history: view.game.history };
  const link = button("Show how the capture happens");
  await act(() => link.click());
  assert.equal(view.preview.inspection?.ply, 1);
  assert.match(document.querySelector(".walkthrough-caption")!.textContent!, /Your king takes their bishop and moves to b2/);
  assert.equal(button("Back").disabled, true);
  assert.equal(document.querySelectorAll(".coach-panel .walkthrough-moves button").length, 4, "stop at the explained capture, before later trades");
  assert.equal(document.querySelector(".explanation-arrows"), null);

  await act(() => button("Next").click());
  assert.equal(view.preview.previewGame?.get("b8")?.type, "q");
  assert.match(document.querySelector(".walkthrough-caption")!.textContent!, /Their queen moves from e8 to b8.*gives check/);
  assert.equal(view.animations[0].square, "b8");
  assert.equal(view.animations[0].frames[0].transform, "translate(150px, 0px)");
  assert.equal(link.getAttribute("aria-pressed"), "true");
  await act(() => button("Back").click());
  assert.equal(view.preview.inspection?.ply, 1);
  assert.equal(view.animations.at(-2)!.square, "e8");
  assert.equal(view.animations.at(-2)!.frames[0].transform, "translate(-150px, 0px)");

  await act(() => document.querySelectorAll<HTMLButtonElement>(".coach-panel .walkthrough-moves button")[2].click());
  assert.match(document.querySelector(".walkthrough-caption")!.textContent!, /gets the king out of check/);
  await act(() => button("Next").click());
  assert.equal(view.preview.previewGame?.get("c7")?.type, "q");
  assert.match(document.querySelector(".walkthrough-caption")!.textContent!, /Their queen takes your rook.*Further trades may follow/);
  assert.ok(document.querySelector('[data-square="c7"].strategy-square'));
  assert.ok(document.querySelector(".explanation-arrows"));
  assert.equal(button("Next").disabled, true);
  assert.equal(view.game.fen, original.fen);
  assert.deepEqual(view.game.history, original.history);
  await act(() => button("Return to game").click());
  assert.equal(view.preview.boardPreview, false);
  assert.equal(document.querySelector(".capture-walkthrough"), null);
  assert.equal(document.querySelector('[data-square="c7"] .piece')?.getAttribute("src"), "/pieces/wR.svg");
  assert.ok(view.animations.every(animation => animation.canceled));
});

test("captions describe either side, checkmate, castling, promotion, and en passant accurately", () => {
  const opponentMove = new Chess().move("e4");
  assert.equal(walkthroughPresentation(opponentMove, "b", false, english).description, "Their pawn moves from e2 to e4.");
  const ep = new Chess("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1").move("exd6");
  assert.equal(walkthroughPresentation(ep, "w", false, english).description, "Your pawn takes their pawn and moves to d6.");
  const castle = new Chess("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1").move("O-O");
  assert.equal(walkthroughPresentation(castle, "b", false, english).description, "You castle, moving your king and rook.");
  const promotion = new Chess("7k/P7/8/8/8/8/8/4K3 w - - 0 1").move("a8=N");
  assert.match(walkthroughPresentation(promotion, "w", false, english).description, /pawn becomes a knight/);
  const mate = new Chess("7k/8/5KQ1/8/8/8/8/8 w - - 0 1").move("Qg7#");
  assert.equal(walkthroughPresentation(mate, "w", false, english).note, "This is checkmate.");
});
