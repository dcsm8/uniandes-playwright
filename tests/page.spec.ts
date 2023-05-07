import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { PagesPage } from "../page-objects/pages-page";
import { config } from "../page-objects/config";

test.describe("Pages", () => {
  let loginPage: LoginPage;
  let pagePage: PagesPage;
  let pageId: string;
  const title = "New Title";
  const content = "New Content";

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pagePage = new PagesPage(page);
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
    pageId = await pagePage.createPage(title, content);
  });

  test("Crear page", async () => {
    await pagePage.createPage(title, content);
    await pagePage.expectNotificationShown("Published");
    await pagePage.expectPageStatus("Published");
  });

  test("Actualizar page", async () => {
    const updatedPage = { title: "Updated Title", content: "Updated Content" };
    await pagePage.updatePageById(pageId, updatedPage);
    await pagePage.expectNotificationShown("Updated");
  });

  test("Eliminar page", async () => {
    await pagePage.deletePageById(pageId);
    await pagePage.navigateToPageById(pageId);

    const errorCode = await pagePage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Leer page", async () => {
    await pagePage.navigateToPageById(pageId);
    const pageTitle = await pagePage.getPageTitle();
    const pageContent = await pagePage.getPageContent();
    expect(pageTitle).toBe(title);
    expect(pageContent).toBe(content);
  });

  test("Crear borrador", async () => {
    const pageTitle = "New Title";
    const pageContent = "New Content";
    await pagePage.navigateToPageEditor();
    await pagePage.fillPageTitle(pageTitle);
    await pagePage.fillPageContent(pageContent);
    await pagePage.expectPageStatus("Draft");
  });
});
