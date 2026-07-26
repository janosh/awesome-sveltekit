import { expect, test } from '@playwright/test'

// To run tests in this file, use `npx playwright test`
test.describe.configure({ mode: `parallel` })

test(`filters and sorts the site list, mirroring state in URL params`, async ({
  page,
}) => {
  await page.goto(`/`, { waitUntil: `networkidle` })

  const cards = page.locator(`ol > li > div.flex + p.tags`)
  const match_count = page.locator(`main > p`)
  // Star counts are the only sort key the cards render, so they're what we can
  // check the ordering against
  const star_counts = () =>
    page
      .locator(`ol > li div.flex > small`)
      .evaluateAll((nodes) =>
        nodes.map((node) => Number(node.textContent?.replaceAll(/\D/gu, ``))),
      )

  expect(await cards.count()).toBeGreaterThan(0)

  // A term matching nothing empties the list
  await page.fill(`[placeholder='Search...']`, `THIS_SHOULD_NOT_MATCH_ANY_SITES`)
  await expect(match_count).toHaveText(`0 matches (try different filters)`)
  await expect(cards).toHaveCount(0)
  // Clearing brings every site back — the count only hides at the full total
  await page.fill(`[placeholder='Search...']`, ``)
  await expect(match_count).toHaveCount(0)

  await page.fill(`[placeholder='Search...']`, `svelte`)
  await expect(page).toHaveURL(/\?q=svelte$/)

  // Multiple selections share one comma-joined param, and labels containing
  // spaces round-trip through the encoding
  const tag_select = page.locator(`div.multiselect`).first()
  const tag_input = tag_select.locator(`ul.selected input`)
  await tag_input.fill(`component lib`)
  await tag_select.locator(`ul.options li`).first().click()
  await expect(page).toHaveURL(/&tags=component\+library$/)
  await tag_input.fill(`docs`)
  await tag_select.locator(`ul.options li`).first().click()
  await expect(page).toHaveURL(/&tags=component\+library,docs$/)

  // MultiSelect keeps its dropdown open after a pick. Once the filter bar wraps
  // (narrow viewports, e.g. CI) the open list sits over the sort buttons and
  // swallows their clicks, so dismiss it first.
  await tag_input.press(`Escape`)
  await expect(tag_select.locator(`ul.options`)).toBeHidden()

  await page.getByRole(`button`, { name: `Date Created` }).click()
  await page.getByRole(`button`, { name: `asc`, exact: true }).click()
  await expect(page).toHaveURL(/&sort=date&order=asc$/)

  // Defaults are omitted so shared links stay short
  await page.fill(`[placeholder='Search...']`, ``)
  await tag_input.press(`Backspace`)
  await tag_input.press(`Backspace`)
  await tag_input.press(`Escape`)
  // Dropping below two tags unmounts the all/any toggle, shifting the sort
  // buttons ~120px. Wait for the URL (written in an effect, so after the DOM
  // update) before clicking them, or the clicks land on stale coordinates.
  await expect(page).toHaveURL(/\?sort=date&order=asc$/)
  await page.getByRole(`button`, { name: `GitHub Stars` }).click()
  await page.getByRole(`button`, { name: `desc`, exact: true }).click()
  await expect(page).toHaveURL(/\/$/)

  // Sorting reorders the list itself, not just the URL
  const desc_stars = await star_counts()
  expect(desc_stars.length).toBeGreaterThan(1)
  expect(desc_stars).toEqual(desc_stars.toSorted((star_a, star_b) => star_b - star_a))
  await page.getByRole(`button`, { name: `asc`, exact: true }).click()
  await expect.poll(star_counts).toEqual(desc_stars.toReversed())
})

