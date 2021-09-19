/* eslint-disable no-console */
import fs from 'fs'

import puppeteer from 'puppeteer'
import yaml from 'js-yaml'

const sites = yaml.load(fs.readFileSync(`sites.yml`))

const browser = await puppeteer.launch()
const page = await browser.newPage()

fs.mkdirSync(`static/screenshots`, { recursive: true })

const updateExisting = process.argv[2] === `update-existing`

if (updateExisting) console.log(`Updating all existing screenshots`)

let nChanged = 0

for (const [idx, site] of sites.entries()) {
  const id = site.title.toLowerCase().replaceAll(` `, `-`)

  if (!updateExisting && fs.existsSync(`static/screenshots/${id}.png`)) continue

  console.log(`${idx + 1}/${sites.length}: generating ${id}.png`)

  await page.goto(site.url)

  await page.screenshot({ path: `static/screenshots/${id}.png` })

  nChanged += 1
}

await browser.close()

console.log(`Finished generating ${nChanged} screenshots`)
