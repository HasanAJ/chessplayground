import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Chess } from "chess.js";
import { candidatesFor } from "../../src/features/coach/candidates";
import { reviewMove } from "../../src/features/coach/grading";
import { strategyInsight } from "../../src/features/coach/strategy";
import { BestMoveContent } from "../../src/features/coach/BestMoveContent";
import { CandidateDetails } from "../../src/features/coach/MoveDetails";
import { MoveFeedback } from "../../src/features/coach/MoveFeedback";
import { PositionDetails } from "../../src/features/coach/PositionDetails";

test("expanded move review shows its rating, explanation, and likely reply", () => {
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
    moveLabel: "2. g4 · White",
    context: "coach.feedback.context.yourLastMove" as const,
    collapsed: false,
    onToggle() {},
    onReanalyze() {},
    onInspect() {},
  };
  const revealed = renderToStaticMarkup(createElement(MoveFeedback, props));
  assert.match(revealed, /<section[^>]*class="move-feedback"/);
  assert.doesNotMatch(revealed, /<details|<summary/);
  assert.match(revealed, /Blunder/);
  assert.match(revealed, /class="feedback-context">Your last move<\/span>/);
  assert.match(revealed, /aria-expanded="true"/);
  assert.match(revealed.replace(/<[^>]*>/g, ""), /2\. g4 · White/);
  assert.match(revealed, /Qh4#/);
  assert.match(
    revealed.replace(/<[^>]*>/g, ""),
    /They can checkmate with Qh4#/,
  );
  assert.match(revealed, /Likely reply/);
  assert.doesNotMatch(revealed, /evaluation drop|99\.\d|100\.\d/);
});

test("pending automatic review identifies the selected move without stale feedback", () => {
  const pending = renderToStaticMarkup(
    createElement(MoveFeedback, {
      result: { key: "pending", state: "thinking" },
      moveLabel: "1… e5 · Black",
      context: "coach.feedback.context.selectedMove",
      collapsed: false,
      onToggle() {},
      onReanalyze() {},
      onInspect() {},
    }),
  );
  assert.match(pending, /class="feedback-context">Selected move<\/span>/);
  assert.match(pending.replace(/<[^>]*>/g, ""), /1… e5 · Black/);
  assert.match(pending, /aria-busy="true"/);
  assert.match(pending, /Reviewing…/);
  assert.doesNotMatch(pending, /Likely reply|Best move/);
});

test("failed automatic review offers a retry and keeps the move identified", () => {
  const failed = renderToStaticMarkup(
    createElement(MoveFeedback, {
      result: {
        key: "error",
        state: "error",
        error: "The engine could not start.",
      },
      moveLabel: "1. e4 · White",
      collapsed: false,
      onToggle() {},
      onReanalyze() {},
      onInspect() {},
    }),
  );
  assert.match(failed.replace(/<[^>]*>/g, ""), /1\. e4 · White/);
  assert.match(failed, /The engine could not start/);
  assert.match(failed, /Retry move review/);
  assert.doesNotMatch(failed, /Likely reply/);
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
      continuity: false,
      preview: null,
      onInspect() {},
      onPlay() {},
    }),
  );
  assert.match(
    card.replace(/<[^>]*>/g, ""),
    /Your pawn takes space in the center on e4/,
  );
  assert.match(card.replace(/<[^>]*>/g, ""), /Play e4/);
  assert.match(card, /aria-expanded="false"/);
  assert.match(card, /Preview reply/);
  assert.doesNotMatch(
    card,
    /LIKELY REPLY|Engine continuation|Only legal move|score-pill|About this position/,
  );
});

