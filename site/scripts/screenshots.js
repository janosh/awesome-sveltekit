/* eslint-disable no-console */
/* This file parses sites.yml, generates low+hi-res screenshots for each site,
saves them as WebP to site/static/screenshots/ and compresses them. */

import fs from 'fs'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import yaml from 'js-yaml'
import { basename } from 'path'
import { performance } from 'perf_hooks'
import puppeteer from 'puppeteer'
import { root_dir, title_to_slug } from './index.js'

const start = performance.now()
const screenshot_dir = `${root_dir}/site/static/screenshots`

const sites = yaml.load(fs.readFileSync(`${root_dir}/sites.yml`))

const browser = await puppeteer.launch()
const page = await browser.newPage()

fs.mkdirSync(screenshot_dir, { recursive: true })

const update_existing = process.argv[2] === `update-existing`

if (update_existing) console.log(`Updating all existing screenshots`)

const [created, updated, skipped, existed] = [[], [], [], []]

for (const [idx, site] of sites.entries()) {
  site.slug = title_to_slug(site.title)
  const { slug } = site

  const img_path = `${screenshot_dir}/${slug}.webp`
  const img_exists = fs.existsSync(img_path)

  if (!update_existing && img_exists) {
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
  // e.g. https://flayks.com
  await page.setViewport({ width: 1200, height: 900 })
  await page.screenshot({ path: img_path })
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 0.5 })
  await page.screenshot({ path: `${screenshot_dir}/${slug}.small.webp` })

  if (img_exists) updated.push(site.slug)
  else created.push(site.slug)
}

await browser.close()

const wall_time = ((performance.now() - start) / 1000).toFixed(2)

const this_file = basename(process.argv[1])

if (created.length > 0 || updated.length > 0) {
  console.log(
    `${this_file} took ${wall_time}s, created ${created.length} new, ${updated.length} updated, ${skipped.length} skipped, ${existed.length} already had screenshots\n`
  )

  const to_compress = [...created, ...updated].flatMap((slug) => [
    `${screenshot_dir}/${slug}.webp`,
    `${screenshot_dir}/${slug}.small.webp`,
  ])

  const compressed_files = await imagemin(to_compress, {
    destination: screenshot_dir,
    plugins: [imageminWebp({ quality: 50 })],
  })

  console.log(`compressed ${compressed_files.length} files`)
} else {
  console.log(`No changes from ${this_file} in ${wall_time}s\n`)
}

// delete screenshots of removed site
const existing_slugs = sites.map((site) => site.slug)

for (const file of fs.readdirSync(screenshot_dir)) {
  const slug = file.replace(`.small.webp`, ``).replace(`.webp`, ``)
  if (!existing_slugs.includes(slug)) {
    console.log(`deleting ${file}`)

    fs.unlinkSync(`${screenshot_dir}/${file}`)
  }
}
