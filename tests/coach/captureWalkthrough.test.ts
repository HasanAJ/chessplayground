import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/domain/coach/candidatePresentation.ts";
import { reviewMove } from "../../src/domain/coach/grading.ts";
import { CoachPanel } from "../../src/ui/coach/CoachPanel.tsx";
import { useCoachPresentation } from "../../src/ui/coach/useCoachPresentation.ts";
import type { Recommendations } from "../../src/ui/coach/useRecommendations.ts";
import { BoardPanel } from "../../src/ui/board/BoardPanel.tsx";
import { useBoardPreview } from "../../src/ui/board/useBoardPreview.ts";
import { SquareHighlightProvider } from "../../src/ui/board/SquareHighlight.tsx";
import { useComputerSettings } from "../../src/ui/computer/useComputerSettings.ts";
import { useGameController } from "../../src/ui/game/useGameController.ts";
import { walkthroughPresentation } from "../../src/ui/board/walkthroughPresentation.ts";
import { english } from "../../src/i18n/translate.ts";
import { createTestRoot } from "../helpers/dom.ts";

const fen = "r3q1k1/p1R5/2p5/2P2Q2/4P3/8/Pb6/2K5 w - - 0 11";

async function mount(
  t: TestContext,
  fixture = {
    fen,
    best: "c1d2",
    line: ["c1b2", "e8b8", "b2c1", "b8c7"],
  },
) {
  const { root, dom } = createTestRoot(t);
  dom.window.localStorage.setItem("tempo-position", fixture.fen);
  const animations: {
    square: string;
    frames: Keyframe[];
    canceled: boolean;
  }[] = [];
  dom.window.HTMLElement.prototype.animate = function (frames) {
    const animation = {
      square: this.closest("[data-square]")!.getAttribute("data-square")!,
      frames: frames as Keyframe[],
      canceled: false,
      cancel() {
        this.canceled = true;
      },
    };
    animations.push(animation);
    return animation as unknown as Animation;
  };
  const played = candidatesFor(fixture.fen, [
    {
      rank: 2,
      depth: 20,
      cp: -300,
      pv: fixture.line,
    },
  ])[0];
  const best = candidatesFor(fixture.fen, [
    { rank: 1, depth: 20, cp: 300, pv: [fixture.best] },
  ])[0];
  const review = reviewMove(played.move, best, undefined, false, played);
  let game!: ReturnType<typeof useGameController>;
  let preview!: ReturnType<typeof useBoardPreview>;
  function Harness() {
    const computer = useComputerSettings();
    game = useGameController(computer.disable);
    preview = useBoardPreview(game.analysisKey, game.playable);
    const recommendations: Recommendations = {
      settings: { seconds: 2, moves: 3 },
      settingsValid: true,
      updateSettings() {},
      candidates: [],
      best: undefined,
      thinking: false,
      requested: false,
      current: false,
      analysis: null,
      calculate() {},
      clear() {},
    };
    const highlights = useCoachPresentation(game, recommendations, preview);
    return createElement(
      SquareHighlightProvider,
      { positionKey: game.analysisKey, children: null },
      createElement(BoardPanel, {
        game,
        preview,
        computer,
        highlights,
        analysis: recommendations,
        botTurn: false,
        selectionReset: 0,
        onDraggingChange() {},
        onNewGame() {},
        onRandomPosition() {},
        onShowHistory() {},
      }),
      createElement(CoachPanel, {
        game,
        preview,
        computer,
        recommendations,
        presentation: highlights,
        opponent: { turn: false, busy: false, state: "idle", retry() {} },
        onPlayMove: game.playMove,
        feedback: game.lastMove
          ? { key: game.analysisKey, state: "ready", review }
          : null,
        feedbackPly: game.history.length,
        onReviewRetry() {},
        onCalculate() {},
        onNewGame() {},
        onShowHistory() {},
      }),
    );
  }
  await act(() => root.render(createElement(Harness)));
  await act(() => game.playMove(played.move.from, played.move.to));
  const document = dom.window.document;
  for (const square of document.querySelectorAll<HTMLElement>(
    ".chessboard [data-square]",
  )) {
    const coordinate = square.dataset.square!;
    square.getBoundingClientRect = () =>
      ({
        x: (coordinate.charCodeAt(0) - 97) * 50,
        y: (8 - Number(coordinate[1])) * 50,
      }) as DOMRect;
  }
  const button = (label: string) =>
    Array.from(
      document.querySelectorAll<HTMLButtonElement>(".coach-panel button"),
    ).find((element) => element.textContent?.trim() === label)!;
  return {
    document,
    animations,
    button,
    get game() {
      return game;
    },
    get preview() {
      return preview;
    },
  };
}

