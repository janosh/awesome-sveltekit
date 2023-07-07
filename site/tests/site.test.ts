import { expect, test } from '@playwright/test'

// to run tests in this file, use `npm run test:e2e`
test.describe.configure({ mode: `parallel` })

test(`test search functionality on the landing page`, async ({ page }) => {
  await page.goto(`/`, { waitUntil: `networkidle` })
  const all = await page.$$(`ol > li > a:has(> img)`)
  await page.fill(`[placeholder='Search...']`, `test`)
  await page.waitForTimeout(1_000)

  const filtered = await page.$$(`ol > li > a:has(> img)`)
  expect(all.length > filtered.length).toBe(true)

  // TODO also test sort functionality
})

test(`can navigate between detail pages with arrow keys`, async ({ page }) => {
  // test that the arrow keys don't work on the landing page
  await page.goto(`/`, { waitUntil: `networkidle` })

  await page.keyboard.press(`ArrowRight`)
  // get slugs to first 2 detail pages
  const [slug_1, slug_2] = await page.$$eval(
    `ol > li > a:has(> img)`,
    (cards) => cards.map((card) => card.getAttribute(`href`)),
  )

  // test that the arrow keys work on detail pages
  await page.goto(`/${slug_1}`, { waitUntil: `networkidle` })
  await page.keyboard.press(`ArrowRight`)
  await page.waitForURL(`/${slug_2}`, {
    waitUntil: `networkidle`,
  })

  await page.keyboard.press(`ArrowLeft`)
  await page.waitForURL(`/${slug_1}`, {
    waitUntil: `networkidle`,
  })
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
