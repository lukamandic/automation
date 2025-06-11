import type { Page } from "playwright";

export interface User {
  name: string;
  role: string;
}

export class DataExtractor {
  async extractUsersFromTable(page: Page): Promise<User[]> {
    try {
      console.log("Extracting user data from members table...");

      await page.waitForSelector("table tbody tr", { timeout: 10000 });

      const users = await page.evaluate(() => {
        const rows = document.querySelectorAll("table tbody tr");
        const userData: User[] = [];

        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 4) {
            const nameElement = cells[0].querySelector("div[title]");
            const name = nameElement
              ? nameElement.getAttribute("title") || ""
              : "";

            const roleElement = cells[3].querySelector("span");
            const role = roleElement
              ? roleElement.textContent?.trim() || ""
              : "";

            if (name && role) {
              userData.push({ name, role });
            }
          }
        });

        return userData;
      });

      console.log(`Extracted ${users.length} users from table`);
      return users;
    } catch (error) {
      console.error("Error extracting users from table:", error);
      return [];
    }
  }

  async logUsers(users: User[]): Promise<void> {
    console.log("Extracted users:");
    console.log(JSON.stringify(users, null, 2));
  }
}