test("the capture walkthrough connects the played move, check, reply, and capture without changing the game", async (t) => {
  const view = await mount(t);
  const { document, button } = view;
  const original = { fen: view.game.fen, history: view.game.history };
  const selectStep = (index: number) =>
    act(() =>
      document
        .querySelectorAll<HTMLButtonElement>(
          ".coach-panel .walkthrough-moves button",
        )
        [index].click(),
    );
  const link = button("Show the threat and replies");
  await act(() => link.click());
  assert.equal(view.preview.inspection?.ply, 1);
  assert.match(
    document.querySelector(".walkthrough-caption")!.textContent!,
    /Your king takes their bishop and moves to b2/,
  );
  assert.equal(button("Back"), undefined);
  assert.equal(button("Next"), undefined);
  assert.doesNotMatch(
    document.querySelector(".capture-walkthrough")!.textContent!,
    /Step \d+ of \d+|Follow the next reply/,
  );
  assert.equal(
    document.querySelector(".walkthrough-note")?.textContent,
    "This move gets the king out of check.",
  );
  assert.equal(
    document.querySelectorAll(".coach-panel .walkthrough-moves button").length,
    4,
    "stop after the exchange when no recapture follows",
  );
  assert.equal(document.querySelector(".explanation-arrows"), null);

  await selectStep(1);
  assert.equal(view.preview.previewGame?.get("b8")?.type, "q");
  assert.match(
    document.querySelector(".walkthrough-caption")!.textContent!,
    /Their queen moves from e8 to b8.*gives check/,
  );
  assert.equal(view.animations[0].square, "b8");
  assert.equal(view.animations[0].frames[0].transform, "translate(150px, 0px)");
  assert.equal(link.getAttribute("aria-pressed"), "true");
  await selectStep(0);
  assert.equal(view.preview.inspection?.ply, 1);
  assert.equal(view.animations.at(-2)!.square, "e8");
  assert.equal(
    view.animations.at(-2)!.frames[0].transform,
    "translate(-150px, 0px)",
  );

  await selectStep(2);
  assert.match(
    document.querySelector(".walkthrough-caption")!.textContent!,
    /gets the king out of check/,
  );
  await selectStep(3);
  assert.equal(view.preview.previewGame?.get("c7")?.type, "q");
  assert.match(
    document.querySelector(".walkthrough-caption")!.textContent!,
    /Their queen takes your rook/,
  );
  assert.doesNotMatch(
    document.querySelector(".capture-walkthrough")!.textContent!,
    /Step \d+ of \d+|The capture has happened|Further trades may follow/,
  );
  assert.equal(
    document.querySelector(".walkthrough-note")?.textContent,
    undefined,
  );
  assert.match(
    document.querySelector(".walkthrough-outcome")!.textContent!,
    /lose 2 material points overall/,
  );
  assert.ok(document.querySelector('[data-square="c7"].strategy-square'));
  assert.ok(document.querySelector(".explanation-arrows"));
  assert.equal(
    document
      .querySelectorAll(".coach-panel .walkthrough-moves button")[3]
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(view.game.fen, original.fen);
  assert.deepEqual(view.game.history, original.history);
  await act(() => button("Return to game").click());
  assert.equal(view.preview.boardPreview, false);
  assert.equal(document.querySelector(".capture-walkthrough"), null);
  assert.equal(
    document.querySelector('[data-square="c7"] .piece')?.getAttribute("src"),
    "/pieces/wR.svg",
  );
  assert.ok(view.animations.every((animation) => animation.canceled));
});

test("captions describe either side, checkmate, castling, promotion, and en passant accurately", () => {
  const opponentMove = new Chess().move("e4");
  assert.equal(
    walkthroughPresentation(opponentMove, "b", english).description,
    "Their pawn moves from e2 to e4.",
  );
  const ep = new Chess("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1").move("exd6");
  assert.equal(
    walkthroughPresentation(ep, "w", english).description,
    "Your pawn takes their pawn and moves to d6.",
  );
  const castle = new Chess("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1").move("O-O");
  assert.equal(
    walkthroughPresentation(castle, "b", english).description,
    "You castle, moving your king and rook.",
  );
  const promotion = new Chess("7k/P7/8/8/8/8/8/4K3 w - - 0 1").move("a8=N");
  assert.match(
    walkthroughPresentation(promotion, "w", english).description,
    /pawn becomes a knight/,
  );
  const mate = new Chess("7k/8/5KQ1/8/8/8/8/8 w - - 0 1").move("Qg7#");
  assert.equal(
    walkthroughPresentation(mate, "w", english).note,
    "This is checkmate.",
  );
});

test("the h3 walkthrough shows both Nd5 threats, the safer queen move, and the recapture result", async (t) => {
  const view = await mount(t, {
    fen: "1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ2/P2P1PPP/3RR1K1 w - - 4 3",
    best: "f3e2",
    line: ["h2h3", "f6d5", "f3e2", "d5e3", "e2e3"],
  });
  const { document, button } = view;
  const originalFen = view.game.fen;
  assert.match(
    document.querySelector(".feedback-explanation")!.textContent!,
    /opens an attack by their rook/,
  );
  assert.match(
    document.querySelector(".feedback-best-reason")!.textContent!,
    /queen to e2, avoiding the attack after Nd5/,
  );
  await act(() => button("Show the threat and replies").click());
  const selectStep = (index: number) =>
    act(() =>
      document
        .querySelectorAll<HTMLButtonElement>(
          ".coach-panel .walkthrough-moves button",
        )
        [index].click(),
    );
  assert.equal(
    document.querySelectorAll(".coach-panel .walkthrough-moves button").length,
    5,
  );
  assert.equal(document.querySelector(".explanation-arrows"), null);
  await selectStep(1);
  assert.match(
    document.querySelector(".walkthrough-threat")!.textContent!,
    /knight on d5 attacks your bishop on e3/,
  );
  assert.match(
    document.querySelector(".walkthrough-threat")!.textContent!,
    /rook on f8 against your queen on f3/,
  );
  assert.ok(document.querySelector('[data-square="f8"].strategy-square'));
  assert.ok(document.querySelector('[data-square="f3"].strategy-square'));
  assert.ok(document.querySelector('[data-square="e3"].strategy-square'));
  await selectStep(4);
  assert.equal(view.preview.previewGame!.get("e3")?.type, "q");
  assert.match(
    document.querySelector(".walkthrough-outcome")!.textContent!,
    /material balance stays the same/,
  );
  assert.equal(view.game.fen, originalFen);
  await act(() => button("Return to game").click());
  assert.equal(view.preview.boardPreview, false);
});

test("the stalemate walkthrough explains the drawn endpoint without a material-loss summary", async (t) => {
  const view = await mount(t, {
    fen: "7k/7b/6R1/3PP3/3PKB2/4PP2/P5Q1/8 w - - 0 1",
    best: "e4f5",
    line: ["a2a3", "h7g6", "g2g6"],
  });
  const { document, button } = view;
  const originalFen = view.game.fen;
  await act(() => button("See the piece they can capture").click());
  await act(() =>
    document
      .querySelectorAll<HTMLButtonElement>(
        ".coach-panel .walkthrough-moves button",
      )[2]
      .click(),
  );
  assert.equal(view.preview.previewGame!.isStalemate(), true);
  assert.equal(
    document.querySelector(".walkthrough-outcome")!.textContent,
    english("game.ending.stalemate"),
  );
  assert.doesNotMatch(
    document.querySelector(".walkthrough-caption")!.textContent!,
    /material points|recapture/,
  );
  assert.equal(view.game.fen, originalFen);
  await act(() => button("Return to game").click());
  assert.equal(view.preview.boardPreview, false);
});

test("hovering a future square shows its incoming move without advancing the board or disrupting a walkthrough", async (t) => {
  const view = await mount(t, {
    fen: "1kr2r2/ppp1q1bp/3ppn2/8/B1P1P3/1P2BQ2/P2P1PPP/3RR1K1 w - - 4 3",
    best: "f3e2",
    line: ["h2h3", "f6d5", "f3e2", "d5e3", "e2e3"],
  });
  const { document, button } = view;
  const original = { fen: view.game.fen, history: view.game.history };
  const destination = document.querySelector<HTMLButtonElement>(
    '.feedback-explanation [data-square-reference="d5"]',
  )!;
  const bishop = document.querySelector<HTMLButtonElement>(
    '.feedback-explanation [data-square-reference="e3"]',
  )!;
  const hover = (element: HTMLElement, enter = true) =>
    act(() =>
      element.dispatchEvent(
        new document.defaultView!.MouseEvent(enter ? "mouseover" : "mouseout", {
          bubbles: true,
        }),
      ),
    );
  const arrow = () =>
    document.querySelector<SVGLineElement>(".reference-move-arrow line");
  const coordinates = () =>
    ["x1", "y1", "x2", "y2"].map((name) => Number(arrow()!.getAttribute(name)));
  assert.equal(
    destination.getAttribute("aria-label"),
    "d5: Knight from f6 to d5",
  );
  await hover(destination);
  assert.ok(document.querySelector('[data-square="d5"].reference-square'));
  assert.deepEqual(
    coordinates().slice(0, 2),
    [550, 250],
    "the arrow starts at f6",
  );
  assert.ok(
    coordinates()[2] > 350 && coordinates()[2] < 375,
    "the arrow points to d5",
  );
  assert.ok(
    document.querySelector('[data-square="f6"] .piece[src="/pieces/bN.svg"]'),
  );
  assert.equal(document.querySelector('[data-square="d5"] .piece'), null);
  assert.equal(view.preview.boardPreview, false);
  assert.equal(view.game.fen, original.fen);
  assert.equal(view.game.history, original.history);

  const unflipped = coordinates();
  await act(() =>
    document.querySelector<HTMLButtonElement>(".flip-board-button")!.click(),
  );
  coordinates().forEach((value, index) =>
    assert.ok(Math.abs(value - (800 - unflipped[index])) < 1e-9),
  );
  await act(() =>
    document.querySelector<HTMLButtonElement>(".flip-board-button")!.click(),
  );
  await hover(destination, false);
  assert.equal(arrow(), null);

  await act(() => destination.focus());
  assert.ok(arrow(), "keyboard focus also shows the path");
  await hover(bishop);
  assert.equal(
    arrow(),
    null,
    "an existing piece keeps its ordinary square highlight",
  );
  await hover(bishop, false);
  assert.ok(arrow(), "leaving another reference restores the focused move");
  await act(() => destination.blur());
  assert.equal(arrow(), null);

  await act(() => button("Show the threat and replies").click());
  await hover(destination);
  assert.ok(
    arrow(),
    "the opening walkthrough position can show the incoming move",
  );
  await act(() =>
    document
      .querySelectorAll<HTMLButtonElement>(
        ".coach-panel .walkthrough-moves button",
      )[1]
      .click(),
  );
  assert.equal(view.preview.previewGame!.get("d5")?.type, "n");
  assert.equal(
    arrow(),
    null,
    "the move arrow disappears once the knight has moved",
  );
  assert.equal(
    document.querySelectorAll(".explanation-arrows line").length,
    2,
    "the walkthrough's tactical arrows stay visible",
  );
  await hover(destination, false);
  await act(() => button("Return to game").click());
  assert.equal(view.game.fen, original.fen);
  assert.equal(view.game.history, original.history);
});
