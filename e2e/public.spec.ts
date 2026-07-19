import { test,expect } from "@playwright/test";
test("landing page exposes authentication",async({page})=>{await page.goto("/");await expect(page.getByRole("heading",{name:/launch your ecommerce product/i})).toBeVisible();});
