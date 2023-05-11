import { test } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

test.describe("Given the login page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("When valid credentials are used, Then login should be successful", async ({ page }) => {
    // When
    await loginPage.login();

    // Then
    await loginPage.expectSuccessfulLogin(page);
  });

  test("When incorrect password is used, Then login should fail", async ({ page }) => {
    // When
    await loginPage.loginAttempt();

    // Then
    await loginPage.expectFailedLogin(page);
  });

  test("When email and password are left blank, Then login should fail", async ({ page }) => {
    // When
    await loginPage.loginAttempt();

    // Then
    await loginPage.expectFailedLogin(page);
  });

  test("When logout is performed, Then user should be logged out", async ({ page }) => {
    // When
    await loginPage.signout();

    // Then
    await loginPage.expectSuccessfulSignout();
  });
});
