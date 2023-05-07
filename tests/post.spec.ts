import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { PostPage } from "../page-objects/posts-page";
import { config } from "../page-objects/config";

test.describe("Posts", () => {
  let loginPage: LoginPage;
  let postPage: PostPage;
  let postId: string;
  const title = "New Title";
  const content = "New Content";

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    postPage = new PostPage(page);
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
    postId = await postPage.createPost(title, content);
  });

  test("Crear post", async () => {
    await postPage.createPost(title, content);
    await postPage.expectNotificationShown("Published");
    await postPage.expectPostStatus("Published");
  });

  test("Actualizar post", async () => {
    const updatedPost = { title: "Updated Title", content: "Updated Content" };
    await postPage.updatePostById(postId, updatedPost);
    await postPage.expectNotificationShown("Updated");
  });

  test("Eliminar post", async () => {
    await postPage.deletePostById(postId);
    await postPage.navigateToPostById(postId);

    const errorCode = await postPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Leer post", async () => {
    await postPage.navigateToPostById(postId);
    const postTitle = await postPage.getPostTitle();
    const postContent = await postPage.getPostContent();
    expect(postTitle).toBe(title);
    expect(postContent).toBe(content);
  });

  test("Crear borrador", async () => {
    const postTitle = "New Title";
    const postContent = "New Content";
    await postPage.navigateToPostEditor();
    await postPage.fillPostTitle(postTitle);
    await postPage.fillPostContent(postContent);
    await postPage.expectPostStatus("Draft");
  });
});
