import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import { CoachPanel } from "../../src/features/coach/CoachPanel";
import { candidatesFor } from "../../src/features/coach/candidates";
import { reviewMove } from "../../src/features/coach/grading";
import { useCoachPresentation } from "../../src/features/coach/useCoachPresentation";
import type { Recommendations } from "../../src/features/coach/useRecommendations";
import { useBoardPreview } from "../../src/features/board/useBoardPreview";
import { useBoardInteractions } from "../../src/features/board/useBoardInteractions";
import { useComputerSettings } from "../../src/features/computer/useComputerOpponent";
import { useGameController } from "../../src/features/game/useGameController";
import { createTestRoot } from "../helpers/dom";

test("calculation collapses a pending review, keeps it collapsed when ready, and new moves reopen it", async (t) => {
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
  let currentGame!: ReturnType<typeof useGameController>;
  let preview!: ReturnType<typeof useBoardPreview>;
  function Harness() {
    const computer = useComputerSettings();
    const game = useGameController(computer.disable);
    currentGame = game;
    preview = useBoardPreview(game.analysisKey, game.playable);
    const board = useBoardInteractions(game, preview, computer, false);
    const recommendations: Recommendations = {
      candidates: [],
      best: undefined,
      thinking: false,
      requested: false,
      current: false,
      analysis: null,
      continuity: false,
      calculate() {},
      clear() {},
    };
    const presentation = useCoachPresentation(game, recommendations, preview);
    return createElement(CoachPanel, {
      game,
      board,
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
  assert.equal(body().hidden, true);
  pending = false;
  await act(() => root.render(createElement(Harness)));
  assert.equal(body().hidden, true);
  assert.match(toggle().textContent!, /Last move.*1\. e4.*Best move/);
  await act(() => toggle().click());
  assert.equal(body().hidden, false);
  assert.match(body().textContent!, /Pawn from e2 to e4/);
  const reply = Array.from(body().querySelectorAll("button")).find((button) =>
    button.textContent?.includes("Likely reply"),
  )!;
  await act(() => reply.click());
  assert.equal(preview.pinned, true);
  await act(() => toggle().click());
  assert.equal(
    preview.boardPreview,
    false,
    "collapsing clears previews from the hidden review",
  );
  await act(() => currentGame.playMove("e7", "e5"));
  assert.equal(toggle().getAttribute("aria-expanded"), "true");
  assert.equal(body().hidden, false);
  assert.match(toggle().textContent!, /1… e5/);
});
