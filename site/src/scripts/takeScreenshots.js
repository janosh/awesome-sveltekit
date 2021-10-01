/* eslint-disable no-console */
import fs from 'fs'

import puppeteer from 'puppeteer'
import yaml from 'js-yaml'

import { rootDir } from './index.js'

const sites = yaml.load(fs.readFileSync(`${rootDir}/sites.yml`))

const browser = await puppeteer.launch()
const page = await browser.newPage()

fs.mkdirSync(`static/screenshots`, { recursive: true })

const updateExisting = process.argv[2] === `update-existing`

if (updateExisting) console.log(`Updating all existing screenshots`)

let nChanged = 0

for (const [idx, site] of sites.entries()) {
  const id = site.title.toLowerCase().replaceAll(` `, `-`)

  const imgPath = `${rootDir}/site/static/screenshots/${id}.webp`

  if (!updateExisting && fs.existsSync(imgPath)) {
    continue
  }

  try {
    console.log(`${idx + 1}/${sites.length}: generating ${id}.webp`)

    await page.goto(site.url, { timeout: 10000, waitUntil: `networkidle0` })

    await page.screenshot({ path: imgPath })

    nChanged += 1
  } catch (error) {
    console.log(`${error} for URL ${site.url}, skipping...`)
  }
}

await browser.close()

console.log(`Finished generating ${nChanged} screenshots`)
