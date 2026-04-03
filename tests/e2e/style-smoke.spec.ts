import { expect, test } from "@playwright/test"

test("compiled shared form styles are applied on the smoke page", async ({ page }) => {
  await page.goto("/playwright/style-smoke.html")

  const card = page.locator("[data-testid='style-card']")
  const emailInput = page.locator('input[placeholder="Email"]')
  const passwordInput = page.locator('input[placeholder="Password"]')
  const checkboxInput = page.locator('input[type="checkbox"]')
  const radioInput = page.locator('input[type="radio"]')

  await expect(card).toBeVisible()
  await expect(emailInput).toBeVisible()
  await expect(passwordInput).toBeVisible()
  await expect(checkboxInput).toBeVisible()
  await expect(radioInput).toBeVisible()

  await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)")
  await expect(card).toHaveCSS("border-top-left-radius", "16px")

  await expect(emailInput).toHaveClass(/ui-input/)
  await expect(emailInput).toHaveCSS("height", "36px")
  await expect(emailInput).toHaveCSS("border-top-left-radius", "8px")
  await expect(emailInput).toHaveCSS("background-color", "oklch(0.985 0 0)")

  await expect(passwordInput).toHaveClass(/ui-input/)
  await expect(passwordInput).toHaveCSS("height", "36px")
  await expect(passwordInput).toHaveCSS("padding-right", "36px")

  await expect(checkboxInput).toHaveClass(/ui-checkbox/)
  await expect(checkboxInput).toHaveCSS("width", "16px")
  await expect(checkboxInput).toHaveCSS("height", "16px")

  await expect(radioInput).toHaveClass(/ui-radio/)
  await expect(radioInput).toHaveCSS("border-top-left-radius", "3.35544e+07px")

  await expect(page).toHaveScreenshot("style-smoke-page.png", { fullPage: true })
})
