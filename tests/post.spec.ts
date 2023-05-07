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

  test("Crear un nuevo post", async () => {
    await postPage.navigateToPostEditor();
    await postPage.fillPostTitle("My new Post Title");
    await postPage.fillPostContent("My new Post Content");
    await postPage.publishPost();
    await postPage.expectNotificationShown("Published");
  });
});
