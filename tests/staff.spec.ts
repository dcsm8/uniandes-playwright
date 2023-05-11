import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { config } from "../page-objects/config";
import { StaffPage } from "../page-objects/staff-page";
import { faker } from "@faker-js/faker";

test.describe("Staff", () => {
  let loginPage: LoginPage;
  let staffPage: StaffPage;

  test.beforeEach(async ({ page }) => {
    // Given
    loginPage = new LoginPage(page);
    staffPage = new StaffPage(page);
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
  });

  test("Consult user data", async ({ page }) => {
    // Given
    const slug = "ghost";

    // When
    await staffPage.navigateBySlug("ghost");

    // Then
    const currentSlug = await staffPage.getSlug();
    expect(slug).toBe(currentSlug);
  });

  test("Update user data", async ({ page }) => {
    // When
    await staffPage.navigateBySlug("ghost");
    await staffPage.updateStaffName(faker.internet.userName(), faker.internet.email());

    // Then
    await staffPage.expectTagStatus("Saved");
  });
});
