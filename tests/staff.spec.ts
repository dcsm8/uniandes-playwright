import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";
import { config } from "../page-objects/config";
import { StaffPage } from "../page-objects/staff-page";
import { faker } from "@faker-js/faker";

test.describe("Staff", () => {
  let loginPage: LoginPage;
  let staffPage: StaffPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    staffPage = new StaffPage(page);
    await loginPage.navigate();
    await loginPage.login(config.email, config.password);
  });

  test("Consultar datos usuario", async ({ page }) => {
    const slug = "ghost";
    await staffPage.navigateBySlug("ghost");
    const currentSlug = await staffPage.getSlug();
    expect(slug).toBe(currentSlug);
  });

  test("Actualizar datos usuario", async ({ page }) => {
    await staffPage.navigateBySlug("ghost");
    await staffPage.updateStaffName(faker.internet.userName(), faker.internet.email());
    await staffPage.expectTagStatus("Saved");
  });
});
