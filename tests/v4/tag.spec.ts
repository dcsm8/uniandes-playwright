import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";
import { TagPage } from "./page-objects/tags-page";

test.describe("Tags", () => {
  let loginPage: LoginPage;
  let tagPage: TagPage;
  let tagId: string;
  const name = "New Name";
  const description = "New Description";

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    tagPage = new TagPage(page);
    tagPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
    tagId = await tagPage.createTag(name, description);
  });

  test("Create tag", async () => {
    tagPage.testName = "create-tag";
    // When
    await tagPage.createTag(name, description);

    // Then
    await tagPage.expectTagStatus("Saved");
  });

  test("Update tag", async () => {
    tagPage.testName = "update-tag";
    // Given
    const updatedTag = { name: "Updated Name", description: "Updated Description" };

    // When
    await tagPage.updateTagById(tagId, updatedTag);

    // Then
    await tagPage.expectTagStatus("Saved");
  });
});
