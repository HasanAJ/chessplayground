import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { act, createElement, useRef } from "react";
import { Chess, type Move, type Square } from "chess.js";
import { useComputerMoveAnimation } from "../../src/features/board/useComputerMoveAnimation";
import { createTestRoot } from "../helpers/dom";

async function mount(t: TestContext, reducedMotion = false) {
  const { dom, root } = createTestRoot(t);
  Object.defineProperty(dom.window, "matchMedia", {
    value: () => ({ matches: reducedMotion }),
  });
  const animations: {
    square: string;
    piece: boolean;
    frames: Keyframe[];
    options: KeyframeAnimationOptions;
    canceled: boolean;
    onfinish: (() => void) | null;
  }[] = [];
  dom.window.HTMLElement.prototype.animate = function (frames, options) {
    const animation = {
      square: this.closest("[data-square]")!.getAttribute("data-square")!,
      piece: this.matches(".piece"),
      frames: frames as Keyframe[],
      options: options as KeyframeAnimationOptions,
      canceled: false,
      onfinish: null as (() => void) | null,
      cancel() {
        this.canceled = true;
      },
    };
    animations.push(animation);
    return animation as unknown as Animation;
  };
  function Harness({
    move,
    previewing,
    flipped,
  }: {
    move: Move | null;
    previewing: boolean;
    flipped: boolean;
  }) {
    const ref = useRef<HTMLDivElement>(null);
    useComputerMoveAnimation(ref, move, previewing, flipped);
    const game = new Chess(move?.after);
    const squares = Array.from("abcdefgh").flatMap((file) =>
      Array.from({ length: 8 }, (_, index) => `${file}${index + 1}` as Square),
    );
    return createElement(
      "div",
      { ref },
      squares.map((square) =>
        createElement(
          "div",
          {
            key: square,
            "data-square": square,
            ref: (element: HTMLDivElement | null) => {
              if (!element) return;
              const column = square.charCodeAt(0) - "a".charCodeAt(0);
              const row = 8 - Number(square[1]);
              element.getBoundingClientRect = () =>
                ({
                  x: (flipped ? 7 - column : column) * 50,
                  y: (flipped ? 7 - row : row) * 50,
                }) as DOMRect;
            },
          },
          game.get(square) &&
            createElement("img", { className: "piece", alt: "" }),
        ),
      ),
    );
  }
  const render = async (
    move: Move | null,
    previewing = false,
    flipped = false,
  ) => {
    await act(() =>
      root.render(createElement(Harness, { move, previewing, flipped })),
    );
  };
  await render(null);
  return { render, animations, dom };
}

test("computer pieces slide from their actual square on either board orientation", async (t) => {
  const { render, animations } = await mount(t);
  for (const flipped of [false, true]) {
    await render(new Chess().move("e4"), false, flipped);
    const slide = animations.at(-2)!;
    const arrival = animations.at(-1)!;
    assert.equal(slide.piece, true);
    assert.equal(slide.square, "e4");
    assert.equal(
      slide.frames[0].transform,
      `translate(0px, ${flipped ? -100 : 100}px)`,
    );
    assert.equal(slide.frames[1].transform, "translate(0, 0)");
    assert.equal(arrival.piece, false);
    assert.equal(arrival.options.delay, slide.options.duration);
  }
});

test("computer castling slides and highlights the king and rook on either side and wing", async (t) => {
  const { render, animations } = await mount(t);
  for (const color of ["w", "b"]) {
    for (const san of ["O-O", "O-O-O"]) {
      const game = new Chess(`r3k2r/8/8/8/8/8/8/R3K2R ${color} KQkq - 0 1`);
      const rank = color === "w" ? "1" : "8";
      const squares =
        san === "O-O" ? [`g${rank}`, `f${rank}`] : [`c${rank}`, `d${rank}`];
      const start = animations.length;
      await render(game.move(san));
      for (const piece of [true, false])
        assert.deepEqual(
          animations
            .slice(start)
            .filter((animation) => animation.piece === piece)
            .map((animation) => animation.square),
          squares,
        );
    }
  }
});

test("en passant and promotion animate only the moved piece", async (t) => {
  const { render, animations } = await mount(t);
  for (const [fen, san] of [
    ["4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1", "exd6"],
    ["7k/P7/8/8/8/8/8/4K3 w - - 0 1", "a8=N"],
  ]) {
    const move = new Chess(fen).move(san);
    const start = animations.length;
    await render(move);
    assert.deepEqual(
      animations.slice(start).map(({ square, piece }) => ({ square, piece })),
      [
        { square: move.to, piece: true },
        { square: move.to, piece: false },
      ],
    );
  }
});

test("reduced motion uses only a short fade, without travel or destination pulse", async (t) => {
  const { render, animations } = await mount(t, true);
  await render(new Chess().move("e4"));
  assert.equal(animations.length, 1);
  assert.ok(Number(animations[0].options.duration) <= 200);
  assert.deepEqual(animations[0].frames, [{ opacity: 0.35 }, { opacity: 1 }]);
});

test("changing the board cancels all motion and previewing never replays a computer move", async (t) => {
  const { render, animations, dom } = await mount(t);
  const move = new Chess().move("e4");
  await render(move);
  assert.equal(
    dom.window.document.querySelectorAll(".moving-piece-square").length,
    1,
  );
  await render(move, true);
  assert.ok(animations.every((animation) => animation.canceled));
  assert.equal(
    dom.window.document.querySelectorAll(".moving-piece-square").length,
    0,
  );
  await render(move, false);
  assert.equal(animations.length, 2);
});
