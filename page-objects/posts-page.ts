import { Page, expect } from "@playwright/test";
import { config } from "../config";

export class PostPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createPost(title: string, content: string): Promise<string> {
    await this.navigateToPostEditor();
    await this.fillPostTitle(title);
    await this.fillPostContent(content);
    await this.publishPost();
    const postId = await this.getPostIdFromUrl();
    return postId;
  }

  async updatePost() {
    await this.page.getByRole("button", { name: "Update" }).click();
    await this.page.getByRole("button", { name: "Update", exact: true }).click();
    await this.page.waitForTimeout(1000);
  }

  async deletePost() {
    await this.page.getByRole("button", { name: "Settings" }).click();
    await this.page.getByRole("button", { name: "Delete post" }).click();
    await this.page.click(".gh-btn.gh-btn-red.gh-btn-icon");
  }

  async updatePostById(postId: string, updatedPost: { title: string; content: string }): Promise<void> {
    await this.navigateToPostById(postId);
    await this.fillPostTitle(updatedPost.title);
    await this.fillPostContent(updatedPost.content);
    await this.updatePost();
  }

  async deletePostById(postId: string): Promise<void> {
    await this.navigateToPostById(postId);
    await this.deletePost();
  }

  async navigateToPostById(postId: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/post/${postId}`);
  }

  async navigateToPostList() {
    await this.page.goto(`${config.baseUrl}/ghost/#/posts/`);
  }

  async navigateToPostEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/post/`);
  }

  async getPostIdFromUrl(): Promise<string> {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const fragments = url.hash.split("/");
    const postId = fragments[fragments.length - 1];
    return postId;
  }

  async fillPostTitle(title: string) {
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

  async expectNotificationShown(notificationText: string) {
    await this.page.waitForSelector(`.gh-notification:has-text("${notificationText}")`);
    const notificationElement = await this.page.$(`.gh-notification:has-text("${notificationText}")`);
    expect(notificationElement).toBeTruthy();
  }

  async getErrorMessageText(): Promise<string | null> {
    return await this.page.textContent(".midlightgrey.error-code-size");
  }

  async getPostTitle(): Promise<string | null> {
    const titleElement = await this.page.locator(".gh-editor-title");
    return await titleElement.evaluate((el) => (el as HTMLTextAreaElement).value);
  }

  async getPostContent(): Promise<string | null> {
    return await this.page.locator(".koenig-editor__editor").textContent();
  }

  async expectPostStatus(status: string) {
    const draftElement = this.page.locator("header").getByText(status);
    await expect(draftElement).toBeVisible();
  }
}
