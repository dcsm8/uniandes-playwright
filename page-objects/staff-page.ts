import { Page, expect } from "@playwright/test";
import { config } from "../config";

export class StaffPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async updateStaffName(name: string, email: string) {
    this.fillName(name);
    this.fillEmail(email);
    this.saveStaff();
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/ghost/#/staff`);
  }

  async navigateBySlug(slug: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/staff/${slug}`);
  }

  async fillName(name: string) {
    await this.page.getByPlaceholder("Full Name").click();
    await this.page.getByPlaceholder("Full Name").fill(name);
  }

  async fillEmail(email: string) {
    await this.page.getByPlaceholder("Email Address").click();
    await this.page.getByPlaceholder("Email Address").fill(email);
  }

  async saveStaff() {
    await this.page.getByRole("button", { name: "Save" }).click();
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
