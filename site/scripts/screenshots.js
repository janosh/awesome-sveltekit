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
const outDir = `${root_dir}/site/static/screenshots`

const sites = yaml.load(fs.readFileSync(`${root_dir}/sites.yml`))

const browser = await puppeteer.launch()
const page = await browser.newPage()

fs.mkdirSync(outDir, { recursive: true })

const updateExisting = process.argv[2] === `update-existing`

if (updateExisting) console.log(`Updating all existing screenshots`)

const [created, updated, skipped, existed] = [[], [], [], []]

for (const [idx, site] of sites.entries()) {
  site.slug = title_to_slug(site.title)
  const { slug } = site

  const imgPath = `${outDir}/${slug}.webp`
  const imgExists = fs.existsSync(imgPath)

  if (!updateExisting && imgExists) {
    existed.push(site.slug)
    continue
  }

  console.log(`${idx + 1}/${sites.length}: ${slug}`)

  try {
    try {
      await page.goto(site.url, { timeout: 5000, waitUntil: `networkidle2` })
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
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
  await page.screenshot({ path: imgPath })
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 0.5 })
  await page.screenshot({ path: `${outDir}/${slug}.small.webp` })

  if (imgExists) updated.push(site.slug)
  else created.push(site.slug)
}

await browser.close()

const wall_time = ((performance.now() - start) / 1000).toFixed(2)

const this_file = basename(process.argv[1])

if (created.length > 0 || updated.length > 0) {
  console.log(
    `${this_file} took ${wall_time}s, created ${created.length} new, ${updated.length} updated, ${skipped.length} skipped, ${existed.length} already had screenshots\n`
  )

  const toCompress = [...created, ...updated].flatMap((slug) => [
    `${outDir}/${slug}.webp`,
    `${outDir}/${slug}.small.webp`,
  ])

  const compressedFiles = await imagemin(toCompress, {
    destination: outDir,
    plugins: [imageminWebp({ quality: 50 })],
  })

  console.log(`compressed ${compressedFiles.length} files`)
} else {
  console.log(`No changes from ${this_file} in ${wall_time}s\n`)
}
