import dotenv from "dotenv";
import { BrowserManager } from "./browser.js";
import { NotionAuth, type LoginCredentials } from "./auth.js";
import { NotionNavigation } from "./navigation.js";
import { DataExtractor } from "./dataExtractor.js";

dotenv.config();

(async () => {
  let browserManager: BrowserManager | null = null;

  try {
    console.log("Starting Notion automation...");

    const credentials: LoginCredentials = {
      email: process.env.GOOGLE_EMAIL!,
      password: process.env.GOOGLE_PASSWORD!,
      totp_secret: process.env.GOOGLE_TOTP_SECRET!,
    };

    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.totp_secret
    ) {
      console.error("Missing required environment variables:");
      console.error("- GOOGLE_EMAIL");
      console.error("- GOOGLE_PASSWORD");
      console.error("- GOOGLE_TOTP_SECRET");
      console.error(
        "Please set these environment variables before running the script."
      );
      process.exit(1);
    }

    browserManager = new BrowserManager();
    const { browser, context, page } = await browserManager.initialize();

    // LOGIN PART
    const auth = new NotionAuth();
    await auth.login(page, credentials);
    await auth.saveAuthState(context);

    // PAGE NAVIGATION PART
    const navigation = new NotionNavigation();
    await navigation.navigateToMembers(page);
    await navigation.takeScreenshot(page, "members.png");

    // DATA EXTRACTION PART
    const dataExtractor = new DataExtractor();
    const users = await dataExtractor.extractUsersFromTable(page);
    await dataExtractor.logUsers(users);

    await browserManager.keepOpen();
  } catch (error) {
    console.error("An error occurred:", error);

    if (browserManager) {
      console.log(
        "Browser will stay open for debugging. Press Ctrl+C to close."
      );
      await browserManager.keepOpen();
    }
  }
})();
