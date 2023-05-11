import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";
import { PagesPage } from "./page-objects/pages-page";

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
    pagesPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
    pageId = await pagesPage.createPage(title, content);
  });

  test("Create page", async () => {
    pagesPage.testName = "create-page";

    // When
    await pagesPage.createPage(title, content);

    // Then
    await pagesPage.expectNotificationShown("Published");
    await pagesPage.expectPageStatus("Published");
  });

  test("Update page", async () => {
    pagesPage.testName = "update-page";

    // Given
    const updatedPage = { title: "Updated Title", content: "Updated Content" };

    // When
    await pagesPage.updatePageById(pageId, updatedPage);

    // Then
    await pagesPage.expectNotificationShown("Updated");
  });

  test("Delete page", async () => {
    pagesPage.testName = "delete-page";

    // When
    await pagesPage.deletePageById(pageId);
    await pagesPage.navigateToPageById(pageId);

    // Then
    const errorCode = await pagesPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read page", async () => {
    pagesPage.testName = "read-page";

    // When
    await pagesPage.navigateToPageById(pageId);

    // Then
    const pageTitle = await pagesPage.getPageTitle();
    const pageContent = await pagesPage.getPageContent();
    expect(pageTitle).toBe(title);
    expect(pageContent).toBe(content);
  });

  test("Create draft", async () => {
    pagesPage.testName = "create-draft";

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
