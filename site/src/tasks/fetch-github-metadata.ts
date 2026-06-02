/* This file parses sites.yml, fetches GH metadata like contributors
and stars for each site, then writes the results to site/src/sites.yml. */

import type { RepoContributor, Site } from '$lib'
import { dump, load } from 'js-yaml'
import { marked } from 'marked'
import fs from 'node:fs'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import type { Action } from './'

type GitHubUser = RepoContributor & {
  name: string | null
  location: string | null
  company: string | null
  blog: string | null
  twitter_username: string | null
}

export const title_to_slug = (title: string): string =>
  title.toLowerCase().replaceAll(` `, `-`)

function https_url(url: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith(`http`)) return url.replace(`http://`, `https://`)
  return `https://${url}`
}

const has_text = (value: string | undefined): value is string =>
  value !== undefined && value !== ``

export async function fetch_github_metadata(
  options: { action?: Action } = {},
): Promise<void> {
  const { action = `add-missing` } = options
  const in_path = `../sites.yml`
  const out_path = `../site/src/sites.yml`

  const sites = load(fs.readFileSync(in_path, `utf8`)) as Site[]

  let old_sites: Site[] = []
  if (fs.existsSync(out_path)) {
    old_sites = load(fs.readFileSync(out_path, `utf8`)) as Site[]
  }

  const this_file = import.meta.url.split(`/`).pop()

  console.warn(`Running ${this_file}...`)

  const start = performance.now()

  const old_slugs = new Set(old_sites.map((site) => site.slug))

  const seen_sites = new Set<string>()
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
    return body as T
  }

  async function update_site_from_github(site: Site, slug: string): Promise<boolean> {
    const repo_url = site.repo
    if (!has_text(repo_url) || (old_slugs.has(slug) && action !== `update-existing`)) {
      return false
    }

    // Also skip site if repo key cannot be parsed into a user login and a repo name
    const [, repo_handle] = repo_url.split(`github.com/`)
    if (repo_handle?.split(`/`).length !== 2) {
      console.error(`bad repo handle ${repo_handle}`)
      return false
    }

    // Fetch stars
    try {
      const url = `https://api.github.com/repos/${repo_handle}`
      const repo = await fetch_check<{ stargazers_count: number }>(url)
      site.repo_stars = repo.stargazers_count
    } catch (error) {
      console.error(`Error fetching stars for ${site.title}:`, error)
    }

    // Fetch most active contributors
    const raw_contributors = await fetch_check<RepoContributor[]>(
      `https://api.github.com/repos/${repo_handle}/contributors`,
    )
    const contributors = raw_contributors
      .filter((itm) => itm.contributions > 10 && itm.type === `User`)
      .toSorted((c1, c2) => c2.contributions - c1.contributions)
      .slice(0, 5)

    const full_contributors = await Promise.all(
      contributors.map(async (person) => {
        const contributor = await fetch_check<GitHubUser>(person.url)
        return contributor
      }),
    )

    site.contributors = full_contributors.map(
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

    return true
  }

  // Only update site/src/sites.js if a new site was added to sites.yml
  // Or repo stars were last fetched more than a month ago.
  for (const site of sites) {
    const slug = title_to_slug(site.title)

    if (seen_sites.has(slug)) throw new Error(`Duplicate slug ${slug}`)
    seen_sites.add(slug)

    site.slug = slug

    // Add open-source tag for all sites with repo key
    if (has_text(site.repo) && !site.tags.includes(`open source`)) {
      site.tags.push(`open source`)
      site.tags.sort((a, b) => a.localeCompare(b)) // Sort tags alphabetically in place
    }

    const updated = await update_site_from_github(site, slug)
    if (updated) updated_sites.push(slug)
    else skipped_sites.push(slug)
  }

  const new_sites = sites.map((site) => {
    const old_site = old_sites.find((old: Site) => old.slug === site.slug)
    // Retain fetched GitHub data from old_sites in case we didn't refetch
    if (site.repo_stars === undefined && old_site?.repo_stars !== undefined) {
      site.repo_stars = old_site.repo_stars
    }
    if (site.contributors === undefined && old_site?.contributors !== undefined) {
      site.contributors = old_site.contributors
    }
    if (has_text(site.description)) {
      site.description = marked.parseInline(site.description) as string
    }

    return site
  })

  const wall_time = ((performance.now() - start) / 1000).toFixed(2)

  const comment = `# auto-generated by ${this_file}\n\n`
  fs.writeFileSync(out_path, comment + dump(new_sites))

  console.warn(
    `${this_file} took ${wall_time}s, updated ${updated_sites.length}, ` +
      `skipped ${skipped_sites.length}\n`,
  )
}

if (import.meta.main) {
  await fetch_github_metadata()
}
