import { test } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { config } from "../page-objects/config";

test.describe("Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("Iniciar sesión con credenciales válidas", async ({ page }) => {
    await loginPage.login(config.email, config.password);
    await loginPage.expectSuccessfulLogin(page);
  });

  test("Iniciar sesión con credenciales inválidas", async ({ page }) => {
    await loginPage.login("invalid@example.com", "invalid_password");
    await loginPage.expectFailedLogin(page);
  });
});
