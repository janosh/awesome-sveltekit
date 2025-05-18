import { expect, test } from '@playwright/test'

// to run tests in this file, use `npm run test:e2e`
test.describe.configure({ mode: `parallel` })

test(`test search functionality on the landing page`, async ({ page }) => {
  // failing in CI for unknown reason
  if (process.env.CI) test.skip()

  await page.goto(`/`, { waitUntil: `networkidle` })

  const site_locator = page.locator(`ol > li > div.flex + p.tags`)
  const initial_site_count = await site_locator.count()

  // Ensure there are sites to filter from.
  expect(initial_site_count).toBeGreaterThan(0)

  // 1. Test that a non-matching search term yields zero results
  const unlikely_search_term = `THIS_SHOULD_NOT_MATCH_ANY_SITES`
  await page.fill(`[placeholder='Search...']`, unlikely_search_term)

  // Wait for the search to filter and expect no sites to be visible
  await expect(site_locator).toHaveCount(0, { timeout: 5000 })

  // 2. Test that clearing the search brings back all sites
  await page.fill(`[placeholder='Search...']`, ``) // Clear the search
  await expect(site_locator).toHaveCount(initial_site_count, { timeout: 5000 })

  // TODO also test sort functionality
})

test(`can navigate between detail pages with arrow keys`, async ({ page }) => {
  await page.goto(`/`, { waitUntil: `networkidle` })

  await page.keyboard.press(`ArrowRight`)

  // Navigate to first page
  await page.goto(`/svelte.dev`, { waitUntil: `networkidle` })

  // Get the next URL from the "Next" link
  const next_url = await page.$eval(`a:has-text("Next")`, (el) =>
    el.closest(`a`)?.getAttribute(`href`),
  )

  await page.keyboard.press(`ArrowRight`)
  await page.waitForURL(`/${next_url}`)
})

test(`can navigate landing page with arrow keys`, async ({ page }) => {
  await page.goto(`/`, { waitUntil: `networkidle` })

  // expect no matches for ol > li.active
  expect(await page.$(`ol > li.active`)).toBe(null)

  // get active card after
  await page.keyboard.press(`ArrowRight`)

  // get slug of active site
  const slug = await page.$eval(`ol > li.active > a:has(> img)`, (card) =>
    card.getAttribute(`href`),
  )

  // press enter and check that we're on the detail page
  await page.keyboard.press(`Enter`)
  await page.waitForURL(`/${slug}`, {
    waitUntil: `networkidle`,
  })
})

// Test 404 page
test(`shows 404 page for invalid slugs`, async ({ page }) => {
  const response = await page.goto(`/not-a-real-site`, {
    waitUntil: `networkidle`,
  })

  expect(response?.status()).toBe(404)
  await expect(
    page.locator(`text=Page 'not-a-real-site' not found`),
  ).toBeVisible()
})

// Test metadata
test(`page has correct meta tags`, async ({ page }) => {
  await page.goto(`/svelte.dev`, { waitUntil: `networkidle` })

  // Check title
  await expect(page).toHaveTitle(`Svelte.dev | Awesome SvelteKit`)

  // Check meta description
  const description = await page.$eval(`meta[name="description"]`, (el) =>
    el.getAttribute(`content`),
  )
  expect(description).toBe(`Cybernetically enhanced web apps.`)

  // Check OG tags
  const og_title = await page.$eval(`meta[property="og:title"]`, (el) =>
    el.getAttribute(`content`),
  )
  expect(og_title).toBe(`Svelte.dev | Awesome SvelteKit`)
})
