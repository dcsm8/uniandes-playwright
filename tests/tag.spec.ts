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
    loginPage = new LoginPage(page);
    tagPage = new TagPage(page);
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
    tagId = await tagPage.createTag(name, description);
  });

  test("Crear tag", async () => {
    await tagPage.createTag(name, description);
    await tagPage.expectTagStatus("Saved");
  });

  test("Actualizar tag", async () => {
    const updatedTag = { name: "Updated Name", description: "Updated Description" };
    await tagPage.updateTagById(tagId, updatedTag);
    await tagPage.expectTagStatus("Saved");
  });

  test("Eliminar tag", async () => {
    await tagPage.deleteTagById(tagId);
    await tagPage.navigateToTagById(tagId);

    const errorCode = await tagPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Leer tag", async () => {
    await tagPage.navigateToTagById(tagId);
    const tagName = await tagPage.getTagName();
    const tagDescription = await tagPage.getTagDescription();
    expect(tagName).toBe(name);
    expect(tagDescription).toBe(description);
  });
});
