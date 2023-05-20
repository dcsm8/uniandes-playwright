import { Page, expect } from "@playwright/test";
import config from "./config.json";

export class PostPage {
  private page: Page;
  private screenshotBasePath: string;
  public testName: string;
  private feature = "posts";

  constructor(page: Page) {
    this.page = page;
    this.screenshotBasePath = `./screenshots/${config.version}/${this.feature}`;
  }

  async takeScreenshot(stepName: string) {
    const screenshotPath = `${this.screenshotBasePath}/${this.testName}-${stepName}.png`;
    await this.page.screenshot({ path: screenshotPath });
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

  async createPost(title: string, content: string): Promise<string> {
    await this.navigateToPostEditor();
    await this.fillPostTitle(title);
    await this.fillPostContent(content);
    await this.publishPost();
    const postId = await this.getPostIdFromUrl();
    return postId;
  }

  async fillPostTitle(title: string) {
    await this.page.getByPlaceholder("Post Title").click();
    await this.page.getByPlaceholder("Post Title").fill(title);
    await this.takeScreenshot("fillPostTitle");
  }

  async fillPostContent(content: string) {
    await this.page.locator(".koenig-editor__editor").click();
    await this.page.locator(".koenig-editor__editor").fill(content);
    await this.takeScreenshot("fillPostContent");
  }

  async publishPost() {
    await this.page.locator(".gh-publishmenu").click();
    await this.page.locator(".gh-publishmenu-button").click();
    await this.takeScreenshot("publishPost");
  }

  async updatePost() {
    await this.page.getByRole("button", { name: "Update" }).click();
    await this.page.getByRole("button", { name: "Update", exact: true }).click();
    await this.takeScreenshot("updatePost");
  }

  async deletePost() {
    await this.page.getByRole("button", { name: "Settings" }).click();
    await this.page.getByRole("button", { name: "Delete post" }).click();
    await this.page.click(".gh-btn.gh-btn-red.gh-btn-icon");
    await this.takeScreenshot("deletePost");
  }

  async navigateToPostById(postId: string) {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/post/${postId}`);
    await this.page.waitForTimeout(1000);
    await this.takeScreenshot("navigateToPostById");
  }

  async navigateToPostList() {
    await this.page.goto(`${config.baseUrl}/ghost/#/posts/`);
    await this.takeScreenshot("navigateToPostList");
  }

  async navigateToPostEditor() {
    await this.page.goto(`${config.baseUrl}/ghost/#/editor/post/`);
    await this.takeScreenshot("navigateToPostEditor");
  }

  async getPostIdFromUrl(): Promise<string> {
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const fragments = url.hash.split("/");
    const postId = fragments[fragments.length - 1];
    return postId;
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
    const draftElement = this.page.locator("header").locator(`text=${status}`);
    await draftElement.waitFor();
    await expect(draftElement).toBeVisible();
  }

  async expectNotificationShown(notificationText: string) {
    const notificationElement = await this.page.waitForSelector(`text=${notificationText}`);
    expect(notificationElement).toBeTruthy();
  }
}
