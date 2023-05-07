import { Page, expect } from "@playwright/test";
import { config } from "./config";

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/ghost/#/signin`);
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="identification"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector('a[href="#/site/"]');
  }

  async loginAttempt(email: string, password: string) {
    await this.page.fill('input[name="identification"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async expectSuccessfulLogin(page: Page) {
    const url = page.url();
    expect(url).toContain("/ghost/#/site");
  }

  async expectFailedLogin(page: Page) {
    const errorMessage = await page.waitForSelector(".gh-btn-red");
    expect(errorMessage).toBeTruthy();
  }
}
