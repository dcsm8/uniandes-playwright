import { Page, expect } from "@playwright/test";
import { config } from "./config";

export class TagPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createTag(name: string, description: string): Promise<string> {
    await this.navigateToTagEditor();
    await this.fillTagName(name);
    await this.fillTagDescription(description);
    await this.saveTag();
    const tagId = await this.getTagIdFromUrl();
    return tagId;
  }

  async deleteTag() {
    await this.page.getByRole("button", { name: "Delete tag" }).click();
    const deleteButton = await this.page.$("div.modal-footer button:nth-child(2)");
    await deleteButton?.click();
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

  async navigateToTagById(tagId: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/tags/${tagId}`);
  }

  async navigateToTagEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/tags/new`);
  }

  async getTagIdFromUrl(): Promise<string> {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const fragments = url.hash.split("/");
    const tagId = fragments[fragments.length - 1];
    return tagId;
  }

  async fillTagName(name: string) {
    await this.page.getByLabel("Name").click();
    await this.page.getByLabel("Name").fill(name);
  }

  async fillTagDescription(description: string) {
    await this.page.getByLabel("Description").click();
    await this.page.getByLabel("Description").fill(description);
  }

  async saveTag() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.waitForTimeout(1000);
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
