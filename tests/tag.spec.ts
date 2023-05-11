import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { TagPage } from "../page-objects/tags-page";
import { config } from "../page-objects/config";

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
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
    tagId = await tagPage.createTag(name, description);
  });

  test("Create tag", async () => {
    // When
    await tagPage.createTag(name, description);

    // Then
    await tagPage.expectTagStatus("Saved");
  });

  test("Update tag", async () => {
    // Given
    const updatedTag = { name: "Updated Name", description: "Updated Description" };

    // When
    await tagPage.updateTagById(tagId, updatedTag);

    // Then
    await tagPage.expectTagStatus("Saved");
  });

  test("Delete tag", async () => {
    // When
    await tagPage.deleteTagById(tagId);
    await tagPage.navigateToTagById(tagId);

    // Then
    const errorCode = await tagPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read tag", async () => {
    // When
    await tagPage.navigateToTagById(tagId);

    // Then
    const tagName = await tagPage.getTagName();
    const tagDescription = await tagPage.getTagDescription();
    expect(tagName).toBe(name);
    expect(tagDescription).toBe(description);
  });
});
