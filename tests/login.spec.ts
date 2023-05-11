import { test } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { config } from "../page-objects/config";

test.describe("Given the login page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("When valid credentials are used, Then login should be successful", async ({ page }) => {
    // Given
    const email = config.email;
    const password = config.password;

    // When
    await loginPage.login(email, password);

    // Then
    await loginPage.expectSuccessfulLogin(page);
  });

  test("When incorrect password is used, Then login should fail", async ({ page }) => {
    // Given
    const email = config.email;
    const incorrectPassword = "incorrect_password";

    // When
    await loginPage.loginAttempt(email, incorrectPassword);

    // Then
    await loginPage.expectFailedLogin(page);
  });

  test("When email and password are left blank, Then login should fail", async ({ page }) => {
    // Given
    const email = "";
    const password = "";

    // When
    await loginPage.loginAttempt(email, password);

    // Then
    await loginPage.expectFailedLogin(page);
  });

  test("When logout is performed, Then user should be logged out", async ({ page }) => {
    // Given
    await loginPage.login(config.email, config.password);

    // When
    await loginPage.signout();

    // Then
    await loginPage.expectSuccessfulSignout();
  });
});
