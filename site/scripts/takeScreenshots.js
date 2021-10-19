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

let [nNew, nUpdated] = [0, 0]

console.time(`Finished taking screenshots`)

for (const [idx, site] of sites.entries()) {
  const id = site.title.toLowerCase().replaceAll(` `, `-`)

  const imgPath = `${rootDir}/site/static/screenshots/${id}.webp`
  const imgExists = fs.existsSync(imgPath)

  if (!updateExisting && imgExists) {
    continue
  }

  console.log(`${idx + 1}/${sites.length}: generating ${id}.webp`)

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

console.timeEnd(`Finished taking screenshots`)
console.log(`  - ${nNew} new, ${nUpdated} updated`)
