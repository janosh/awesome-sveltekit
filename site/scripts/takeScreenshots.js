/* eslint-disable no-console */
import fs from 'fs'
import yaml from 'js-yaml'
import { performance } from 'perf_hooks'
import puppeteer from 'puppeteer'
import { rootDir, titleToSlug } from './index.js'

const start = performance.now()

const sites = yaml.load(fs.readFileSync(`${rootDir}/sites.yml`))

const browser = await puppeteer.launch()
const page = await browser.newPage()

fs.mkdirSync(`${rootDir}/site/static/screenshots`, { recursive: true })

const updateExisting = process.argv[2] === `update-existing`

if (updateExisting) console.log(`Updating all existing screenshots`)

let [nNew, nUpdated] = [0, 0]

for (const [idx, site] of sites.entries()) {
  const slug = titleToSlug(site.title)

  const imgPath = `${rootDir}/site/static/screenshots/${slug}.webp`
  const imgExists = fs.existsSync(imgPath)

  if (!updateExisting && imgExists) {
    continue
  }

  console.log(`${idx + 1}/${sites.length}: generating ${slug}.webp`)

  try {
    await page.goto(site.url, { timeout: 5000, waitUntil: `networkidle2` })
  } catch (error) {
    await page.goto(site.url, { timeout: 5000, waitUntil: `load` })
  }

  await page.waitForTimeout(1000) // wait 1s for sites with landing animations to settle
  // e.g. https://mortimerbaltus.com, https://flayks.com
  await page.screenshot({ path: imgPath })

  if (imgExists) nUpdated += 1
  else nNew += 1
}

await browser.close()

const wallTime = ((performance.now() - start) / 1000).toFixed(2)

if (nNew > 0 || nUpdated > 0) {
  console.log(
    `takeScreenshots.js created ${nNew} new, updated ${nUpdated} in ${wallTime}s`
  )
}
