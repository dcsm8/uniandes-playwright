import { test, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/login-page";
import { TagPage } from "../../page-objects/tags-page";
import { TagDataGenerator } from "../../data-generators/tag-data-generator";

test.describe("Tags Pseudo Random", () => {
  let loginPage: LoginPage;
  let tagPage: TagPage;

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    tagPage = new TagPage(page);
    tagPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
  });

  test("Create tag - boundary", async () => {
    tagPage.testName = "create-tag-boundary";
    // Given
    const { name: boundaryName, description: boundaryDescription } = TagDataGenerator.getBoundaryTagData();

    // When
    await tagPage.createTag(boundaryName, boundaryDescription);

    // Then
    await tagPage.expectTagStatus("Saved");
  });

  test("Create tag - beyond boundary", async () => {
    tagPage.testName = "create-tag-beyond-boundary";
    // Given
    const { name: beyondBoundaryName, description: beyondBoundaryDescription } =
      TagDataGenerator.getBoundaryTagDataPlusOne();

    // When
    await tagPage.createTag(beyondBoundaryName, beyondBoundaryDescription);

    // Then
    await tagPage.expectTagNameError();
  });

  test("Update tag - boundary", async () => {
    tagPage.testName = "update-tag-boundary";
    // Given
    const { name: boundaryName, description: boundaryDescription } = TagDataGenerator.getValidTagData();
    const updatedTag = TagDataGenerator.getBoundaryTagData();
    const tagId = await tagPage.createTag(boundaryName, boundaryDescription);

    // When
    await tagPage.updateTagById(tagId, updatedTag);

    // Then
    await tagPage.expectTagStatus("Saved");
  });

  test("Update tag - beyond boundary", async () => {
    tagPage.testName = "update-tag-beyond-boundary";
    // Given
    const { name: beyondBoundaryName, description: beyondBoundaryDescription } = TagDataGenerator.getValidTagData();
    const updatedTag = TagDataGenerator.getBoundaryTagDataPlusOne();
    const tagId = await tagPage.createTag(beyondBoundaryName, beyondBoundaryDescription);

    // When
    await tagPage.updateTagById(tagId, updatedTag);

    // Then
    await tagPage.expectTagNameError();
  });

  test("Delete tag - boundary", async () => {
    tagPage.testName = "delete-tag-boundary";
    // Given
    const { name: boundaryName, description: boundaryDescription } = TagDataGenerator.getValidTagData();
    const tagId = await tagPage.createTag(boundaryName, boundaryDescription);

    // When
    await tagPage.deleteTagById(tagId);
    await tagPage.navigateToTagById(tagId);

    // Then
    const errorCode = await tagPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read tag - boundary", async () => {
    tagPage.testName = "read-tag-boundary";
    // Given
    const { name: boundaryName, description: boundaryDescription } = TagDataGenerator.getBoundaryTagData();
    const tagId = await tagPage.createTag(boundaryName, boundaryDescription);

    // When
    await tagPage.navigateToTagById(tagId);

    // Then
    const tagName = await tagPage.getTagName();
    const tagDescription = await tagPage.getTagDescription();
    expect(tagName).toBe(boundaryName);
    expect(tagDescription).toBe(boundaryDescription);
  });
});
