import { Page, expect } from "@playwright/test";
import { config } from "../config";

export class PagesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createPage(title: string, content: string): Promise<string> {
    await this.navigateToPageEditor();
    await this.fillPageTitle(title);
    await this.fillPageContent(content);
    await this.publishPage();
    const pageId = await this.getPageIdFromUrl();
    return pageId;
  }

  async updatePage() {
    await this.page.getByRole("button", { name: "Update" }).click();
    await this.page.getByRole("button", { name: "Update", exact: true }).click();
    await this.page.waitForTimeout(1000);
  }

  async deletePage() {
    await this.page.getByRole("button", { name: "Settings" }).click();
    await this.page.getByRole("button", { name: "Delete page" }).click();
    await this.page.click(".gh-btn.gh-btn-red.gh-btn-icon");
  }

  async updatePageById(pageId: string, updatedPage: { title: string; content: string }): Promise<void> {
    await this.navigateToPageById(pageId);
    await this.fillPageTitle(updatedPage.title);
    await this.fillPageContent(updatedPage.content);
    await this.updatePage();
  }

  async deletePageById(pageId: string): Promise<void> {
    await this.navigateToPageById(pageId);
    await this.deletePage();
  }

  async navigateToPageById(pageId: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/page/${pageId}`);
  }

  async navigateToPageList() {
    await this.page.goto(`${config.baseUrl}/ghost/#/pages/`);
  }

  async navigateToPageEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/page/`);
  }

  async getPageIdFromUrl(): Promise<string> {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const fragments = url.hash.split("/");
    const pageId = fragments[fragments.length - 1];
    return pageId;
  }

  async fillPageTitle(title: string) {
    await this.page.getByPlaceholder("Page Title").click();
    await this.page.getByPlaceholder("Page Title").fill(title);
  }

  async fillPageContent(content: string) {
    await this.page.locator(".koenig-editor__editor").click();
    await this.page.locator(".koenig-editor__editor").fill(content);
  }

  async publishPage() {
    await this.page.getByRole("button", { name: "Publish" }).click();
    await this.page.getByRole("button", { name: "Publish", exact: true }).click();
    await this.page.waitForTimeout(1000);
  }

  async expectNotificationShown(notificationText: string) {
    await this.page.waitForSelector(`.gh-notification:has-text("${notificationText}")`);
    const notificationElement = await this.page.$(`.gh-notification:has-text("${notificationText}")`);
    expect(notificationElement).toBeTruthy();
  }

  async getErrorMessageText(): Promise<string | null> {
    return await this.page.textContent(".midlightgrey.error-code-size");
  }

  async getPageTitle(): Promise<string | null> {
    const titleElement = await this.page.locator(".gh-editor-title");
    return await titleElement.evaluate((el) => (el as HTMLTextAreaElement).value);
  }

  async getPageContent(): Promise<string | null> {
    return await this.page.locator(".koenig-editor__editor").textContent();
  }

  async expectPageStatus(status: string) {
    const draftElement = this.page.locator("header").getByText(status);
    await expect(draftElement).toBeVisible();
  }
}
