import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures.ts";

const square = (page: Page, name: string) =>
  page.locator(`#play-workspace [data-square="${name}"]`);
async function move(page: Page, from: string, to: string) {
  await square(page, from).click();
  await square(page, to).click();
}
async function loadFen(page: Page, fen: string) {
  const toggle = page.locator(".position-editor-toggle");
  if (
    (await toggle.isVisible()) &&
    (await toggle.getAttribute("aria-expanded")) === "false"
  )
    await toggle.click();
  await page.locator("#fen-input").fill(fen);
  await page.locator(".fen-controls button[type=submit]").click();
}

test("legal play, history branching and reload keep the chosen game", async ({
  page,
}) => {
  await page.goto("/");
  await move(page, "e2", "e4");
  await move(page, "e7", "e5");
  await move(page, "g1", "f3");
  await expect(page.locator(".move-history")).toContainText("Nf3");
  await page
    .getByRole("button", { name: "Previous game move", exact: true })
    .click();
  await move(page, "b1", "c3");
  await expect(page.locator(".move-history")).toContainText("Nc3");
  await expect(page.locator(".move-history")).not.toContainText("Nf3");
  await page.reload();
  await expect(square(page, "c3").locator("img")).toHaveAttribute(
    "src",
    "/pieces/wN.svg",
  );
  await expect(square(page, "g1").locator("img")).toHaveCount(1);
});

test("FEN errors remain usable and promotion requires an explicit piece", async ({
  page,
}) => {
  await page.goto("/");
  await loadFen(page, "invalid");
  await expect(page.locator(".fen-error")).toBeVisible();
  await loadFen(page, "7k/P7/8/8/8/8/8/7K w - - 0 1");
  await move(page, "a7", "a8");
  await expect(page.locator(".promotion-card")).toBeVisible();
  await page.locator(".promotion-choices button").last().click();
  await expect(square(page, "a8").locator("img")).toHaveAttribute(
    "src",
    "/pieces/wN.svg",
  );
  await expect(page.locator(".promotion-card")).toHaveCount(0);
});

test("real Stockfish calculates, previews and plays its legal suggestion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.locator(".calculate-button").click();
  await expect(page.locator(".strategy-card .plan-actions")).toBeVisible();
  const before = await page.evaluate(() =>
    localStorage.getItem("tempo-position"),
  );
  const preview = page.locator(".plan-preview").first();
  await preview.click();
  await expect(
    page.locator("#play-workspace .chessboard.previewing"),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("tempo-position")),
  ).toBe(before);
  await page.keyboard.press("Escape");
  await expect(
    page.locator("#play-workspace .chessboard.previewing"),
  ).toHaveCount(0);
  await page.locator(".plan-actions .primary-button").click();
  await expect(page.locator(".move-history .latest")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("tempo-position")),
  ).not.toBe(before);
  expect(errors).toEqual([]);
});

test("focused hints navigate without changing the best-move button", async ({
  page,
}) => {
  await page.goto("/");
  const find = page.getByRole("button", {
    name: "Find the best moves",
    exact: true,
  });
  const hintButton = page.getByRole("button", {
    name: "Get a hint",
    exact: true,
  });
  await hintButton.click();
  await expect(find).toBeVisible();
  await expect(find).toBeEnabled();
  await expect(find).toHaveText("Find the best moves");
  const hint = page.locator(".hint-card");
  await expect(hint).toBeVisible();
  await expect(hint.locator(".hint-label")).toHaveText("Hint 1 of 3");
  await expect(hint.locator(".hint-previous")).toBeDisabled();
  await expect(page.locator(".best-move-heading")).toHaveCount(0);
  await expect(page.locator(".alternative-moves")).toHaveCount(0);
  await expect(page.locator(".move-arrow")).toHaveCount(0);
  const next = hint.locator(".hint-next");
  const previous = hint.locator(".hint-previous");
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(hint.locator(".hint-label")).toHaveText("Hint 2 of 3");
  await expect(hint.locator(".hint-description")).not.toContainText(
    "Consider your",
  );
  await expect(next).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(hint.locator(".hint-label")).toHaveText("Hint 3 of 3");
  await expect(hint.locator(".hint-description")).toContainText(
    "Consider your",
  );
  await expect(next).toBeDisabled();
  await previous.focus();
  await page.keyboard.press("Enter");
  await expect(hint.locator(".hint-label")).toHaveText("Hint 2 of 3");
  await expect(hint.locator(".hint-description")).not.toContainText(
    "Consider your",
  );
  await expect(previous).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(hint.locator(".hint-label")).toHaveText("Hint 1 of 3");
  await expect(previous).toBeDisabled();
  await expect(find).toBeVisible();
  await expect(find).toBeEnabled();
  await expect(find).toHaveText("Find the best moves");
  await expect(page.locator(".move-arrow")).toHaveCount(0);
  await square(page, "b1").click();
  await expect(page.locator(".selected-square")).toHaveCount(1);
  await find.click();
  await expect(hint).toHaveCount(0);
  await expect(page.locator(".selected-square")).toHaveCount(0);
  await expect(page.locator(".best-move-heading")).toBeInViewport();
  await expect(page.locator(".strategy-card .plan-actions")).toBeVisible();
  await expect(page.locator(".move-arrow line")).toHaveCount(1);
});

