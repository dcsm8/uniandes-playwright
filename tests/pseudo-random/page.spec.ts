import { test, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/login-page";
import { PagesPage } from "../../page-objects/pages-page";
import { PageDataGenerator } from "../../data-generators/page-data-generator";

test.describe("Pages Pseudo-Random", () => {
  let loginPage: LoginPage;
  let pagesPage: PagesPage;
  let pageId: string;

  // Apriori data generation
  const { title, content } = PageDataGenerator.getValidPageData();

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    pagesPage = new PagesPage(page);
    pagesPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
  });

  test("Create page with title at boundary", async () => {
    pagesPage.testName = "create-page-title-boundary";

    // Given
    const { content } = PageDataGenerator.getValidPageData();
    const { title } = PageDataGenerator.getBoundaryPageData();

    // When
    await pagesPage.createPage(title, content);

    // Then
    await pagesPage.expectNotificationShown("Published");
    await pagesPage.expectPageStatus("Published");
  });

  test("Create page with title beyond boundary", async () => {
    pagesPage.testName = "create-page-title-beyond-boundary";

    // Given
    const publishMenuButton = pagesPage.page.locator(".gh-publishmenu-button");
    const { content } = PageDataGenerator.getValidPageData();
    const { title } = PageDataGenerator.getBoundaryPageDataPlusOne();

    // When
    await pagesPage.navigateToPageEditor();
    await pagesPage.fillPageTitle(title);
    await pagesPage.fillPageContent(content);

    // Then
    await expect(publishMenuButton).not.toBeVisible();
  });

  test("Update page with valid data - title at boundary", async () => {
    pagesPage.testName = "update-page-title-boundary";

    // Given
    const { content, title } = PageDataGenerator.getValidPageData();
    const updatedPage = PageDataGenerator.getBoundaryPageData();

    // Create a page with the initial title and content
    pageId = await pagesPage.createPage(title, content);

    // When
    await pagesPage.updatePageById(pageId, updatedPage);

    // Then
    await pagesPage.expectNotificationShown("Updated");
  });

  test("Update page with valid data - title beyond boundary", async () => {
    pagesPage.testName = "update-page-title-beyond-boundary";

    // Given
    const { content, title } = PageDataGenerator.getValidPageData();
    const updatedPage = PageDataGenerator.getBoundaryPageDataPlusOne();

    // Create a page with the initial title and content
    pageId = await pagesPage.createPage(title, content);

    // When
    await pagesPage.updatePageById(pageId, updatedPage);

    // Then
    await pagesPage.expectTitleUpdateErrorMessage();
  });

  test("Delete page with valid data - boundary", async () => {
    pagesPage.testName = "delete-page-boundary";

    // Given
    const { title, content } = PageDataGenerator.getBoundaryPageData();

    // Create a page with the initial title and content
    pageId = await pagesPage.createPage(title, content);

    // When
    await pagesPage.deletePageById(pageId);
    await pagesPage.navigateToPageById(pageId);

    // Then
    const errorCode = await pagesPage.getErrorMessageText();
    expect(errorCode).toBe("404");
  });

  test("Read page with valid data - title at boundary", async () => {
    pagesPage.testName = "read-page-title-boundary";

    // Given
    const { title, content } = PageDataGenerator.getBoundaryPageData();

    // Create a page with the initial title and content
    pageId = await pagesPage.createPage(title, content);

    // When
    await pagesPage.navigateToPageById(pageId);

    // Then
    const pageTitle = await pagesPage.getPageTitle();
    const pageContent = await pagesPage.getPageContent();
    expect(pageTitle).toBe(title);
    expect(pageContent).toBe(content);
  });

  test("Create draft with valid data", async () => {
    pagesPage.testName = "create-draft";
    // Given
    pageId = await pagesPage.createPage(title, content);

    // When
    await pagesPage.navigateToPageEditor();
    await pagesPage.fillPageTitle(title);
    await pagesPage.fillPageContent(content);

    // Then
    await pagesPage.expectPageStatus("Draft");
  });
});
