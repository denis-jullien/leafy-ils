import { test, expect } from '@playwright/test';

const LOCALHOST = "http://127.0.0.1:8000";
const URL = LOCALHOST;

test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('api call', async ({ request }) => {
    let data_expected = {
        archived: false,
        created_date: "2025-04-25",
        last_update_date: "2025-04-25",
        title: "string",
        author: "string",
        abstract: "string",
        publisher: "string",
        catalog: "string",
        category_type: "string",
        category_age: "string",
        category_topics: "string",
        cover: "string",
        available: true,
        isbn: 1,
        format: "string",
        publication_date: "string",
        record_source: "string"
      }
    const result = await request.post(`${URL}/api/v1/books`, {
        data: data_expected
    })
    expect(result.ok()).toBeTruthy();
    console.log(result);
    const json_result = await result.json();
    console.log(json_result);
    data_expected["language"] = null
    expect(json_result).toHaveProperty('id')
    delete json_result.id
    expect(json_result).toEqual(
          data_expected
        );

    const result2 = await request.get(`${URL}/api/v1/books`)
    expect(result2.ok()).toBeTruthy();
    console.log(result2);
    console.log(result2.json())
})
