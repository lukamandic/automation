import type { Page } from "playwright";

export class NotionNavigation {
  async navigateToMembers(page: Page): Promise<void> {
    console.log("Navigating to Members page...");

    console.log("Step 1: Clicking Settings...");
    await page.locator("svg.gear").click();
    await page.waitForTimeout(1000);

    console.log("Step 2: Clicking People...");
    await page.locator("svg.people").click();
    await page.waitForTimeout(1000);

    console.log("Step 3: Clicking Members...");
    await page.getByText("Members", { exact: true }).click();
    await page.waitForTimeout(1000);

    console.log("Successfully navigated to Members page");
  }

  async takeScreenshot(page: Page, filename: string): Promise<void> {
    console.log(`Taking screenshot: ${filename}`);
    await page.screenshot({ path: filename });
    console.log(`Screenshot saved: ${filename}`);
  }
}
