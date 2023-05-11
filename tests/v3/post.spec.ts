import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";
import { PostPage } from "./page-objects/posts-page";

test.describe("Posts", () => {
  let loginPage: LoginPage;
  let postPage: PostPage;
  let postId: string;
  const title = "New Title";
  const content = "New Content";

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    postPage = new PostPage(page);
    await loginPage.navigate();
    await loginPage.login();
    postId = await postPage.createPost(title, content);
  });

  test("Create post", async () => {
    // When
    await postPage.createPost(title, content);

    // Then
    await postPage.expectNotificationShown("Published");
    await postPage.expectPostStatus("Published");
  });

  test("Update post", async () => {
    // Given
    const updatedPost = { title: "Updated Title", content: "Updated Content" };

    // When
    await postPage.updatePostById(postId, updatedPost);

    // Then
    await postPage.expectNotificationShown("Updated");
  });

  test("Delete post", async () => {
    // When
    await postPage.deletePostById(postId);
    await postPage.navigateToPostById(postId);

    // Then
    const errorCode = await postPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read post", async () => {
    // When
    await postPage.navigateToPostById(postId);

    // Then
    const postTitle = await postPage.getPostTitle();
    const postContent = await postPage.getPostContent();
    expect(postTitle).toBe(title);
    expect(postContent).toBe(content);
  });

  test("Create draft", async () => {
    // Given
    const postTitle = "New Title";
    const postContent = "New Content";

    // When
    await postPage.navigateToPostEditor();
    await postPage.fillPostTitle(postTitle);
    await postPage.fillPostContent(postContent);

    // Then
    await postPage.expectPostStatus("Draft");
  });
});
