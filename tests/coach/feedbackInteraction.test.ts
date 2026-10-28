import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import { CoachPanel } from "../../src/features/coach/CoachPanel";
import { MoveFeedback } from "../../src/features/coach/MoveFeedback";
import { candidatesFor } from "../../src/features/coach/candidates";
import { reviewMove } from "../../src/features/coach/grading";
import { useCoachPresentation } from "../../src/features/coach/useCoachPresentation";
import type { Recommendations } from "../../src/features/coach/useRecommendations";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { useComputerSettings } from "../../src/features/computer/useComputerSettings";
import { useGameController } from "../../src/features/game/useGameController";
import { createTestRoot } from "../helpers/dom";

test("calculation hides the last move review until the next move, including when refreshing", async (t) => {
  const { root, dom } = createTestRoot(t);
  const fixture = new Chess();
  const reviews = ["e4", "e5"].map((san) => {
    const before = fixture.fen();
    const move = fixture.move(san);
    const best = candidatesFor(before, [
      { rank: 1, depth: 15, cp: 20, pv: [move.lan] },
    ])[0];
    const reply = candidatesFor(fixture.fen(), [
      {
        rank: 1,
        depth: 15,
        cp: 20,
        pv: [fixture.moves({ verbose: true })[0].lan],
      },
    ])[0];
    return reviewMove(move, best, reply);
  });
  let pending = true;
  let calculations = 0;
  let requested = false;
  let currentGame!: ReturnType<typeof useGameController>;
  let preview!: ReturnType<typeof useBoardPreview>;
  function Harness() {
    const computer = useComputerSettings();
    const game = useGameController(computer.disable);
    currentGame = game;
    preview = useBoardPreview(game.analysisKey, game.playable);
    const candidates = requested
      ? candidatesFor(game.analysisFen, [{
          rank: 1, depth: 15, cp: 20,
          pv: [game.analysisGame.moves({ verbose: true })[0].lan],
        }])
      : [];
    const recommendations: Recommendations = {
      candidates,
      best: candidates[0],
      thinking: false,
      requested,
      current: false,
      analysis: requested
        ? { key: game.analysisKey, candidates, best: candidates[0], language: "en", state: "ready" }
        : null,
      calculate() {},
      clear() {},
    };
    const presentation = useCoachPresentation(game, recommendations, preview);
    return createElement(CoachPanel, {
      game,
      onPlayMove: game.playMove,
      preview,
      computer,
      recommendations,
      presentation,
      opponent: { turn: false, busy: false, state: "idle", retry() {} },
      feedback: game.lastMove
        ? pending
          ? { key: game.analysisKey, state: "thinking" }
          : {
              key: game.analysisKey,
              state: "ready",
              review: reviews[game.history.length - 1],
            }
        : null,
      feedbackPly: game.history.length,
      onReviewRetry() {},
      onCalculate() {
        calculations++;
        requested = true;
      },
      onNewGame() {},
      onShowHistory() {},
    });
  }
  await act(() => root.render(createElement(Harness)));
  await act(() => currentGame.playMove("e2", "e4"));
  const document = dom.window.document;
  const toggle = () =>
    document.querySelector<HTMLButtonElement>(".feedback-toggle")!;
  const body = () => document.querySelector<HTMLElement>(".feedback-body")!;
  assert.equal(toggle().getAttribute("aria-expanded"), "true");
  await act(() =>
    document.querySelector<HTMLButtonElement>(".calculate-button")!.click(),
  );
  assert.equal(calculations, 1);
  assert.equal(document.querySelector(".move-feedback"), null);
  pending = false;
  await act(() => root.render(createElement(Harness)));
  assert.equal(document.querySelector(".move-feedback"), null);
  await act(() => currentGame.playMove("e7", "e5"));
  assert.equal(toggle().getAttribute("aria-expanded"), "true");
  assert.equal(body().hidden, false);
  assert.match(toggle().textContent!, /Last move.*Pawn from e7 to e5.*Best move/);
  const reply = Array.from(body().querySelectorAll("button")).find((button) =>
    button.textContent?.includes("Opponent’s possible reply"),
  )!;
  await act(() => reply.click());
  assert.equal(preview.pinned, true);
  await act(() => toggle().click());
  assert.equal(
    preview.boardPreview,
    false,
    "collapsing clears previews from the hidden review",
  );
  await act(() => toggle().click());
  assert.equal(toggle().getAttribute("aria-expanded"), "true");
  assert.equal(body().hidden, false);
  await act(() =>
    document.querySelector<HTMLButtonElement>(".refresh-analysis")!.click(),
  );
  assert.equal(calculations, 2);
  assert.equal(document.querySelector(".move-feedback"), null);
});

test("Inaccuracy reviews keep the grade and position score without analysis details", async (t) => {
  const { root, dom } = createTestRoot(t);
  const game = new Chess();
  const best = candidatesFor(game.fen(), [{ rank: 1, depth: 15, cp: 0, pv: ["g1f3"] }])[0];
  const move = game.move("a3");
  const reply = candidatesFor(game.fen(), [{ rank: 1, depth: 15, cp: 70, pv: ["e7e5"] }])[0];
  const review = reviewMove(move, best, reply);
  assert.equal(review.label, "Inaccuracy");
  await act(() => root.render(createElement(MoveFeedback, {
    result: { key: "inaccuracy", state: "ready", review },
    move,
    moveLabel: "1. a3 · White",
    collapsed: false,
    onToggle() {},
    onReanalyze() {},
    onInspect() {},
  })));
  const document = dom.window.document;
  assert.equal(document.querySelector(".quality-badge")!.textContent, "Inaccuracy");
  assert.equal(document.querySelector(".feedback-position-score strong")!.textContent, "−0.70");
  assert.equal(document.querySelector(".feedback-explanation p")!.textContent, review.text);
  assert.doesNotMatch(document.querySelector(".feedback-body")!.textContent!, /Analysis details|evaluation drop|Quick review/);
});

