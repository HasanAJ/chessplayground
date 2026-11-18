import type { Locator, Page } from "@playwright/test";
import { test, expect } from "./fixtures.ts";

const square = (page: Page, name: string) =>
  page.locator(`#play-workspace [data-square="${name}"]`);
const arrows = (page: Page) =>
  page.locator("#play-workspace .annotation-arrows line");

async function center(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
}

async function draw(page: Page, from: string, to: string) {
  const start = await center(square(page, from));
  const end = await center(square(page, to));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(end.x, end.y, { steps: 5 });
  await page.mouse.up({ button: "right" });
}

test.beforeEach(async ({ isMobile }) => {
  test.skip(isMobile, "Annotations use a right mouse button.");
});

test("annotations use chess.com modifier colors without changing the game", async ({
  page,
}) => {
  await page.goto("/");
  await expect(square(page, "a2")).toBeVisible();
  const position = await page.evaluate(() =>
    localStorage.getItem("tempo-position"),
  );
  const cases = [
    { key: null, squareColor: "red", arrowColor: "yellow", file: "a" },
    { key: "Control", squareColor: "yellow", arrowColor: "red", file: "b" },
    { key: "Alt", squareColor: "blue", arrowColor: "blue", file: "c" },
    { key: "Shift", squareColor: "green", arrowColor: "green", file: "d" },
  ];
  for (const { key, squareColor, arrowColor, file } of cases) {
    const target = key ? `${file}2` : `${file}4`;
    if (key) await page.keyboard.down(key);
    await square(page, target).click({ button: "right" });
    await expect(
      square(page, target).locator(`.annotation-${squareColor}`),
    ).toBeVisible();
    await draw(page, `${file}2`, `${file}3`);
    const overlay = page.locator(
      `#play-workspace .annotation-arrows.annotation-${arrowColor}`,
    );
    await expect(overlay).toBeVisible();
    await expect(
      overlay.locator(`line[data-from="${file}2"][data-to="${file}3"]`),
    ).toHaveCount(1);
    if (key) await page.keyboard.up(key);
    await expect(square(page, `${file}2`).locator("img")).toHaveCount(1);
  }
  await expect(arrows(page)).toHaveCount(4);
  expect(
    await page.evaluate(() => localStorage.getItem("tempo-position")),
  ).toBe(position);
  await expect(page.locator(".move-history .latest")).toHaveCount(0);
});

test("Command right-click toggles red highlights without removing pieces", async ({
  page,
}) => {
  await page.goto("/");
  await expect(square(page, "a2")).toBeVisible();
  const position = await page.evaluate(() =>
    localStorage.getItem("tempo-position"),
  );
  for (const name of ["a2", "e4"]) {
    const highlight = square(page, name).locator(".annotation-red");
    await square(page, name).click({ button: "right", modifiers: ["Meta"] });
    await expect(highlight).toBeVisible();
    await expect(square(page, "a2").locator("img")).toHaveCount(1);
    await square(page, name).click({ button: "right", modifiers: ["Meta"] });
    await expect(highlight).toHaveCount(0);
    await expect(square(page, "a2").locator("img")).toHaveCount(1);
  }
  expect(
    await page.evaluate(() => localStorage.getItem("tempo-position")),
  ).toBe(position);
  await square(page, "a2").click({ button: "right", modifiers: ["Meta"] });
  await square(page, "a2").click({ button: "right" });
  await expect(square(page, "a2").locator("img")).toHaveCount(0);
  await expect(page.locator("#play-workspace .square-annotation")).toHaveCount(
    0,
  );
});

test("annotations toggle, recolor and clear on normal board interaction", async ({
  page,
}) => {
  await page.goto("/");
  const highlight = square(page, "e4").locator(".square-annotation");
  await square(page, "e4").click({ button: "right" });
  await square(page, "e4").click({ button: "right" });
  await expect(highlight).toHaveCount(0);
  await square(page, "e4").click({ button: "right" });
  await square(page, "e4").click({ button: "right", modifiers: ["Alt"] });
  await expect(highlight).toHaveCount(1);
  await expect(highlight).toHaveClass(/annotation-blue/);
  await draw(page, "e2", "e4");
  await draw(page, "e2", "e4");
  await expect(arrows(page)).toHaveCount(0);
  await draw(page, "e2", "e4");
  await page.keyboard.down("Shift");
  await draw(page, "e2", "e4");
  await page.keyboard.up("Shift");
  await expect(arrows(page)).toHaveCount(1);
  await square(page, "e2").click();
  await expect(arrows(page)).toHaveCount(0);
  await expect(highlight).toHaveCount(0);
  await square(page, "e4").click();
  await expect(square(page, "e4").locator("img")).toHaveAttribute(
    "src",
    "/pieces/wP.svg",
  );
});

