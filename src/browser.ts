import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";

export interface BrowserInstance {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async initialize(): Promise<BrowserInstance> {
    console.log("Initializing browser...");

    this.browser = await chromium.launch({
      headless: false,
      args: [
        "--start-maximized",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    console.log("Browser initialized successfully");

    return {
      browser: this.browser,
      context: this.context,
      page: this.page,
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log("Browser closed");
    }
  }

  async keepOpen(): Promise<void> {
    console.log("Browser will stay open. Press Ctrl+C to close.");
    await new Promise(() => {});
  }
}
