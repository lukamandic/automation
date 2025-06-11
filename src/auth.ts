import { TOTP } from "otpauth";
import type { Page } from "playwright";

export interface LoginCredentials {
  email: string;
  password: string;
  totp_secret: string;
}

export class NotionAuth {
  async login(page: Page, credentials: LoginCredentials): Promise<void> {
    console.log("Starting Notion authentication...");

    console.log("Step 1: Navigating to Notion login page...");
    await page.goto("https://www.notion.so/login");

    console.log("Step 2: Clicking 'Continue with Google'...");
    const [googlePopup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: /Continue with Google/i }).click(),
    ]);

    console.log("Step 3: Waiting for Google login page...");
    await googlePopup.waitForLoadState();

    console.log("Step 4: Filling email address...");
    await googlePopup.fill('input[type="email"]', credentials.email);
    await googlePopup.click('button:has-text("Next")');

    console.log("Step 5: Filling password...");
    await googlePopup.waitForSelector('input[type="password"]', {
      timeout: 10000,
    });
    await googlePopup.fill('input[type="password"]', credentials.password);
    await googlePopup.click('button:has-text("Next")');

    console.log("Step 6: Handling 2FA...");
    await googlePopup.waitForTimeout(3000);

    const totpCode = this.generateTOTP(credentials.totp_secret);
    console.log(`Generated TOTP code: ${totpCode}`);

    await googlePopup.locator('[data-challengetype="6"]').click();

    await googlePopup.waitForSelector('div[data-challengetype="6"]', {
      timeout: 10000,
    });

    const totpInput = await this.findTOTPInput(googlePopup);
    if (totpInput) {
      await totpInput.fill(totpCode);
      console.log("Filled 2FA code");

      await googlePopup.click(
        'button:has-text("Verify"), button:has-text("Next"), button:has-text("Submit")'
      );
      console.log("Clicked verify button");
    } else {
      throw new Error("Could not find 2FA input field");
    }

    console.log("Step 7: Waiting for authentication to complete...");

    console.log("Step 8: Waiting for redirect to Notion...");
    await page.waitForURL("https://www.notion.so/*");
    await page.waitForTimeout(3000);

    console.log("Successfully logged into Notion via Google SSO with 2FA!");
  }

  private generateTOTP(secret: string): string {
    const totp = new TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret,
    });

    return totp.generate();
  }

  private async findTOTPInput(googlePopup: Page) {
    const selector = 'input[type="tel"]';

    try {
      const element = await googlePopup.waitForSelector(selector, {
        timeout: 2000,
      });
      if (element) {
        console.log(`Found 2FA input with selector: ${selector}`);
        return element;
      }
    } catch (e) {
      console.log(`2FA selector ${selector} not found`);
    }

    return null;
  }

  async saveAuthState(context: any): Promise<void> {
    console.log("Saving authentication state...");
    await context.storageState({ path: "notion-auth.json" });
  }
}
