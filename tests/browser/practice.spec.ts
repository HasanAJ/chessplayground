import { Chess } from "chess.js";
import { practicePositions } from "../../src/content/practice/positions.ts";
import { test, expect } from "./fixtures.ts";

test("random practice stays distinct, resets the workspace, survives reload, and can be played", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-square="e2"]').click();
  await page.locator('[data-square="e4"]').click();
  await page.getByRole("button", { name: "Get a hint", exact: true }).click();
  const random = page.getByRole("button", {
    name: "Random position",
    exact: true,
  });
  let current = await page.locator("#fen-input").inputValue();
  const recent: string[] = [];
  for (let index = 0; index < 8; index++) {
    await random.click();
    await expect(page.locator("#fen-input")).not.toHaveValue(current);
    current = await page.locator("#fen-input").inputValue();
    expect(practicePositions.some((p) => p.fen === current)).toBe(true);
    expect(recent).not.toContain(current);
    recent.push(current);
    if (recent.length > 5) recent.shift();
  }
  await expect(page.locator(".move-history")).toHaveCount(0);
  await expect(
    page.locator(".hint-card, .best-move-heading, .chessboard.previewing"),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.locator("#fen-input")).toHaveValue(current);
  const move = new Chess(current).moves({ verbose: true })[0];
  await page.locator(`[data-square="${move.from}"]`).click();
  await page.locator(`[data-square="${move.to}"]`).click();
  if (move.promotion)
    await page.locator(`.promotion-choices button`).first().click();
  await expect(page.locator(".move-history .latest")).toBeVisible();
});

test("random practice keeps the computer side and level and starts on the human's turn", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".computer-settings-trigger").click();
  await page.locator(".computer-side-options button").last().click();
  await page.locator(".computer-level-options button").nth(3).click();
  await page.locator(".computer-toggle").click();
  await page
    .getByRole("button", { name: "Random position", exact: true })
    .click();
  await expect(page.locator(".computer-toggle")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.locator(".turn-status")).toHaveText("Your turn");
  await expect(page.locator(".move-history")).toHaveCount(0);
  const fen = await page.locator("#fen-input").inputValue();
  expect(new Chess(fen).turn()).toBe("b");
  await page.locator(".computer-settings-trigger").click();
  await expect(
    page.locator(".computer-side-options button").last(),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator(".computer-level-options button").nth(3),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".computer-settings .primary-button").click();
  const move = new Chess(fen)
    .moves({ verbose: true })
    .find((move) => !new Chess(move.after).isGameOver())!;
  await page.locator(`[data-square="${move.from}"]`).click();
  await page.locator(`[data-square="${move.to}"]`).click();
  if (move.promotion)
    await page.locator(".promotion-choices button").first().click();
  await expect(page.locator(".move-history > button")).toHaveCount(3);
  expect(new Chess(await page.locator("#fen-input").inputValue()).turn()).toBe(
    "b",
  );
});
