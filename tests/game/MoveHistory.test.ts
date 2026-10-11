import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Chess } from "chess.js";
import { MoveHistory } from "../../src/features/game/MoveHistory";

function renderHistory(game: Chess, selectedPly: number | null) {
  return renderToStaticMarkup(
    createElement(MoveHistory, {
      history: game.history({ verbose: true }),
      selectedPly,
      onSelect() {},
    }),
  );
}

test("history highlights exactly one position, including Start and the latest move", () => {
  const game = new Chess();
  game.move("e4");
  game.move("c5");

  for (const [ply, label] of [
    [null, "View position after 1… c5"],
    [0, "View starting position"],
    [1, "View position after 1. e4"],
  ] as const) {
    const markup = renderHistory(game, ply);
    const buttons = markup.match(/<button\b[^>]*>/g) ?? [];
    const selected = buttons.filter((button) =>
      button.includes('aria-current="step"'),
    );
    assert.equal(selected.length, 1);
    assert.ok(selected[0].includes(`aria-label="${label}"`));
    assert.equal((markup.match(/current-history/g) ?? []).length, 1);
  }
});

test("a loaded Black-to-move position keeps its original move number in history", () => {
  const game = new Chess("4k3/8/8/8/8/8/8/R3K3 b - - 0 19");
  game.move("Kd7");
  const markup = renderHistory(game, null);
  assert.match(markup, /View position after 19… Kd7/);
  assert.match(markup.replace(/<[^>]*>/g, ""), /19…Kd7/);
});

test("a new game has no empty history component", () => {
  assert.equal(renderHistory(new Chess(), null), "");
});
