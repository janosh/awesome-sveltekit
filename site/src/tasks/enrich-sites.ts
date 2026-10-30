// Derives the site list the app consumes from the hand-written sites.yml plus
// the fetched GitHub data in site-metadata.yml. Build-time only: importing
// marked here keeps it out of the client bundle.

import { CORE_SCHEMA, load } from 'js-yaml'
import { marked } from 'marked'
import fs from 'node:fs'
import type { Site, SiteAuthor } from '../lib/index.ts'

// Keyed by slug. Everything here is fetched from GitHub, never hand-written.
export type SiteMetadata = Record<
  string,
  { repo_stars?: number; contributors?: SiteAuthor[] }
>

// marked's inline HTML as plain text: line breaks become spaces, other tags go, and
// the entities marked escapes are decoded
const entities: Record<string, string> = {
  '&amp;': `&`,
  '&lt;': `<`,
  '&gt;': `>`,
  '&quot;': `"`,
  '&#39;': `'`,
}
const html_to_text = (html: string) =>
  html
    .replaceAll(/<br\s*\/?>/gu, ` `)
    .replaceAll(/<[^>]+>/gu, ``)
    .replaceAll(/&(?:amp|lt|gt|quot|#39);/gu, (ent) => entities[ent])

const title_to_slug = (title: string): string => title.toLowerCase().replaceAll(` `, `-`)

// owner/name from a GitHub repo URL, e.g. https://github.com/sveltejs/kit -> sveltejs/kit
export function repo_handle(repo: string): string {
  const url = URL.parse(repo)
  const handle = url?.pathname.slice(1) ?? ``
  const valid = url?.hostname === `github.com` && !url.search && !url.hash
  if (!valid || !/^[\w.-]+\/[\w.-]+$/u.test(handle)) {
    throw new Error(`bad GitHub repo URL '${repo}'`)
  }
  return handle
}

// Paths are relative to the site/ directory, which is the cwd for both the
// task CLI and the vite config.
const sites_path = `../sites.yml`
export const metadata_path = `src/site-metadata.yml`

// Missing metadata is fine (nothing fetched yet); a missing sites.yml is not.
export const load_metadata = (): SiteMetadata =>
  fs.existsSync(metadata_path)
    ? (load(fs.readFileSync(metadata_path, `utf8`), {
        schema: CORE_SCHEMA,
      }) as SiteMetadata)
    : {}

function describe(markdown: string) {
  const html = marked.parseInline(markdown, { async: false })
  return { description: html, description_text: html_to_text(html) }
}

export function enrich_sites(raw_sites: Site[], metadata: SiteMetadata): Site[] {
  const seen_slugs = new Set<string>()

  return raw_sites.map(({ description, ...site }) => {
    const slug = title_to_slug(site.title)
    if (seen_slugs.has(slug)) throw new Error(`Duplicate slug '${slug}' in sites.yml`)
    seen_slugs.add(slug)
    if (site.repo) repo_handle(site.repo) // fail the build on a malformed repo URL

    const tags =
      site.repo && !site.tags.includes(`open source`)
        ? [...site.tags, `open source`].toSorted((tag_a, tag_b) =>
            tag_a.localeCompare(tag_b),
          )
        : site.tags

    return {
      ...site,
      ...metadata[slug],
      slug,
      tags,
      ...(description === undefined ? {} : describe(description)),
    }
  })
}

export const load_sites = (): Site[] =>
  enrich_sites(
    load(fs.readFileSync(sites_path, `utf8`), { schema: CORE_SCHEMA }) as Site[],
    load_metadata(),
  )