test("consequence previews stay with the explanation and preserve the tactical position", async (t) => {
  for (const [name, fen, bestMove, line] of [
    ["capture", "4k3/8/8/8/8/2b5/1R6/6K1 w - - 0 1", "b2b3", ["g1h1", "c3b2"]],
    ["defended capture", "4k3/8/8/8/8/2b5/1R6/1R4K1 w - - 0 1", "b2b3", ["g1h1", "c3b2"]],
    ["fork", "4k3/8/8/8/3n4/8/7P/R3K3 w - - 0 1", "e1f1", ["h2h3", "d4c2"]],
    ["later capture", "r3q1k1/p1R5/2p5/2P2Q2/4P3/8/Pb6/2K5 w - - 0 11", "c1d2", ["c1b2", "e8b8", "b2c1", "b8c7"]],
    ["checkmate", "rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2", "g2g3", ["g2g4", "d8h4"]],
  ] as const) {
    await t.test(name, async (t) => {
      const { root, dom } = createTestRoot(t);
      const best = candidatesFor(fen, [
        { rank: 1, depth: 20, cp: 300, pv: [bestMove] },
      ])[0];
      const played = candidatesFor(fen, [
        { rank: 2, depth: 20, cp: -300, pv: [...line] },
      ])[0];
      const review = reviewMove(played.move, best, undefined, false, played);
      const lesson = review.lesson!;
      assert.equal(lesson.kind, "consequence");
      let preview!: ReturnType<typeof useBoardPreview>;
      let collapsed = false;
      function Harness() {
        preview = useBoardPreview(played.move.after, true);
        return createElement(MoveFeedback, {
          result: { key: name, state: "ready", review },
          move: played.move,
          moveLabel: played.move.san,
          preview: preview.inspection,
          collapsed,
          onToggle() {},
          onReanalyze() {},
          onInspect: preview.inspectMove,
        });
      }
      await act(() => root.render(createElement(Harness)));
      const document = dom.window.document;
      const explanation = document.querySelector(".feedback-explanation")!;
      assert.equal(explanation.querySelector("p")!.textContent, review.text);
      const button = explanation.querySelector<HTMLButtonElement>(".explanation-link")!;
      assert.equal(button.textContent!.trim(), lesson.focus!.label);
      assert.equal(document.querySelector(".feedback-alternative"), null);

      await act(() => button.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true })));
      assert.equal(preview.inspection?.candidate, lesson.candidate);
      assert.equal(preview.inspection?.ply, lesson.ply);
      assert.equal(preview.inspection?.focus, lesson.focus);
      assert.equal(preview.previewGame!.fen(), lesson.candidate.continuation[lesson.ply - 1].after);
      await act(() => button.dispatchEvent(new dom.window.MouseEvent("mouseout", { bubbles: true })));
      assert.equal(preview.boardPreview, false);

      await act(() => button.click());
      assert.equal(preview.pinned, true);
      assert.equal(button.getAttribute("aria-pressed"), "true");
      collapsed = true;
      await act(() => root.render(createElement(Harness)));
      assert.equal(preview.boardPreview, false);
    });
  }
});

test("better-move previews name and show the alternative for both explained and quiet moves", async (t) => {
  for (const [fen, bestMove, playedMove] of [
    [new Chess().fen(), "e2e4", "a2a3"],
    ["4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "e1f1", "a1a2"],
  ]) {
    await t.test(bestMove, async (t) => {
      const { root, dom } = createTestRoot(t);
      const best = candidatesFor(fen, [
        { rank: 1, depth: 20, cp: 300, pv: [bestMove] },
      ])[0];
      const played = candidatesFor(fen, [
        { rank: 2, depth: 20, cp: -300, pv: [playedMove] },
      ])[0];
      const review = reviewMove(played.move, best, undefined, false, played);
      assert.equal(review.lesson!.kind, "alternative");
      if (bestMove === "e1f1") assert.equal(best.explanation, "");
      let preview!: ReturnType<typeof useBoardPreview>;
      let collapsed = false;
      function Harness() {
        preview = useBoardPreview(played.move.after, true);
        return createElement(MoveFeedback, {
          result: { key: bestMove, state: "ready", review },
          move: played.move,
          moveLabel: played.move.san,
          preview: preview.inspection,
          collapsed,
          onToggle() {},
          onReanalyze() {},
          onInspect: preview.inspectMove,
        });
      }
      await act(() => root.render(createElement(Harness)));
      const document = dom.window.document;
      const alternative = document.querySelector(".feedback-alternative")!;
      assert.equal(alternative.querySelector("p")!.textContent, `Try ${best.move.san} instead`);
      const button = alternative.querySelector<HTMLButtonElement>("button")!;
      assert.equal(button.textContent!.trim(), `Preview ${best.move.san}`);

      await act(() => button.focus());
      assert.equal(preview.inspection?.candidate, best);
      assert.equal(preview.inspection?.ply, 1);
      await act(() => button.blur());
      assert.equal(preview.boardPreview, false);
      await act(() => button.click());
      assert.equal(preview.pinned, true);
      assert.equal(preview.previewGame!.fen(), best.move.after);
      assert.equal(button.getAttribute("aria-pressed"), "true");
      collapsed = true;
      await act(() => root.render(createElement(Harness)));
      assert.equal(preview.boardPreview, false);
    });
  }
});
