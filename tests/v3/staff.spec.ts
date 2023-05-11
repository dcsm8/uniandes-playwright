import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";
import { StaffPage } from "./page-objects/staff-page";
import { faker } from "@faker-js/faker";

test.describe("Staff", () => {
  let loginPage: LoginPage;
  let staffPage: StaffPage;

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    staffPage = new StaffPage(page);
    staffPage.testName = "before-each";
    await loginPage.navigate();
    await loginPage.login();
  });

  test("Consult user data", async ({ page }) => {
    staffPage.testName = "consult-user-data";
    // Given
    const slug = "ghost";

    // When
    await staffPage.navigateBySlug("ghost");

    // Then
    const currentSlug = await staffPage.getSlug();
    expect(slug).toBe(currentSlug);
  });

  test("Update user data", async ({ page }) => {
    staffPage.testName = "update-user-data";
    // When
    await staffPage.navigateBySlug("ghost");
    await staffPage.updateStaffName(faker.internet.userName(), faker.internet.email());

    // Then
    await staffPage.expectTagStatus("Saved");
  });
});
