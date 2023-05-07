import { Page, expect } from "@playwright/test";
import { config } from "./config";

export class PostPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/ghost/#/posts/`);
  }

  async navigateToPostEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/post/`);
  }

  async publishUpdatedPost() {
    await this.page.getByRole("button", { name: "Update" }).click();
    await this.page.getByRole("button", { name: "Update", exact: true }).click();
    await this.page.waitForSelector('a[href="#/posts/"]');
  }

  async expectPostUpdatedSuccessfully(updatedTitle: string) {
    await this.page.waitForSelector(`.gh-content-entry-title:has-text("${updatedTitle}")`);
    const postTitleElement = await this.page.$(`.gh-content-entry-title:has-text("${updatedTitle}")`);
    expect(postTitleElement).toBeTruthy();
  }

  async getPostListLength(): Promise<number> {
    await this.page.waitForSelector(".posts-list");
    const listElements = await this.page.$$(".gh-posts-list-item");
    return listElements.length;
  }

  async fillPostTitle(title: string) {
    // TODO: update selector
    await this.page.getByPlaceholder("Post Title").click();
    await this.page.getByPlaceholder("Post Title").fill(title);
  }

  async fillPostContent(content: string) {
    await this.page.locator(".koenig-editor__editor").click();
    await this.page.locator(".koenig-editor__editor").fill(content);
  }

  async publishPost() {
    await this.page.getByRole("button", { name: "Publish" }).click();
    await this.page.getByRole("button", { name: "Publish", exact: true }).click();
    await this.page.waitForTimeout(1000);
  }

  async expectPostCreatedSuccessfully(postListLengthBefore: number) {
    const postListElementsAfter = await this.getPostListLength();
    expect(postListElementsAfter).toBe(postListLengthBefore + 1);
  }
}
