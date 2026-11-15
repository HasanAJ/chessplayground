import { test as base, expect } from "@playwright/test";

type Preferences = { consent: "declined" | "fresh" };

export const test = base.extend<Preferences>({
  consent: ["declined", { option: true }],
  page: async ({ page, consent }, use) => {
    if (consent === "declined") {
      await page.addInitScript(() => {
        const key = "tempo-analytics-consent-v1";
        if (localStorage.getItem(key) === null)
          localStorage.setItem(key, "denied");
      });
    }
    await use(page);
  },
});

export { expect };
