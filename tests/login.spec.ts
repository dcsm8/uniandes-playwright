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

  test("Iniciar sesión con contraseña incorrecta", async ({ page }) => {
    await loginPage.loginAttempt(config.email, "incorrect_password");
    await loginPage.expectFailedLogin(page);
  });

  test("Iniciar sesión con correo y contraseña en blanco", async ({ page }) => {
    await loginPage.loginAttempt("", "");
    await loginPage.expectFailedLogin(page);
  });

  test("Cerrar sesión", async ({ page }) => {
    await loginPage.login(config.email, config.password);
    await loginPage.signout();
    await loginPage.expectSuccessfulSignout();
  });
});
