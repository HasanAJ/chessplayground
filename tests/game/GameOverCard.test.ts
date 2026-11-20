import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Chess, type Color } from "chess.js";
import { ending } from "../../src/domain/chess/position.ts";
import { GameOverCard } from "../../src/ui/game/GameOverCard.tsx";

function renderResult(fen: string, humanSide?: Color, animate = true) {
  const game = new Chess(fen);
  const reason = ending(game);
  assert.ok(reason);
  return renderToStaticMarkup(
    createElement(GameOverCard, {
      game,
      reason,
      humanSide,
      animate,
      onPlayAgain() {},
    }),
  );
}

const whiteMate = "7k/6Q1/5K2/8/8/8/8/8 b - - 0 1";
const blackMate = "8/8/8/8/8/5k2/6q1/7K w - - 0 1";

test("checkmate celebrates the correct winner without a score row", () => {
  const white = renderResult(whiteMate);
  assert.match(white, /White wins!/);
  assert.match(white, /CHECKMATE/);
  assert.doesNotMatch(white, /Final score|result-score/);
  assert.match(white, /src="\/pieces\/wK.svg"/);
  assert.match(white, /animate-celebration/);
  assert.match(white, /Play again/);
  const black = renderResult(blackMate);
  assert.match(black, /Black wins!/);
  assert.doesNotMatch(black, /Final score|result-score/);
  assert.match(black, /src="\/pieces\/bK.svg"/);
});

test("losing to the computer gets a gentle result without celebrating the opponent", () => {
  const lost = renderResult(blackMate, "w");
  assert.match(lost, /Black wins!/);
  assert.match(lost, /Want to play again/);
  assert.doesNotMatch(
    lost,
    /has-celebration|animate-celebration|result-confetti/,
  );
  assert.match(renderResult(blackMate, "b"), /animate-celebration/);
});

test("draws keep both kings and the actual draw reason without a score", () => {
  for (const [fen, reason] of [
    ["7k/5Q2/5K2/8/8/8/8/8 b - - 0 1", /Stalemate/],
    ["4k3/8/8/8/8/8/8/4K3 w - - 0 1", /Neither side has enough material/],
  ] as const) {
    const draw = renderResult(fen);
    assert.match(draw, /It’s a draw/);
    assert.doesNotMatch(draw, /Final score|result-score/);
    assert.match(draw, /src="\/pieces\/wK.svg"/);
    assert.match(draw, /src="\/pieces\/bK.svg"/);
    assert.match(draw, reason);
    assert.doesNotMatch(draw, /wins!|CHECKMATE|result-confetti/);
  }
});

test("loaded or reviewed results can keep the illustration without replaying the animation", () => {
  const result = renderResult(whiteMate, undefined, false);
  assert.match(result, /has-celebration/);
  assert.doesNotMatch(result, /animate-celebration/);
});

test("replay from the result restores a fresh game", async (t) => {
  const { act } = await import("react");
  const { createTestRoot } = await import("../helpers/dom.ts");
  const { default: App } = await import("../../src/ui/shell/App.tsx");
  const { dom, root } = createTestRoot(t);
  dom.window.localStorage.setItem("tempo-position", blackMate);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  await act(() => root.render(createElement(App)));
  const document = dom.window.document;
  assert.equal(
    document.querySelector(".game-over-card h3")?.textContent,
    "Black wins!",
  );
  const replay = document.querySelector<HTMLButtonElement>(
    ".game-over-card button",
  );
  assert.ok(replay);
  await act(() => replay.click());
  assert.equal(document.querySelector(".game-over-card"), null);
  assert.ok(document.querySelector(".calculation-controls"));
  assert.equal(
    dom.window.localStorage.getItem("tempo-position"),
    new Chess().fen(),
  );
});

test("a history-only repetition result stays localized on a position snapshot", async (t) => {
  const { act } = await import("react");
  const { createTestRoot } = await import("../helpers/dom.ts");
  const { LanguageProvider } =
    await import("../../src/i18n/LanguageProvider.tsx");
  const { translator } = await import("../../src/i18n/translate.ts");
  const { dom, root } = createTestRoot(t);
  const history = new Chess();
  for (const move of ["Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8"])
    history.move(move);
  const reason = ending(history)!;
  const position = new Chess(history.fen());
  assert.equal(position.isThreefoldRepetition(), false);
  dom.window.history.replaceState(null, "", "/de/");
  await act(() =>
    root.render(
      createElement(LanguageProvider, {
        children: createElement(GameOverCard, {
          game: position,
          reason,
          animate: false,
          onPlayAgain() {},
        }),
      }),
    ),
  );
  assert.equal(
    dom.window.document.querySelector(".result-message")?.textContent,
    translator("de")("game.ending.repetition"),
  );
});
