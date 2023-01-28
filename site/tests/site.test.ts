import { expect, test } from '@playwright/test'

// to run tests in this file, use `npm run test:e2e`
test.describe.configure({ mode: `parallel` })

const base_url = process.env.PLAYWRIGHT_TEST_BASE_URL

test(`can navigate between detail pages with arrow keys`, async ({ page }) => {
  // test that the arrow keys don't work on the landing page
  await page.goto(`/`, { waitUntil: `networkidle` })

  await page.keyboard.press(`ArrowRight`)
  expect(page.url()).toBe(`${base_url}/`)
  // get slugs to first 2 detail pages
  const [slug_1, slug_2] = await page.$$eval(
    `ol > li > a:has(> img)`,
    (cards) => cards.map((card) => card.getAttribute(`href`))
  )

  // test that the arrow keys work on detail pages
  await page.goto(`/${slug_1}`, { waitUntil: `networkidle` })
  await page.keyboard.press(`ArrowRight`)
  await page.waitForURL(`${base_url}/${slug_2}`, {
    waitUntil: `networkidle`,
  })

  await page.keyboard.press(`ArrowLeft`)
  await page.waitForURL(`${base_url}/${slug_1}`, {
    waitUntil: `networkidle`,
  })
})
