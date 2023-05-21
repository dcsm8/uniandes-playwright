import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { StaffPage } from "../page-objects/staff-page";
import { StaffDataGenerator } from "../data-generators/staff-data-generator";

test.describe("Staff Random", () => {
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

  test("Update user data with random data", async ({ page }) => {
    staffPage.testName = "update-user-data";
    // Given
    const slug = StaffDataGenerator.getValidStaffName();
    const { username, email } = StaffDataGenerator.getRandomStaffData();

    // When
    await staffPage.navigateBySlug(slug);
    await staffPage.updateStaffData(username, email);

    // Then
    await staffPage.expectTagStatus("Saved");
  });
});