test("a missed winning tactic has its own grade and a translated winning-line preview", async ({
  page,
}) => {
  await page.goto("/");
  await loadFen(page, "rnb1kbnr/pp6/8/8/3P4/8/PPP1PP2/RNBQK3 b Qkq - 0 1");
  await move(page, "f8", "e7");
  const feedback = page.locator('.move-feedback[data-rating="Miss"]');
  await expect(feedback.getByRole("status")).toHaveText("Miss");
  await expect(feedback).toContainText("missed a chance to win material");
  await expect(feedback.locator(".feedback-best-move")).toContainText(
    "Rook h8 → h1",
  );
  const position = await page.evaluate(() =>
    localStorage.getItem("tempo-position"),
  );
  await feedback.locator(".feedback-best-move").click();
  await expect(
    page.locator("#play-workspace .chessboard.previewing"),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator(".language-selector select").selectOption("de");
  await expect(feedback.getByRole("status")).toHaveText("Verpasste Chance");
  await expect(feedback).toContainText("Material zu gewinnen");
  await feedback.locator(".feedback-best-move").click();
  await expect(
    page.locator("#play-workspace .chessboard.previewing"),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("tempo-position")),
  ).toBe(position);
});

test("hanging a rook instead of mating is a mistake even while overwhelmingly ahead", async ({
  page,
}) => {
  await page.goto("/");
  await loadFen(
    page,
    "rnbqkbn1/ppp1ppp1/8/3p4/1P6/P6r/3PPP2/R1BQK3 b Qq - 0 1",
  );
  await move(page, "h3", "f3");
  const feedback = page.locator('.move-feedback[data-rating="Mistake"]');
  await expect(feedback.getByRole("status")).toHaveText("Mistake");
  await expect(feedback).toContainText("rook on f3 has no defender");
  await expect(feedback).toContainText("Their pawn can take it");
  await expect(feedback.locator(".feedback-best-move")).toContainText(
    "Rook h3 → h1",
  );
  await expect(feedback.locator(".feedback-best-reason")).toContainText(
    "checkmate",
  );
  await expect(
    feedback.getByRole("button", { name: "See the piece they can capture" }),
  ).toBeVisible();
});

test("a failed worker surfaces retry and the retry loads the real engine", async ({
  page,
}) => {
  await page.route("**/engine/*.js", (route) => route.abort());
  await page.goto("/");
  await page.locator(".calculate-button").click();
  await expect(page.locator(".engine-error")).toBeVisible();
  await page.unroute("**/engine/*.js");
  await page.locator(".engine-error button").click();
  await expect(page.locator(".strategy-card .plan-actions")).toBeVisible();
});

test("opening routes, filters, branches and language changes preserve play", async ({
  page,
}) => {
  await page.goto("/");
  await move(page, "d2", "d4");
  await page.locator("#opening-tab").click();
  await expect(page.locator(".opening-card")).toHaveCount(30);
  await page.locator(".opening-search input").fill("Wayward");
  await expect(page.locator(".opening-card")).toHaveCount(1);
  await page.locator(".opening-card").click();
  await expect(page).toHaveURL(/\/openings\/wayward-rook\/$/);
  await page.locator("[data-opening-branch=defense]").click();
  await page.locator(".opening-forward").click();
  await expect(page.locator(".opening-progress progress")).toHaveAttribute(
    "value",
    "1",
  );
  await page.locator(".language-selector select").selectOption("de");
  await expect(page).toHaveURL(/\/de\/openings\/wayward-rook\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await page.locator("#play-tab").click();
  await expect(square(page, "d4").locator("img")).toHaveAttribute(
    "src",
    "/pieces/wP.svg",
  );
  await page.goBack();
  await expect(page.locator(".opening-step-card")).toBeVisible();
});

test("computer play pauses in openings and replies when play resumes", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".computer-toggle").click();
  await move(page, "e2", "e4");
  await page.locator("#opening-tab").click();
  // Wait beyond the minimum reply delay; no hidden workspace may commit a reply.
  await page.waitForTimeout(1500);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("tempo-session-v1")!).nodes.length,
    ),
  ).toBe(1);
  await page.locator("#play-tab").click();
  await expect(page.locator(".move-history > button")).toHaveCount(3);
  await expect(page.locator(".turn-status")).toContainText("Your turn");
});

