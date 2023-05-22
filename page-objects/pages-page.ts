import { Page, expect } from "@playwright/test";
import config from "./config.json";

export class PagesPage {
  public page: Page;
  private screenshotBasePath: string;
  public testName: string;
  private feature = "pages";

  constructor(page: Page) {
    this.page = page;
    this.screenshotBasePath = `./screenshots/${config.version}/${this.feature}`;
  }

  async takeScreenshot(stepName: string) {
    const screenshotPath = `${this.screenshotBasePath}/${this.testName}-${stepName}.png`;
    await this.page.screenshot({ path: screenshotPath });
  }

  async createPage(title: string, content: string): Promise<string> {
    await this.navigateToPageEditor();
    await this.fillPageTitle(title);
    await this.fillPageContent(content);
    await this.publishPage();
    const pageId = await this.getPageIdFromUrl();
    return pageId;
  }

  async updatePageById(pageId: string, updatedPage: { title: string; content: string }): Promise<void> {
    await this.navigateToPageById(pageId);
    await this.fillPageTitle(updatedPage.title);
    await this.fillPageContent(updatedPage.content);
    await this.updatePage();
  }

  async fillMetadata(title: string, description: string) {
    await this.page.getByRole("button", { name: "Settings" }).click();
    await this.page.getByRole("listitem").filter({ hasText: "Meta data Extra content for search engines" }).click();
    await this.page.getByLabel("Meta title").click();
    await this.page.getByLabel("Meta title").fill(title);
    await this.page.getByLabel("Meta description").click();
    await this.page.getByLabel("Meta description").fill(description);
  }

  async deletePageById(pageId: string): Promise<void> {
    await this.navigateToPageById(pageId);
    await this.deletePage();
  }

  async updatePage() {
    await this.page.getByRole("button", { name: "Update" }).click();
    await this.page.getByRole("button", { name: "Update", exact: true }).click();
    await this.page.waitForTimeout(1000);
    await this.takeScreenshot("updatePage");
  }

  async deletePage() {
    await this.page.getByRole("button", { name: "Settings" }).click();
    await this.page.getByRole("button", { name: "Delete page" }).click();
    await this.page.click(".gh-btn.gh-btn-red.gh-btn-icon");
    await this.takeScreenshot("deletePage");
  }

  async navigateToPageById(pageId: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/page/${pageId}`);
    await this.page.waitForTimeout(1000);
    await this.takeScreenshot("navigateToPageById");
  }

  async navigateToPageList() {
    await this.page.goto(`${config.baseUrl}/ghost/#/pages/`);
    await this.takeScreenshot("navigateToPageList");
  }

  async navigateToPageEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/page/`);
    await this.takeScreenshot("navigateToPageEditor");
  }

  async fillPageTitle(title: string) {
    await this.page.getByPlaceholder("Page Title").click();
    await this.page.getByPlaceholder("Page Title").fill(title);
    await this.takeScreenshot("fillPageTitle");
  }

  async fillPageContent(content: string) {
    await this.page.locator(".koenig-editor__editor").click();
    await this.page.locator(".koenig-editor__editor").fill(content);
    await this.takeScreenshot("fillPageContent");
  }

  async publishPage() {
    await this.page.locator(".gh-publishmenu").click();
    await this.page.locator(".gh-publishmenu-button").click();
    await this.takeScreenshot("publishPage");
  }

  async getPageIdFromUrl(): Promise<string> {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const fragments = url.hash.split("/");
    const pageId = fragments[fragments.length - 1];
    return pageId;
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

  async expectNotificationShown(notificationText: string) {
    const notificationElement = await this.page.waitForSelector(`text=${notificationText}`);
    expect(notificationElement).toBeTruthy();
  }

  async expectTitleUpdateErrorMessage() {
    const errorArticle = await this.page.waitForSelector("article.gh-alert-red");
    const errorMessage = await errorArticle.textContent();
    const closeButton = await errorArticle.$("button.gh-alert-close");

    await expect(errorMessage).toContain("Update failed: Title cannot be longer than 255 characters.");
    await expect(closeButton).toBeDefined();
  }

  async expectTitleWordCount(count: string, color: string) {
    const wordCountElement = await this.page.waitForSelector(
      'input[name="post-setting-meta-title"] + p span.word-count'
    );
    const textContent = await wordCountElement.textContent();
    const elementColor = await wordCountElement.evaluate((el) => getComputedStyle(el).color);
    expect(textContent).toBe(count);
    expect(elementColor).toBe(color);
  }

  async expectDescriptionWordCount(count: string, color: string) {
    const wordCountElement = await this.page.waitForSelector(
      'textarea[name="post-setting-meta-description"] + p span.word-count'
    );
    const textContent = await wordCountElement.textContent();
    const elementColor = await wordCountElement.evaluate((el) => getComputedStyle(el).color);
    expect(textContent).toBe(count);
    expect(elementColor).toBe(color);
  }
}
