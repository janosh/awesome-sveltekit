/* eslint-disable no-console */
import fs from 'fs'

import puppeteer from 'puppeteer'
import yaml from 'js-yaml'

const sites = yaml.load(fs.readFileSync(`sites.yml`))

const browser = await puppeteer.launch()
const page = await browser.newPage()

fs.mkdirSync(`static/screenshots`, { recursive: true })

for (const site of sites) {
  const id = site.title.toLowerCase().replaceAll(` `, `-`)

  if (fs.existsSync(`static/screenshots/${id}.png`)) continue

  await page.goto(site.url)

  await page.screenshot({ path: `static/screenshots/${id}.png` })
}

await browser.close()

console.log(`Finished taking site screenshots`)