test("position analysis is a separate closed disclosure with evaluation and highlights", () => {
  const game = new Chess();
  game.move("e4");
  game.move("e5");
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, cp: 30, pv: ["g1f3", "b8c6", "f1c4"] },
  ])[0];
  const details = renderToStaticMarkup(
    createElement(PositionDetails, {
      candidate,
      insight: strategyInsight(game, candidate),
      forcedMove: false,
      inCheck: false,
      highlighted: false,
      onHighlightChange() {},
      onHighlightPreviewChange() {},
    }),
  );
  assert.equal((details.match(/<details\b/g) ?? []).length, 1);
  assert.doesNotMatch(details, /<details[^>]*\bopen=/);
  assert.match(details, /About this position/);
  assert.match(details, /score-pill/);
  assert.doesNotMatch(details, /Scores use pawn units|Positive favors White/);
  assert.match(details, /Highlight key squares/);
  assert.doesNotMatch(details, /LIKELY REPLY|Engine continuation/);
});

test("position details omit the highlight control when no concrete squares are discussed", () => {
  const game = new Chess("4k3/8/8/8/8/8/8/R3K3 w - - 0 1");
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, cp: 500, pv: ["a1a2"] },
  ])[0];
  const details = renderToStaticMarkup(
    createElement(PositionDetails, {
      candidate,
      insight: strategyInsight(game, candidate),
      forcedMove: false,
      inCheck: false,
      highlighted: false,
      onHighlightChange() {},
      onHighlightPreviewChange() {},
    }),
  );
  assert.doesNotMatch(
    details,
    /Highlight key squares|Hide key squares|key-squares-note/,
  );
});

test("forced moves get a prominent label without repeating check advice in position details", () => {
  const game = new Chess("7k/4K3/5B2/8/8/8/8/7R b - - 0 1");
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, cp: -800, pv: ["h8g8", "h1h8"] },
  ])[0];
  const card = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: game.moves().length === 1,
      continuity: true,
      preview: null,
      onInspect() {},
      onPlay() {},
    }),
  );
  assert.match(card, /Only legal move/);
  assert.match(card.replace(/<[^>]*>/g, ""), /Escape check/);
  assert.doesNotMatch(card, /Plan continues|Your king needs attention first/);
  const details = renderToStaticMarkup(
    createElement(PositionDetails, {
      candidate,
      insight: {
        ...strategyInsight(game, candidate),
        change: "The king is in check.",
      },
      forcedMove: true,
      inCheck: true,
      highlighted: false,
      onHighlightChange() {},
      onHighlightPreviewChange() {},
    }),
  );
  assert.doesNotMatch(
    details,
    /only one legal move|WHAT CHANGED|The king is in check/,
  );
});

test("a mating move has no reply preview action", () => {
  const game = new Chess("6k1/4K3/5B2/8/8/8/8/7R w - - 1 2");
  const candidate = candidatesFor(game.fen(), [
    { rank: 1, depth: 18, mate: 1, pv: ["h1h8"] },
  ])[0];
  assert.equal(candidate.move.san, "Rh8#");
  const card = renderToStaticMarkup(
    createElement(BestMoveContent, {
      candidate,
      forcedMove: false,
      continuity: false,
      preview: null,
      onInspect() {},
      onPlay() {},
    }),
  );
  assert.match(card.replace(/<[^>]*>/g, ""), /Play Rh8/);
  assert.doesNotMatch(card, /Preview reply/);
});

test("shared continuation details select the preview step only for the matching move", () => {
  const candidates = candidatesFor(new Chess().fen(), [
    { rank: 1, depth: 18, cp: 30, pv: ["e2e4", "e7e5", "g1f3"] },
    { rank: 2, depth: 18, cp: 20, pv: ["d2d4", "d7d5", "c2c4"] },
  ]);
  const render = (index: number) =>
    renderToStaticMarkup(
      createElement(CandidateDetails, {
        candidate: candidates[index],
        preview: { candidate: candidates[0], ply: 2 },
        onInspect() {},
      }),
    );
  const selected = render(0);
  assert.equal((selected.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.match(
    selected,
    /class="current-step" aria-label="Preview move 2: Black plays e5"/,
  );
  assert.doesNotMatch(render(1), /aria-pressed="true"|current-step/);
});
