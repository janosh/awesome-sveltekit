// Derives the site list the app consumes from the hand-written sites.yml plus
// the fetched GitHub data in site-metadata.yml. Build-time only: importing
// marked here keeps it out of the client bundle.

import { load } from 'js-yaml'
import { marked } from 'marked'
import fs from 'node:fs'
import type { Site, SiteAuthor } from '../lib/index.ts'

// Keyed by slug. Everything here is fetched from GitHub, never hand-written.
export type SiteMetadata = Record<
  string,
  { repo_stars?: number; contributors?: SiteAuthor[] }
>

const title_to_slug = (title: string): string => title.toLowerCase().replaceAll(` `, `-`)

// Paths are relative to the site/ directory, which is the cwd for both the
// task CLI and the vite config.
const sites_path = `../sites.yml`
export const metadata_path = `src/site-metadata.yml`

// Missing metadata is fine (nothing fetched yet); a missing sites.yml is not.
export const load_metadata = (): SiteMetadata =>
  fs.existsSync(metadata_path)
    ? (load(fs.readFileSync(metadata_path, `utf8`)) as SiteMetadata)
    : {}

// YAML parsers disagree on unquoted dates: some yield a Date, some a string.
// Site declares these as strings, so pin them down to YYYY-MM-DD either way.
const to_date_string = (value: string | Date): string =>
  (value instanceof Date ? value.toISOString() : value).slice(0, 10)

export function enrich_sites(raw_sites: Site[], metadata: SiteMetadata): Site[] {
  const seen_slugs = new Set<string>()

  return raw_sites.map((site) => {
    const slug = title_to_slug(site.title)
    if (seen_slugs.has(slug)) throw new Error(`Duplicate slug '${slug}' in sites.yml`)
    seen_slugs.add(slug)

    const tags =
      site.repo && !site.tags.includes(`open source`)
        ? [...site.tags, `open source`].toSorted((tag_a, tag_b) =>
            tag_a.localeCompare(tag_b),
          )
        : site.tags

    // parseInline is idempotent, so re-rendering already-HTML descriptions is safe
    const description = site.description
      ? marked.parseInline(site.description, { async: false })
      : site.description

    return {
      ...site,
      ...metadata[slug],
      slug,
      tags,
      description,
      date_created: to_date_string(site.date_created),
      date_added: to_date_string(site.date_added),
    }
  })
}

export const load_sites = (): Site[] =>
  enrich_sites(load(fs.readFileSync(sites_path, `utf8`)) as Site[], load_metadata())
