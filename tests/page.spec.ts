import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { PagesPage } from "../page-objects/pages-page";

test.describe("Pages", () => {
  let loginPage: LoginPage;
  let pagesPage: PagesPage;
  let pageId: string;
  const title = "New Title";
  const content = "New Content";

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    pagesPage = new PagesPage(page);
    await loginPage.navigate();
    await loginPage.login();
    pageId = await pagesPage.createPage(title, content);
  });

  test("Create page", async () => {
    // When
    await pagesPage.createPage(title, content);

    // Then
    await pagesPage.expectNotificationShown("Published");
    await pagesPage.expectPageStatus("Published");
  });

  test("Update page", async () => {
    // Given
    const updatedPage = { title: "Updated Title", content: "Updated Content" };

    // When
    await pagesPage.updatePageById(pageId, updatedPage);

    // Then
    await pagesPage.expectNotificationShown("Updated");
  });

  test("Delete page", async () => {
    // When
    await pagesPage.deletePageById(pageId);
    await pagesPage.navigateToPageById(pageId);

    // Then
    const errorCode = await pagesPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read page", async () => {
    // When
    await pagesPage.navigateToPageById(pageId);

    // Then
    const pageTitle = await pagesPage.getPageTitle();
    const pageContent = await pagesPage.getPageContent();
    expect(pageTitle).toBe(title);
    expect(pageContent).toBe(content);
  });

  test("Create draft", async () => {
    // Given
    const pageTitle = "New Title";
    const pageContent = "New Content";

    // When
    await pagesPage.navigateToPageEditor();
    await pagesPage.fillPageTitle(pageTitle);
    await pagesPage.fillPageContent(pageContent);

    // Then
    await pagesPage.expectPageStatus("Draft");
  });
});