test(`restores filter and sort state from URL params`, async ({ page }) => {
  const url = `/?q=blog&tags=blog,docs&sort=date&order=asc`
  await page.goto(url, { waitUntil: `networkidle` })

  await expect(page.locator(`[placeholder='Search...']`)).toHaveValue(`blog`)
  const selected_tags = page.locator(`ul.selected`).first().locator(`li`)
  await expect(selected_tags).toHaveCount(2)
  await expect(selected_tags.first()).toContainText(`blog`)
  await expect(selected_tags.last()).toContainText(`docs`)
  await expect(page.getByRole(`button`, { name: `Date Created` })).toHaveClass(/active/)
  await expect(page.getByRole(`button`, { name: `asc`, exact: true })).toHaveClass(
    /active/,
  )
  // The URL-sync effect must not wipe the params it just restored from
  await expect(page).toHaveURL(url)

  // State survives a round trip to a detail page and back
  await page.locator(`ol > li a:has(> img)`).first().click()
  await page.waitForURL((detail_url) => !detail_url.search)
  await page.goBack()
  await expect(page).toHaveURL(url)
  await expect(page.locator(`[placeholder='Search...']`)).toHaveValue(`blog`)
  await expect(page.getByRole(`button`, { name: `asc`, exact: true })).toHaveClass(
    /active/,
  )

  // Unknown values fall back to defaults instead of erroring
  await page.goto(`/?q=blog&tags=not-a-real-tag&utm_source=test&sort=bogus`, {
    waitUntil: `networkidle`,
  })
  // MultiSelect only renders its placeholder while nothing is selected
  await expect(page.getByPlaceholder(`Filter by tag...`)).toBeVisible()
  await expect(page.getByRole(`button`, { name: `GitHub Stars` })).toHaveClass(/active/)
  // Unmanaged params survive, unknown managed ones are dropped, and managed
  // params keep their position instead of being shuffled to the end
  await page.fill(`[placeholder='Search...']`, `docs`)
  await expect(page).toHaveURL(`/?q=docs&utm_source=test`)
})

test(`can navigate between detail pages with arrow keys`, async ({ page }) => {
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

  // Expect no matches for ol > li.active
  expect(await page.$(`ol > li.active`)).toBeNull()

  // Get active card after
  await page.keyboard.press(`ArrowRight`)

  // Get slug of active site
  const slug = await page.$eval(`ol > li.active > a:has(> img)`, (card) =>
    card.getAttribute(`href`),
  )

  // Press enter and check that we're on the detail page
  await page.keyboard.press(`Enter`)
  await page.waitForURL(`/${slug}`, {
    waitUntil: `networkidle`,
  })
})

test(`detail page renders meta tags and an aligned definition list`, async ({ page }) => {
  await page.goto(`/svelte.dev`, { waitUntil: `networkidle` })

  await expect(page).toHaveTitle(`Svelte.dev | Awesome SvelteKit`)
  await expect(page.locator(`meta[name="description"]`)).toHaveAttribute(
    `content`,
    `Cybernetically enhanced web apps.`,
  )
  await expect(page.locator(`meta[property="og:title"]`)).toHaveAttribute(
    `content`,
    `Svelte.dev | Awesome SvelteKit`,
  )

  await expect(page.locator(`main dl > dt`)).toHaveText([
    `Stars`,
    `Contributors`,
    `Project started on`,
    `Tags`,
    `Uses`,
  ])

  // The tags row wraps at this width. Wrapped chips must stay inside the value
  // column instead of spilling back under the label.
  await page.setViewportSize({ width: 1000, height: 900 })
  const label_right = await page
    .locator(`main dl > dt`)
    .filter({ hasText: `Tags` })
    .evaluate((node) => node.getBoundingClientRect().right)
  const chips = await page
    .locator(`main dl > dd.chips`)
    .first()
    .locator(`span`)
    .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect()))

  expect(new Set(chips.map((chip) => Math.round(chip.top))).size).toBeGreaterThan(1)
  for (const chip of chips) expect(chip.left).toBeGreaterThan(label_right)

  // Sites without a repo drop to plain text without leaking an href onto spans
  await page.goto(`/markushatvan.com`, { waitUntil: `networkidle` })
  await expect(page.locator(`span[href]`)).toHaveCount(0)
  await expect(page.locator(`main dl > dt`)).toHaveText([
    `Creator`,
    `Project started on`,
    `Tags`,
    `Uses`,
  ])
})

test(`shows 404 page for invalid slugs`, async ({ page }) => {
  const response = await page.goto(`/not-a-real-site`, {
    waitUntil: `networkidle`,
  })

  expect(response?.status()).toBe(404)
  await expect(page.locator(`text=Page 'not-a-real-site' not found`)).toBeVisible()
})
