import { test, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/login-page";
import { StaffPage } from "../../page-objects/staff-page";
import { StaffDataGenerator } from "../../data-generators/staff-data-generator";

test.describe("Staff Apriori", () => {
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
    const slug = StaffDataGenerator.getValidStaffName();

    // When
    await staffPage.navigateBySlug(slug);

    // Then
    const currentSlug = await staffPage.getSlug();
    expect(slug).toBe(currentSlug);
  });

  test("Update user data", async ({ page }) => {
    staffPage.testName = "update-user-data";
    // Given
    const slug = StaffDataGenerator.getValidStaffName();
    const { username, email } = StaffDataGenerator.getValidStaffData();

    // When
    await staffPage.navigateBySlug(slug);
    await staffPage.updateStaffData(username, email);

    // Then
    await staffPage.expectTagStatus("Saved");
  });
});
