// This file parses sites.yml, fetches GH metadata like contributors and stars
// for each site, then writes just that fetched data to site/src/site-metadata.yml
// keyed by slug. The site list itself lives only in sites.yml.

import type { Site } from '../lib/index.ts'
import { dump } from 'js-yaml'
import fs from 'node:fs'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import type { Contributor } from 'svelte-widgets'
import type { Action } from './'
import { load_metadata, load_sites, metadata_path } from './enrich-sites.ts'
import type { SiteMetadata } from './enrich-sites.ts'

// GitHub /contributors + /users payloads; widgets Contributor is the shared core
type GhContributor = Contributor & {
  url: string
  type: `User` | `Bot`
  contributions: number
}
type GitHubUser = GhContributor & {
  name: string | null
  location: string | null
  company: string | null
  blog: string | null
  twitter_username: string | null
}

function https_url(url: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith(`http`)) return url.replace(`http://`, `https://`)
  return `https://${url}`
}

const has_text = (value: string | undefined): value is string =>
  value !== undefined && value !== ``

// recursively sort object keys so the dumped YAML is stable (js-yaml 5 deprecated sortKeys)
const sort_keys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sort_keys)
  if (typeof value !== `object` || value === null) return value
  const entries = Object.entries(value).toSorted(([key_a], [key_b]) =>
    key_a < key_b ? -1 : 1,
  )
  return Object.fromEntries(entries.map(([key, val]) => [key, sort_keys(val)]))
}

export async function fetch_github_metadata(
  options: { action?: Action } = {},
): Promise<void> {
  const { action = `add-missing` } = options

  // load_sites assigns the slugs and rejects duplicates
  const sites = load_sites()
  // Retained so a run without a full refetch keeps previously fetched data
  const metadata: SiteMetadata = load_metadata()

  const this_file = import.meta.url.split(`/`).pop()

  console.warn(`Running ${this_file}...`)

  const start = performance.now()

  const old_slugs = new Set(Object.keys(metadata))

  const skipped_sites: string[] = []
  const updated_sites: string[] = []

  const github_token = process.env.GH_TOKEN
  if (!has_text(github_token)) {
    throw new Error(`GH_TOKEN environment variable is not set.`)
  }

  const headers = {
    authorization: `token ${github_token}`,
  }

  async function fetch_check<T>(url: string): Promise<T> {
    const response = await fetch(url, { headers })
    const body = (await response.json()) as T & { message?: unknown }
    if (typeof body.message === `string`) throw new Error(body.message)
    return body
  }

  async function fetch_site_metadata(site: Site): Promise<boolean> {
    const { repo: repo_url, slug } = site
    if (!has_text(repo_url) || (old_slugs.has(slug) && action !== `update-existing`)) {
      return false
    }

    // Also skip site if repo key cannot be parsed into a user login and a repo name
    const [, repo_handle] = repo_url.split(`github.com/`)
    if (repo_handle?.split(`/`).length !== 2) {
      console.error(`bad repo handle ${repo_handle}`)
      return false
    }

    const entry = metadata[slug] ?? {}

    // Fetch stars
    try {
      const url = `https://api.github.com/repos/${repo_handle}`
      const repo = await fetch_check<{ stargazers_count: number }>(url)
      entry.repo_stars = repo.stargazers_count
    } catch (error) {
      console.error(`Error fetching stars for ${site.title}:`, error)
    }

    // Fetch most active contributors
    const raw_contributors = await fetch_check<GhContributor[]>(
      `https://api.github.com/repos/${repo_handle}/contributors`,
    )
    const contributors = raw_contributors
      .filter((person) => person.contributions > 10 && person.type === `User`)
      .toSorted((person_a, person_b) => person_b.contributions - person_a.contributions)
      .slice(0, 5)

    const full_contributors = await Promise.all(
      contributors.map((person) => fetch_check<GitHubUser>(person.url)),
    )

    entry.contributors = full_contributors.map(
      ({ name, location, company, ...contributor }) => ({
        avatar: contributor.avatar_url,
        company: company ?? undefined,
        github: contributor.login,
        location: location ?? undefined,
        name: name ?? contributor.login,
        twitter: contributor.twitter_username ?? undefined,
        url: https_url(contributor.blog ?? ``),
      }),
    )

    metadata[slug] = entry
    return true
  }

  // Only refetch when a site was added to sites.yml, unless action forces it
  for (const site of sites) {
    const updated = await fetch_site_metadata(site)
    if (updated) updated_sites.push(site.slug)
    else skipped_sites.push(site.slug)
  }

  // Keep only sites still listed in sites.yml
  const pruned: SiteMetadata = {}
  for (const { slug } of sites) {
    if (metadata[slug]) pruned[slug] = metadata[slug]
  }

  const wall_time = ((performance.now() - start) / 1000).toFixed(2)

  const comment = `# auto-generated by ${this_file}, do not edit\n\n`
  fs.writeFileSync(metadata_path, comment + dump(sort_keys(pruned)))

  console.warn(
    `${this_file} took ${wall_time}s, updated ${updated_sites.length}, ` +
      `skipped ${skipped_sites.length}\n`,
  )
}

if (import.meta.main) {
  await fetch_github_metadata()
}
