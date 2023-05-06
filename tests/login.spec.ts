import { test } from "@playwright/test";

test.describe("Login", () => {
  test("Iniciar sesión con credenciales válidas.", async ({ page }) => {
    await page.goto("http://localhost:3001/ghost/#/signin");
    await page.getByPlaceholder("Email Address").click();
    await page
      .getByPlaceholder("Email Address")
      .fill("dc.sanchezm1@uniandes.edu.co");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("$ArQ^P$Unuzj69");
    await page.getByRole("button", { name: "Sign in" }).click();
  });
});
