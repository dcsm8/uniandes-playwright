import { test, expect, Page } from "@playwright/test";

const config = {
  baseUrl: "http://localhost:3001",
  email: "dc.sanchezm1@uniandes.edu.co",
  password: "$ArQ^P$Unuzj69",
};

test.describe("Login", () => {
  test("Iniciar sesión con credenciales válidas", async ({ page }) => {
    // Given
    await navigateToLoginPage(page);

    // When
    await loginWithCredentials(page, config.email, config.password);

    // Then
    await expectSuccessfulLogin(page);
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