test("arrow previews follow the pointer and annotations follow a flipped board", async ({
  page,
}) => {
  await page.goto("/");
  const start = await center(square(page, "e2"));
  const end = await center(square(page, "e4"));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(end.x, end.y, { steps: 5 });
  await expect(arrows(page)).toHaveCount(1);
  await expect(arrows(page)).toHaveAttribute("x1", "450");
  await page.keyboard.down("Alt");
  await page.mouse.up({ button: "right" });
  await page.keyboard.up("Alt");
  await expect(
    page.locator("#play-workspace .annotation-arrows.annotation-blue"),
  ).toBeVisible();
  await square(page, "d4").click({ button: "right" });
  await page.locator(".flip-board-button").click();
  await expect(arrows(page)).toHaveAttribute("x1", "350");
  await expect(arrows(page)).toHaveAttribute("y1", "150");
  await expect(square(page, "d4").locator(".annotation-red")).toBeVisible();
  await draw(page, "e2", "e4");
  await expect(arrows(page)).toHaveCount(1);
  await expect(
    page.locator("#play-workspace .annotation-arrows.annotation-yellow"),
  ).toBeVisible();
  await draw(page, "e2", "e4");
  await expect(arrows(page)).toHaveCount(0);
});

test("cancelling an arrow outside the board or at its origin preserves the piece", async ({
  page,
}) => {
  await page.goto("/");
  const start = await center(square(page, "e2"));
  const end = await center(square(page, "e4"));
  const board = await page.locator("#play-workspace .chessboard").boundingBox();
  for (const release of [{ x: board!.x - 10, y: end.y }, start]) {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down({ button: "right" });
    await page.mouse.move(end.x, end.y);
    await expect(arrows(page)).toHaveCount(1);
    await page.mouse.move(release.x, release.y);
    await page.mouse.up({ button: "right" });
    await expect(arrows(page)).toHaveCount(0);
    await expect(square(page, "e2").locator("img")).toHaveCount(1);
  }
  await draw(page, "e2", "e4");
  await expect(arrows(page)).toHaveCount(1);
});

test("copying a historical position preserves annotations and a new game clears them", async ({
  page,
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await square(page, "e2").click();
  await square(page, "e4").click();
  await page
    .getByRole("button", { name: "Previous game move", exact: true })
    .click();
  await square(page, "d4").click({ button: "right" });
  await draw(page, "g1", "f3");
  await page
    .getByRole("button", { name: "Copy current FEN", exact: true })
    .click();
  await expect(page.locator(".panel-notice")).toHaveText("Position copied");
  await expect(square(page, "d4").locator(".annotation-red")).toBeVisible();
  await expect(arrows(page)).toHaveCount(1);
  await expect(page.locator(".panel-notice")).toHaveCount(0);
  await expect(square(page, "d4").locator(".annotation-red")).toBeVisible();
  await expect(arrows(page)).toHaveCount(1);
  await page.getByRole("button", { name: "New game", exact: true }).click();
  await expect(page.locator("#play-workspace .square-annotation")).toHaveCount(
    0,
  );
  await expect(arrows(page)).toHaveCount(0);
});

test("changing the position clears annotations while lesson arrows stay separate", async ({
  page,
}) => {
  await page.goto("/");
  await square(page, "e2").click();
  await square(page, "e4").click();
  await draw(page, "e7", "e5");
  await page
    .getByRole("button", { name: "Previous game move", exact: true })
    .click();
  await expect(arrows(page)).toHaveCount(0);
  await page.goto("/openings/wayward-rook/");
  for (let step = 0; step < 4; step++)
    await page.locator(".opening-forward").click();
  const board = page.locator(".opening-board");
  const teachingArrows = await board.locator(".opening-arrows line").count();
  expect(teachingArrows).toBeGreaterThan(0);
  await board.locator('[data-square="e4"]').click({ button: "right" });
  await expect(
    board.locator(".square-annotation.annotation-red"),
  ).toBeVisible();
  await board.locator('[data-square="e4"]').click();
  await expect(board.locator(".square-annotation")).toHaveCount(0);
  await expect(board.locator(".opening-arrows line")).toHaveCount(
    teachingArrows,
  );
});
