import { test, expect, Page } from "@playwright/test";

const config = {
  baseUrl: "http://localhost:3001",
  email: "dc.sanchezm1@uniandes.edu.co",
  password: "$ArQ^P$Unuzj69",
};

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToLoginPage(page);
    await loginWithCredentials(page, config.email, config.password);
  });

  test("Iniciar sesión con credenciales válidas", async ({ page }) => {
    await expectSuccessfulLogin(page);
  });

  test("Iniciar sesión con credenciales inválidas", async ({ page }) => {
    await navigateToLoginPage(page);
    await loginWithCredentials(
      page,
      "invalid_email@example.com",
      "invalid_password"
    );
    await expectUnsuccessfulLogin(page);
  });
});

test.describe("Posts", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToLoginPage(page);
    await loginWithCredentials(page, config.email, config.password);
  });

  test("Crear un nuevo post", async ({ page }) => {
    await navigateToPostPage(page);
    await page.waitForSelector(".posts-list");
    const postListElementsBefore = await page.$$(".gh-posts-list-item");
    await navigateToPostEditor(page);
    await page.getByPlaceholder("Post Title").click();
    await page.getByPlaceholder("Post Title").fill("My new Post Title");
    await page.locator(".koenig-editor__editor").click();
    await page.locator(".koenig-editor__editor").fill("My new Post Content");
    await page.getByRole("button", { name: "Publish" }).click();
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await page.waitForTimeout(1000);
    await navigateToPostPage(page);
    await expectPostCreatedSuccessfully(page, postListElementsBefore.length);
  });
});

async function navigateToLoginPage(page: Page) {
  await page.goto(`${config.baseUrl}/ghost/#/signin`);
}

async function loginWithCredentials(
  page: Page,
  email: string,
  password: string
) {
  await page.fill('input[name="identification"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

async function expectSuccessfulLogin(page: Page) {
  await page.waitForSelector('a[href="#/site/"]');
  const url = page.url();
  expect(url).toContain("/ghost/#/site");
}

async function expectUnsuccessfulLogin(page: Page) {
  const errorMessage = await page.waitForSelector(".gh-btn-red");
  expect(errorMessage).toBeTruthy();
}

async function navigateToPostPage(page: Page) {
  await page.goto(`${config.baseUrl}/ghost/#/posts/`);
}

async function navigateToPostEditor(page: Page) {
  await page.goto(`${config.baseUrl}/ghost/#/editor/post/`);
}

async function expectPostCreatedSuccessfully(page: Page, initialCount: number) {
  const postListElementsAfter = await page.$$(".gh-posts-list-item");
  expect(postListElementsAfter.length).toBe(initialCount + 1);
}
