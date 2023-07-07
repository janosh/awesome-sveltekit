/* eslint-disable no-console */
/* This file parses sites.yml, generates low+hi-res screenshots for each site,
saves them as WebP to site/static/screenshots/ and compresses them. */

import type { Site } from '$lib'
import fs from 'fs'
import yaml from 'js-yaml'
import { performance } from 'perf_hooks'
import puppeteer from 'puppeteer'
import sharp from 'sharp'
import type { Action } from '.'

export async function make_screenshots(options: { action?: Action } = {}) {
  const { action = `add-missing` } = options
  const start = performance.now()
  const screenshot_dir = `../site/static/screenshots`

  const sites = yaml
    .load(fs.readFileSync(`../site/src/sites.yml`))
    .sort((s1, s2) => s1.title.localeCompare(s2.title)) as Site[]

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
  }[action]
  console.log(msg)

  const [created, updated, skipped, existed] = [[], [], [], []]

  for (const [idx, site] of sites.entries()) {
    const { slug } = site

    const img_path = `${screenshot_dir}/${slug}.avif`
    const img_exists = fs.existsSync(img_path)

    if (action != `update-existing` && img_exists) {
      existed.push(site.slug)
      continue
    }

    console.log(`${idx + 1}/${sites.length}: ${slug}`)

    try {
      try {
        await page.goto(site.url, { timeout: 5000, waitUntil: `networkidle2` })
      } catch (error) {
        if (error instanceof puppeteer.TimeoutError) {
          // retry page.goto(), this time waiting only for 'load' event
          await page.goto(site.url, { timeout: 5000, waitUntil: `load` })
        } else {
          throw error // rethrow if not a TimeoutError
        }
      }
    } catch (error) {
      console.log(`skipping ${slug} due to ${error}`)
      skipped.push(site.slug)
    }

    await new Promise((r) => setTimeout(r, 2000)) // wait for sites with on-load animations to settle
    await page.setViewport({ width: 1200, height: 900 })
    const hires = await page.screenshot()
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 0.5 })
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
    console.log(
      `${this_file} took ${wall_time}s, created ${created.length} new, ${updated.length} updated, ${skipped.length} skipped, ${existed.length} already had screenshots\n`,
    )
  } else {
    console.log(`No changes from ${this_file} in ${wall_time}s\n`)
  }

  // delete screenshots of removed site
  const existing_slugs = sites.map((site) => site.slug)

  for (const file of fs.readdirSync(screenshot_dir)) {
    const slug = file.replace(`.small.avif`, ``).replace(`.avif`, ``)
    if (!existing_slugs.includes(slug)) {
      console.log(`deleting ${file}`)

      fs.unlinkSync(`${screenshot_dir}/${file}`)
    }
  }
}
