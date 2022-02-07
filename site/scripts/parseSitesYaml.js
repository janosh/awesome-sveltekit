/* eslint-disable no-console */
import 'dotenv/config'
import fs from 'fs'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import { performance } from 'perf_hooks'
import { rootDir, titleToSlug } from './index.js'

const inPath = `${rootDir}/sites.yml`
const outPath = `${rootDir}/site/src/sites.js`

const sites = yaml.load(fs.readFileSync(inPath))

const start = performance.now()

const prevOut = fs.existsSync(outPath) ? await import(outPath) : { default: [] }
const { default: oldSites, lastParsed } = prevOut

const daysSinceLastParse = Math.round(
  (new Date() - new Date(lastParsed)) / (1000 * 60 * 60 * 24)
)

const prevIds = oldSites.map((site) => site.id)

let [seenSlugs, skippedSites] = [new Set(), {}]

const authHeader = {
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
}

// Only update site/src/sites.js if a new site was added to sites.yml
// or repo star counts were last fetched more than a month ago.
for (const site of sites) {
  const slug = titleToSlug(site.title)

  if (seenSlugs.has(slug)) throw new Error(`Duplicate slug ${slug}`)
  else seenSlugs.add(slug)

  site.slug = slug

  if (!site.repo || daysSinceLastParse >= 30 || prevIds.includes(site.id)) {
    skippedSites[site.id] = slug
    continue
  }

  const repoHandle = site.repo.split(`github.com/`)[1]
  if (repoHandle.split(`/`).length !== 2) {
    console.error(`bad repo handle ${repoHandle}`)
    skippedSites[site.id] = slug
    continue
  }
  let response = await fetch(
    `https://api.github.com/repos/${repoHandle}`,
    authHeader
  )
  let json = await response.json()
  site.repoStars = json.stargazers_count

  let contributors = await fetch(
    `https://api.github.com/repos/${repoHandle}/contributors`,
    authHeader
  ).then((res) => res.json())

  contributors = contributors.filter((c) => c.contributions > 10).slice(0, 5)

  contributors = await Promise.all(
    contributors.map(({ url }) => fetch(url, authHeader).then((r) => r.json()))
  )

  site.contributors = contributors.map(({ name, location, company, ...c }) => ({
    github: c.login,
    twitter: c.twitter_username,
    url: c.blog,
    avatar: c.avatar_url,
    name,
    location,
    company,
  }))
}

const newSites = sites.map((site, idx) => ({
  ...(oldSites[idx] ?? {}),
  ...site,
}))

fs.writeFileSync(
  outPath,
  `// this file was generated by site/scripts/parseSitesYaml.js\n
export const lastParsed = "${new Date().toLocaleDateString(`eu`)}"\n
export default ${JSON.stringify(newSites, null, 2)}`
)

const wallTime = ((performance.now() - start) / 1000).toFixed(2)
console.log(
  `${sites.length} sites parsed in ${wallTime}s, skipped ${
    Object.keys(skippedSites).length
  } sites`
)
