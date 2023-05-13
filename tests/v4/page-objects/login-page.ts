import { Page, expect } from "@playwright/test";
import config from "./config.json";

export class LoginPage {
  private page: Page;

  private email = config.email;
  private password = config.password;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/ghost/#/signin`);
  }

  async login() {
    await this.page.fill('input[name="identification"]', this.email);
    await this.page.fill('input[name="password"]', this.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector('a[href="#/site/"]');
  }

  async loginAttempt() {
    await this.page.fill('input[name="identification"]', this.email);
    await this.page.fill('input[name="password"]', this.password);
    await this.page.click('button[type="submit"]');
  }

  async expectSuccessfulLogin(page: Page) {
    const url = page.url();
    expect(url).toContain("/ghost/#/dashboard");
  }

  async expectFailedLogin(page: Page) {
    const errorMessage = await page.waitForSelector(".main-error");
    expect(errorMessage).toBeTruthy();
  }

  async signout() {
    await this.page.goto(`${config.baseUrl}/ghost/#/signout`);
  }

  async expectSuccessfulSignout() {
    const loggedInElement = await this.page.$("#logged-in-message");
    expect(loggedInElement).toBeNull();
  }
}
