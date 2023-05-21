import { PostDataGenerator } from "../../data-generators/post-data-generator";
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/login-page";
import { PostPage } from "../../page-objects/posts-page";

test.describe("Posts Random", () => {
  let loginPage: LoginPage;
  let postPage: PostPage;
  let postId: string;
  const { title, content } = PostDataGenerator.getRandomPostData();

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    postPage = new PostPage(page);
    postPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
    postId = await postPage.createPost(title, content);
  });

  test("Create post with random data", async () => {
    postPage.testName = "create-page";
    // When
    await postPage.createPost(title, content);

    // Then
    await postPage.expectNotificationShown("Published");
    await postPage.expectPostStatus("Published");
  });

  test("Update post with random data", async () => {
    postPage.testName = "update-post";
    // Given
    const updatedPost = PostDataGenerator.getRandomPostData();

    // When
    await postPage.updatePostById(postId, updatedPost);

    // Then
    await postPage.expectNotificationShown("Updated");
  });

  test("Delete post with random data", async () => {
    postPage.testName = "delete-post";
    // When
    await postPage.deletePostById(postId);
    await postPage.navigateToPostById(postId);

    // Then
    const errorCode = await postPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read post with random data", async () => {
    postPage.testName = "read-post";
    // When
    await postPage.navigateToPostById(postId);

    // Then
    const postTitle = await postPage.getPostTitle();
    const postContent = await postPage.getPostContent();
    expect(postTitle).toBe(title);
    expect(postContent).toBe(content);
  });

  test("Create draft with random data", async () => {
    postPage.testName = "create-draft";

    // When
    await postPage.navigateToPostEditor();
    await postPage.fillPostTitle(title);
    await postPage.fillPostContent(content);

    // Then
    await postPage.expectPostStatus("Draft");
  });
});
