import { test, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/login-page";
import { PagesPage } from "../../page-objects/pages-page";
import { PageDataGenerator } from "../../data-generators/page-data-generator";

test.describe("Pages Random", () => {
  let loginPage: LoginPage;
  let pagesPage: PagesPage;
  let pageId: string;

  // Random data generation
  const { title, content } = PageDataGenerator.getRandomPageData();

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    pagesPage = new PagesPage(page);
    pagesPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
    pageId = await pagesPage.createPage(title, content);
  });

  test("Create page with random data", async () => {
    pagesPage.testName = "create-page";

    // When
    await pagesPage.createPage(title, content);

    // Then
    await pagesPage.expectNotificationShown("Published");
    await pagesPage.expectPageStatus("Published");
  });

  test("Update page with random data", async () => {
    pagesPage.testName = "update-page";

    // Given
    const updatedPage = PageDataGenerator.getRandomPageData();

    // When
    await pagesPage.updatePageById(pageId, updatedPage);

    // Then
    await pagesPage.expectNotificationShown("Updated");
  });

  test("Delete page with random data", async () => {
    pagesPage.testName = "delete-page";

    // When
    await pagesPage.deletePageById(pageId);
    await pagesPage.navigateToPageById(pageId);

    // Then
    const errorCode = await pagesPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read page with random data", async () => {
    pagesPage.testName = "read-page";

    // When
    await pagesPage.navigateToPageById(pageId);

    // Then
    const pageTitle = await pagesPage.getPageTitle();
    const pageContent = await pagesPage.getPageContent();
    expect(pageTitle).toBe(title);
    expect(pageContent).toBe(content);
  });

  test("Create draft with random data", async () => {
    pagesPage.testName = "create-draft";

    // When
    await pagesPage.navigateToPageEditor();
    await pagesPage.fillPageTitle(title);
    await pagesPage.fillPageContent(content);

    // Then
    await pagesPage.expectPageStatus("Draft");
  });
});
