import { Page, expect } from "@playwright/test";
import config from "./config.json";

export class StaffPage {
  private page: Page;
  private screenshotBasePath: string;
  public testName: string;
  private feature = "staff";

  constructor(page: Page) {
    this.page = page;
    this.screenshotBasePath = `./screenshots/${config.version}/${this.feature}`;
  }

  async takeScreenshot(stepName: string) {
    const screenshotPath = `${this.screenshotBasePath}/${this.testName}-${stepName}.png`;
    await this.page.screenshot({ path: screenshotPath });
  }

  async updateStaffName(name: string, email: string) {
    this.fillName(name);
    this.fillEmail(email);
    this.saveStaff();
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/ghost/#/staff`);
    await this.takeScreenshot("navigate");
  }

  async navigateBySlug(slug: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/staff/${slug}`);
    await this.page.waitForTimeout(1000);
    await this.takeScreenshot("navigateBySlug");
  }

  async fillName(name: string) {
    await this.page.getByPlaceholder("Full Name").click();
    await this.page.getByPlaceholder("Full Name").fill(name);
    await this.takeScreenshot("fillName");
  }

  async fillEmail(email: string) {
    await this.page.getByPlaceholder("Email Address").click();
    await this.page.getByPlaceholder("Email Address").fill(email);
    await this.takeScreenshot("fillEmail");
  }

  async saveStaff() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.takeScreenshot("saveStaff");
  }

  async expectTagStatus(status: string) {
    const draftElement = this.page.getByRole("button", { name: status });
    await expect(draftElement).toBeVisible();
  }

  async getSlug() {
    await this.page.waitForSelector("#user-slug");
    return await this.page.$eval("#user-slug", (input: SVGElement | HTMLElement) => {
      const inputElement = input as HTMLInputElement;
      return inputElement.value;
    });
  }
}
