import { expect, test } from '@playwright/test'

test.describe.configure({ mode: `parallel` })

test(`filters and sorts the site list, mirroring state in URL params`, async ({
  page,
}) => {
  await page.goto(`/`, { waitUntil: `networkidle` })

  const cards = page.locator(`ol > li > div.flex + p.tags`)
  const match_count = page.locator(`main > p`)
  const search = page.getByPlaceholder(`Search...`)
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
  await search.fill(`THIS_SHOULD_NOT_MATCH_ANY_SITES`)
  await expect(match_count).toHaveText(`0 matches (try different filters)`)
  await expect(cards).toHaveCount(0)
  // Clearing brings every site back — the count only hides at the full total
  await search.fill(``)
  await expect(match_count).toHaveCount(0)

  await search.fill(`svelte`)
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

  await page.getByRole(`radio`, { name: `Date Created` }).click()
  await page.getByRole(`button`, { name: /Sorted descending/ }).click()
  await expect(page).toHaveURL(/&sort=date&order=asc$/)

  // Defaults are omitted so shared links stay short
  await search.fill(``)
  await tag_input.press(`Backspace`)
  await tag_input.press(`Backspace`)
  await tag_input.press(`Escape`)
  // Dropping below two tags unmounts the all/any toggle, shifting the sort
  // buttons ~120px. Wait for the URL (written in an effect, so after the DOM
  // update) before clicking them, or the clicks land on stale coordinates.
  await expect(page).toHaveURL(/\?sort=date&order=asc$/)
  await page.getByRole(`radio`, { name: `GitHub Stars` }).click()
  await page.getByRole(`button`, { name: /Sorted ascending/ }).click()
  await expect(page).toHaveURL(/\/$/)

  // Sorting reorders the list itself, not just the URL
  const desc_stars = await star_counts()
  expect(desc_stars.length).toBeGreaterThan(1)
  expect(desc_stars).toEqual(desc_stars.toSorted((star_a, star_b) => star_b - star_a))
  await page.getByRole(`button`, { name: /Sorted descending/ }).click()
  await expect.poll(star_counts).toEqual(desc_stars.toReversed())
})

test(`restores filter and sort state from URL params`, async ({ page }) => {
  const url = `/?q=blog&tags=blog,docs&sort=date&order=asc`
  await page.goto(url, { waitUntil: `networkidle` })

  const search = page.getByPlaceholder(`Search...`)
  await expect(search).toHaveValue(`blog`)
  const selected_tags = page.locator(`ul.selected`).first().locator(`li`)
  await expect(selected_tags).toHaveCount(2)
  await expect(selected_tags.first()).toContainText(`blog`)
  await expect(selected_tags.last()).toContainText(`docs`)
  await expect(page.getByRole(`radio`, { name: `Date Created` })).toBeChecked()
  await expect(page.getByRole(`button`, { name: /Sorted ascending/ })).toBeVisible()
  // The URL-sync effect must not wipe the params it just restored from
  await expect(page).toHaveURL(url)

  // State survives a round trip to a detail page and back (remount re-reads URL)
  await page.locator(`ol > li a:has(> img)`).first().click()
  await page.waitForURL((detail_url) => !detail_url.search)
  await page.goBack()
  await expect(page).toHaveURL(url)
  await expect(search).toHaveValue(`blog`)

  // Unknown values fall back to defaults instead of erroring
  await page.goto(`/?q=blog&tags=not-a-real-tag&utm_source=test&sort=bogus`, {
    waitUntil: `networkidle`,
  })
  // MultiSelect only renders its placeholder while nothing is selected
  await expect(page.getByPlaceholder(`Filter by tag...`)).toBeVisible()
  await expect(page.getByRole(`radio`, { name: `GitHub Stars` })).toBeChecked()
  await expect(page.getByRole(`button`, { name: /Sorted descending/ })).toBeVisible()
  // Unmanaged params survive, unknown managed ones are dropped, and managed
  // params keep their position instead of being shuffled to the end
  await search.fill(`docs`)
  await expect(page).toHaveURL(`/?q=docs&utm_source=test`)
})

test(`command menu ranks recently visited sites first`, async ({ page }) => {
  await page.goto(`/`, { waitUntil: `networkidle` })
  await page.evaluate(() => localStorage.removeItem(`awesome-sveltekit-cmd`))

  await page.keyboard.press(`ControlOrMeta+KeyK`)
  const menu_input = page.getByPlaceholder(`Go to...`)
  await expect(menu_input).toBeFocused()
  await menu_input.fill(`MatterViz`)
  await page.keyboard.press(`Enter`)
  await page.waitForURL(`/matterviz`)

  await page.goto(`/`, { waitUntil: `networkidle` })
  await page.keyboard.press(`ControlOrMeta+KeyK`)
  await expect(menu_input).toBeFocused()
  await expect(page.locator(`dialog ul.options li`).first()).toContainText(`MatterViz`)
})

test(`can navigate between detail pages with arrow keys`, async ({ page }) => {
  await page.goto(`/svelte.dev`, { waitUntil: `networkidle` })

  const next_href = await page.getByRole(`link`, { name: /Next/ }).getAttribute(`href`)
  expect(next_href).toBeTruthy()

  await page.keyboard.press(`ArrowRight`)
  await page.waitForURL(`/${next_href}`)
})

test(`can navigate landing page with arrow keys`, async ({ page }) => {
  await page.goto(`/`, { waitUntil: `networkidle` })

  await expect(page.locator(`ol > li.active`)).toHaveCount(0)
  await page.keyboard.press(`ArrowRight`)

  const active_link = page.locator(`ol > li.active > a:has(> img)`)
  const slug = await active_link.getAttribute(`href`)
  expect(slug).toBeTruthy()
  // screenshot paths derive from the same slug as the detail page route
  await expect(active_link.locator(`img`)).toHaveAttribute(
    `src`,
    `/screenshots/${slug}.small.avif`,
  )

  await page.keyboard.press(`Enter`)
  await page.waitForURL(`/${slug}`, { waitUntil: `networkidle` })
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

  await page.evaluate(() => {
    navigator.clipboard.writeText = (text) => {
      document.documentElement.dataset.copied = text
      return Promise.resolve()
    }
  })
  for (const [name, href] of [
    [`Copy repo URL`, `https://github.com/sveltejs/svelte.dev`],
    [`Copy npm URL`, `https://npmjs.com/package/svelte`],
  ] as const) {
    const copy_btn = page.getByRole(`button`, { name })
    await expect(copy_btn).toBeVisible()
    await copy_btn.click()
    expect(await page.locator(`html`).getAttribute(`data-copied`)).toBe(href)
  }

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
  await expect(page.getByRole(`button`, { name: /Copy (?:repo|npm) URL/ })).toHaveCount(0)
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
  await expect(page.getByText(`Page 'not-a-real-site' not found`)).toBeVisible()
})
