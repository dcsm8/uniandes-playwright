import { test } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { PostPage } from "../page-objects/post-page";
import { config } from "../page-objects/config";

test.describe("Posts", () => {
  let loginPage: LoginPage;
  let postPage: PostPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    postPage = new PostPage(page);
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
  });

  test("Crear post", async () => {
    const title = "My Updated Post Title";
    const content = "My Updated Post Content";

    await postPage.navigateToPostEditor();
    await postPage.fillPostTitle(title);
    await postPage.fillPostContent(content);
    await postPage.publishPost();
    await postPage.expectNotificationShown("Published");
  });

  test("Actualizar post", async () => {
    const updatedTitle = "My Updated Post Title";
    const updatedContent = "My Updated Post Content";

    await postPage.navigateToPostList();
    await postPage.filterPublishedPosts();
    await postPage.selectPostByIndex(0);
    await postPage.fillPostTitle(updatedTitle);
    await postPage.fillPostContent(updatedContent);
    await postPage.publishUpdatedPost();
    await postPage.expectNotificationShown("Updated");
  });
});
