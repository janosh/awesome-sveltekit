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
  await page.goto(`/`, { waitUntil: `networkidle` })

  await page.keyboard.press(`ArrowRight`)

  // Navigate to first page
  await page.goto(`/svelte.dev`, { waitUntil: `networkidle` })

  // Get the next URL from the "Next" link
  const nextUrl = await page.$eval(`a:has-text("Next")`, (el) =>
    el.closest(`a`)?.getAttribute(`href`),
  )

  await page.keyboard.press(`ArrowRight`)
  await page.waitForURL(`/${nextUrl}`)
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