test("board keyboard navigation follows its orientation with one Tab stop", async ({
  page,
}) => {
  await page.goto("/");
  await square(page, "e2").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await expect(square(page, "e4")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(square(page, "e4").locator("img")).toHaveCount(1);
  await expect(
    page.locator("#play-workspace .square[tabindex='0']"),
  ).toHaveCount(1);
  await page.locator(".flip-board-button").click();
  await square(page, "e7").focus();
  await page.keyboard.press("ArrowDown");
  await expect(square(page, "e8")).toBeFocused();
});

test("small and large viewports have no horizontal overflow", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/openings/", "/openings/wayward-rook/"]) {
      await page.goto(path);
      await page.locator(".site-header").waitFor();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
  }
});

test("captured pieces and their score stay aligned on one line", async ({
  page,
  isMobile,
}) => {
  const widths = isMobile ? [320, 390] : [560, 768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const fen of [
      "3qk2r/pp6/8/8/8/8/8/RN1QK3 w Qk - 0 1",
      "4k3/8/8/8/4P3/8/8/4K3 w - - 0 1",
    ]) {
      await loadFen(page, fen);
      await expect(page.locator(".fen-error")).toHaveCount(0);
      const row = page.locator(".material-balance");
      await expect(row.locator(".material-advantage")).toBeVisible();
      await row
        .locator("img")
        .evaluateAll((images) =>
          Promise.all(
            images.map((image) => (image as HTMLImageElement).decode()),
          ),
        );
      const groups = await row.getByRole("img").all();
      expect(groups.length).toBeGreaterThan(0);
      for (const group of groups) {
        await expect(group).toHaveAccessibleName(/\S/);
        await expect(group.locator("img").first()).toBeVisible();
      }
      const layout = await row.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const boxes = [...element.querySelectorAll("img, .material-advantage")]
          .filter((child) => child.getClientRects().length > 0)
          .map((child) => child.getBoundingClientRect());
        const centers = boxes.map((box) => box.top + box.height / 2);
        return {
          spread: Math.max(...centers) - Math.min(...centers),
          fits: boxes.every(
            (box) =>
              box.left >= bounds.left - 1 && box.right <= bounds.right + 1,
          ),
          pageFits: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      expect(layout.spread, `${width}px: ${fen}`).toBeLessThanOrEqual(1);
      expect(layout.fits && layout.pageFits, `${width}px: ${fen}`).toBe(true);
    }
  }
});

test("piece editing supports palette placement, free dragging and removal", async ({
  page,
}) => {
  await page.goto("/");
  await loadFen(page, "4k3/8/8/8/8/8/8/4K3 w - - 0 1");
  const toggle = page.locator(".position-editor-toggle");
  if (
    (await toggle.isVisible()) &&
    (await toggle.getAttribute("aria-expanded")) === "false"
  )
    await toggle.click();
  await page.locator("#board-bottom-tray button").nth(1).click();
  await square(page, "a3").click();
  await expect(square(page, "a3").locator("img")).toHaveAttribute(
    "src",
    "/pieces/wQ.svg",
  );
  await square(page, "a3").dragTo(square(page, "h5"));
  await expect(square(page, "h5").locator("img")).toHaveAttribute(
    "src",
    "/pieces/wQ.svg",
  );
  await square(page, "h5").click({ button: "right" });
  await expect(square(page, "h5").locator("img")).toHaveCount(0);
});

test.describe("Consent preferences", () => {
  test.use({ consent: "fresh" });

  test("cookie choices persist and never load analytics before consent", async ({
    page,
  }) => {
    const analyticsRequests: string[] = [];
    await page.route(
      /googletagmanager\.com|google-analytics\.com/,
      async (route) => {
        analyticsRequests.push(route.request().url());
        await route.fulfill({
          body: "",
          contentType: "application/javascript",
        });
      },
    );
    await page.goto("/");
    if (process.env.VITE_GA_MEASUREMENT_ID)
      await expect(page.locator("#analytics-choice")).toBeVisible();
    expect(analyticsRequests).toEqual([]);
    const settings = page.getByRole("button", {
      name: "Cookie settings",
      exact: true,
    });
    if (!(await page.locator("#analytics-choice").isVisible()))
      await settings.click();
    await page.getByRole("button", { name: "Decline", exact: true }).click();
    await page.reload();
    expect(
      await page.evaluate(() =>
        localStorage.getItem("tempo-analytics-consent-v1"),
      ),
    ).toBe("denied");
    expect(analyticsRequests).toEqual([]);
    await settings.click();
    await page.getByRole("button", { name: "Accept", exact: true }).click();
    expect(
      await page.evaluate(() =>
        localStorage.getItem("tempo-analytics-consent-v1"),
      ),
    ).toBe("granted");
    await settings.click();
    await page.getByRole("button", { name: "Decline", exact: true }).click();
    await expect(settings).toBeFocused();
    await expect(page.locator("#analytics-choice")).toHaveCount(0);
  });
});
