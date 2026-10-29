import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidatePresentation";
import { reviewMove } from "../../src/features/coach/grading";
import { BestMoveContent } from "../../src/features/coach/BestMoveContent";
import { Continuation } from "../../src/features/coach/MoveDetails";
import { MoveFeedback } from "../../src/features/coach/MoveFeedback";

test("expanded move review puts the threat preview with the explanation", () => {
  const game = new Chess();
  game.move("f3");
  game.move("e5");
  const best = candidatesFor(game.fen(), [
    { rank: 1, depth: 17, cp: -70, pv: ["g2g3"] },
  ])[0];
  const move = game.move("g4");
  const reply = candidatesFor(game.fen(), [
    { rank: 1, depth: 17, mate: 1, pv: ["d8h4"] },
  ])[0];
  const review = reviewMove(move, best, reply);
  const props = {
    result: { key: "test", state: "ready" as const, review },
    move,
    moveLabel: "2. g4 · White",
    context: "coach.feedback.context.yourLastMove" as const,
    collapsed: false,
    onToggle() {},
    onReanalyze() {},
    onInspect() {},
    onClearInspection() {},
  };
  const revealed = renderToStaticMarkup(createElement(MoveFeedback, props));
  assert.match(revealed, /Blunder/);
  assert.match(revealed, /class="feedback-piece" src="\/pieces\/wP.svg"/);
  assert.match(revealed, /class="feedback-context">Your last move<\/span>/);
  assert.match(revealed, /aria-expanded="true"/);
  assert.match(revealed.replace(/<[^>]*>/g, ""), /2\. g4 · White/);
  assert.doesNotMatch(revealed, /Qh4#|top choice/);
  assert.match(
    revealed.replace(/<[^>]*>/g, ""),
    /Their queen can move to h4 and give checkmate/,
  );
  assert.match(revealed, /See their checkmate threat/);
  assert.doesNotMatch(revealed, /Before you move/);
  assert.doesNotMatch(revealed, /Opponent’s possible reply/);
});

test("pending automatic review identifies the selected move without stale feedback", () => {
  const game = new Chess();
  game.move("e4");
  const move = game.move("e5");
  const pending = renderToStaticMarkup(
    createElement(MoveFeedback, {
      result: { key: "pending", state: "thinking" },
      move,
      moveLabel: "1… e5 · Black",
      context: "coach.feedback.context.selectedMove",
      collapsed: false,
      onToggle() {},
      onReanalyze() {},
      onInspect() {},
      onClearInspection() {},
    }),
  );
  assert.match(pending, /class="feedback-context">Selected move<\/span>/);
  assert.match(pending.replace(/<[^>]*>/g, ""), /1… e5 · Black/);
  assert.match(pending, /aria-busy="true"/);
  assert.match(pending, /Reviewing…/);
  assert.match(pending, /class="feedback-piece" src="\/pieces\/bP.svg"/);
  assert.doesNotMatch(pending, /Opponent’s possible reply|Best move/);
});

test("failed automatic review offers a retry and keeps the move identified", () => {
  const failed = renderToStaticMarkup(
    createElement(MoveFeedback, {
      result: {
        key: "error",
        state: "error",
        error: "The engine could not start.",
      },
      move: new Chess().move("e4"),
      moveLabel: "1. e4 · White",
      collapsed: false,
      onToggle() {},
      onReanalyze() {},
      onInspect() {},
      onClearInspection() {},
    }),
  );
  assert.match(failed.replace(/<[^>]*>/g, ""), /1\. e4 · White/);
  assert.match(failed, /The engine could not start/);
  assert.match(failed, /Retry move review/);
  assert.doesNotMatch(failed, /Opponent’s possible reply/);
});

test("the best move starts compact, with its reply and continuation hidden", () => {
  const game = new Chess();
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5", "g1f3"] },
  ])[0];
  const card = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: false,
      preview: null,
      onInspect() {},
      onClearInspection() {},
      onPlay() {},
    }),
  );
  assert.match(
    card.replace(/<[^>]*>/g, ""),
    /Your pawn takes space in the center and attacks d5 and f5/,
  );
  assert.match(card.replace(/<[^>]*>/g, ""), /Play e4/);
  assert.match(card, /aria-expanded="false"/);
  assert.match(card, /Explore this move/);
  assert.match(card, /class="score-pill" aria-label="Position score: \+0\.30"/);
  assert.doesNotMatch(
    card,
    /continuation-moves|Only legal move/,
  );
});

test("forced moves keep their label alongside the score from White's perspective", () => {
  const game = new Chess("7k/4K3/5B2/8/8/8/8/7R b - - 0 1");
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, cp: -800, pv: ["h8g8", "h1h8"] },
  ])[0];
  const card = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: game.moves().length === 1,
      preview: null,
      onInspect() {},
      onClearInspection() {},
      onPlay() {},
    }),
  );
  assert.match(card, /Only legal move/);
  assert.match(card, /src="\/pieces\/bK\.svg" alt="" draggable="false"/);
  assert.match(card, /class="score-pill" aria-label="Position score: \+8\.00"/);
  assert.match(card.replace(/<[^>]*>/g, ""), /King from h8 to g8/);
});

test("a mating move can be explored without inventing a reply", () => {
  const game = new Chess("6k1/4K3/5B2/8/8/8/8/7R w - - 1 2");
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, mate: 1, pv: ["h1h8"] },
  ])[0];
  assert.equal(candidate.move.san, "Rh8#");
  const card = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: false,
      preview: null,
      onInspect() {},
      onClearInspection() {},
      onPlay() {},
    }),
  );
  assert.match(card.replace(/<[^>]*>/g, ""), /Play Rh8/);
  assert.match(card, /class="score-pill" aria-label="Position score: \+M1"/);
  assert.match(card, /Explore this move/);
  assert.doesNotMatch(card, /Opponent’s possible reply/);
});

test("shared continuation details select the preview step only for the matching move", () => {
  const candidates = candidatesFor(new Chess().fen(), [
    { rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5", "g1f3"] },
    { rank: 2, depth: 18, cp: 20, pv: ["d2d4", "d7d5", "c2c4"] },
  ]);
  const render = (index: number) =>
    renderToStaticMarkup(
      createElement(Continuation, {
        candidate: candidates[index],
        preview: { candidate: candidates[0], ply: 2 },
        onInspect() {},
        onClearInspection() {},
      }),
    );
  const selected = render(0);
  assert.equal((selected.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.match(
    selected,
    /class="current-step" aria-label="Preview move 2: Black, Pawn from e7 to e5"/,
  );
  assert.doesNotMatch(render(1), /aria-pressed="true"|current-step/);
});
