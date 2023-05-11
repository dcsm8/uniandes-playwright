import { Page, expect } from "@playwright/test";
import config from "./config.json";

export class TagPage {
  private page: Page;
  private screenshotBasePath: string;
  public testName: string;
  private feature = "tags";

  constructor(page: Page) {
    this.page = page;
    this.screenshotBasePath = `./screenshots/${config.version}/${this.feature}`;
  }

  async takeScreenshot(stepName: string) {
    const screenshotPath = `${this.screenshotBasePath}/${this.testName}-${stepName}.png`;
    await this.page.screenshot({ path: screenshotPath });
  }

  async createTag(name: string, description: string): Promise<string> {
    await this.navigateToTagEditor();
    await this.fillTagName(name);
    await this.fillTagDescription(description);
    await this.saveTag();
    const tagId = await this.getTagIdFromUrl();
    return tagId;
  }

  async updateTagById(tagId: string, updatedTag: { name: string; description: string }): Promise<void> {
    await this.navigateToTagById(tagId);
    await this.fillTagName(updatedTag.name);
    await this.fillTagDescription(updatedTag.description);
    await this.saveTag();
  }

  async deleteTagById(tagId: string): Promise<void> {
    await this.navigateToTagById(tagId);
    await this.deleteTag();
  }

  async deleteTag() {
    await this.page.getByRole("button", { name: "Delete tag" }).click();
    await this.page.click(".gh-btn.gh-btn-red.gh-btn-icon.ember-view");
    await this.takeScreenshot("deleteTag");
  }

  async navigateToTagById(tagId: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/tags/${tagId}`);
    await this.page.waitForTimeout(1000);
    await this.takeScreenshot("navigateToTagById");
  }

  async navigateToTagEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/tags/new`);
    await this.takeScreenshot("navigateToTagEditor");
  }

  async fillTagName(name: string) {
    await this.page.getByLabel("Name").click();
    await this.page.getByLabel("Name").fill(name);
    await this.takeScreenshot("fillTagName");
  }

  async fillTagDescription(description: string) {
    await this.page.getByLabel("Description").click();
    await this.page.getByLabel("Description").fill(description);
    await this.takeScreenshot("fillTagDescription");
  }

  async saveTag() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.takeScreenshot("saveTag");
  }

  async getTagIdFromUrl(): Promise<string> {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const fragments = url.hash.split("/");
    const tagId = fragments[fragments.length - 1];
    return tagId;
  }

  async getErrorMessageText(): Promise<string | null> {
    return await this.page.textContent(".midlightgrey.error-code-size");
  }

  async getTagDescription() {
    await this.page.waitForSelector("#tag-description");
    return await this.page.$eval("#tag-description", (input: SVGElement | HTMLElement) => {
      const inputElement = input as HTMLInputElement;
      return inputElement.value;
    });
  }

  async getTagName() {
    await this.page.waitForSelector("#tag-name");
    return await this.page.$eval("#tag-name", (input: SVGElement | HTMLElement) => {
      const inputElement = input as HTMLInputElement;
      return inputElement.value;
    });
  }

  async expectTagStatus(status: string) {
    const draftElement = this.page.getByRole("button", { name: status });
    await expect(draftElement).toBeVisible();
  }
}
