/* This file parses sites.yml, generates low+hi-res screenshots for each site and
saves them as AVIF to site/static/screenshots. */

import type { Site } from '$lib'
import yaml from 'js-yaml'
import fs from 'node:fs'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import puppeteer from 'puppeteer'
import sharp from 'sharp'
import type { Action } from './'

export async function make_screenshots(options: { action?: Action } = {}) {
  const { action = `add-missing` } = options
  const start = performance.now()
  const screenshot_dir = `../site/static/screenshots`

  const sites = (
    yaml.load(fs.readFileSync(`../site/src/sites.yml`, `utf8`)) as Site[]
  ).toSorted((s1, s2) => s1.title.localeCompare(s2.title))

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  fs.mkdirSync(screenshot_dir, { recursive: true })

  const arg = process.argv.find((arg) => arg.startsWith(`screenshots:`))
  if (action && ![`add-missing`, `update-existing`].includes(action)) {
    throw new Error(
      `Correct usage: vite [dev] screenshots:[report|download|re-download], got ${arg}\n`,
    )
  }

  const msg = {
    'add-missing': `Adding screenshots for sites without them`,
    'update-existing': `Updating all existing screenshots`,
  }[action as string]
  console.warn(msg)

  const created: string[] = []
  const updated: string[] = []
  const skipped: string[] = []
  const existed: string[] = []

  for (const [idx, site] of sites.entries()) {
    const { slug } = site

    const img_path = `${screenshot_dir}/${slug}.avif`
    const img_exists = fs.existsSync(img_path)

    if (action !== `update-existing` && img_exists) {
      existed.push(site.slug)
      continue
    }

    console.warn(`${idx + 1}/${sites.length}: ${slug}`)

    try {
      try {
        await page.goto(site.url, { timeout: 5000, waitUntil: `networkidle2` })
      } catch (error) {
        if (error instanceof Error && error.name === `TimeoutError`) {
          // Retry page.goto(), this time waiting only for 'load' event
          await page.goto(site.url, { timeout: 5000, waitUntil: `load` })
        } else {
          throw error // Rethrow if not a TimeoutError
        }
      }
    } catch (error) {
      console.warn(`skipping ${slug} due to ${String(error)}`)
      skipped.push(site.slug)
      continue
    }

    await new Promise((r) => setTimeout(r, 2000)) // Wait for sites with on-load animations to settle
    await page.setViewport({ height: 900, width: 1200 })
    const hires = await page.screenshot()
    await page.setViewport({ deviceScaleFactor: 0.5, height: 900, width: 1200 })
    const lores = await page.screenshot()
    await sharp(hires).toFile(img_path)
    await sharp(lores).toFile(`${screenshot_dir}/${slug}.small.avif`)

    if (img_exists) updated.push(site.slug)
    else created.push(site.slug)
  }

  await browser.close()

  const wall_time = ((performance.now() - start) / 1000).toFixed(2)

  const this_file = import.meta.url.split(`/`).pop()

  if (created.length > 0 || updated.length > 0) {
    console.warn(
      `${this_file} took ${wall_time}s, created ${created.length} new, ${updated.length} updated, ${skipped.length} skipped, ${existed.length} already had screenshots\n`,
    )
  } else {
    console.warn(`No changes from ${this_file} in ${wall_time}s\n`)
  }

  // Delete screenshots of removed site
  const existing_slugs = new Set(sites.map((site) => site.slug))

  for (const file of fs.readdirSync(screenshot_dir)) {
    const slug = file.replace(`.small.avif`, ``).replace(`.avif`, ``)
    if (!existing_slugs.has(slug)) {
      console.warn(`deleting ${file}`)

      fs.unlinkSync(`${screenshot_dir}/${file}`)
    }
  }
}

if (import.meta.main) {
  await make_screenshots()
}
