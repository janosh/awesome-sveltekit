import sites from '../../../sites.yml'
import tools from '../../../tools.yml'
import { expect, it } from 'vite-plus/test'
import type { Site } from '../../src/lib/index.ts'
import { enrich_sites, load_sites, repo_handle } from '../../src/tasks/enrich-sites.ts'

const raw_site: Site = {
  title: `Example Site`,
  url: `https://example.com`,
  repo: `https://github.com/sveltejs/kit`,
  tags: [`docs`],
  uses: [`SvelteKit`],
  date_created: `2021-10-19`,
  date_added: `2021-11-11`,
  slug: ``,
}

it(`matches CLI data and preserves string dates in the Vite import`, () => {
  expect(sites).toEqual(load_sites())
  expect(sites.length).toBeGreaterThan(0)
  for (const { date_created, date_added } of sites) {
    expect(date_created).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/u)
    expect(date_added).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/u)
  }
})

it.each([
  [undefined, {}],
  [``, { description: ``, description_text: `` }],
  [
    `**Useful** site`,
    { description: `<strong>Useful</strong> site`, description_text: `Useful site` },
  ],
] as const)(
  `enriches optional description %j without adding non-JSON values`,
  (description, expected_description) => {
    const enriched = enrich_sites([{ ...raw_site, description }], {
      'example-site': { repo_stars: 12 },
    })
    expect(enriched).toStrictEqual([
      {
        ...raw_site,
        slug: `example-site`,
        repo_stars: 12,
        tags: [`docs`, `open source`],
        ...expected_description,
      },
    ])
  },
)

it(`links every tool a site uses to an HTTPS page in tools.yml, with none unused`, () => {
  const used = new Set(
    sites.flatMap(({ uses }) => uses.map((tool) => tool.toLowerCase())),
  )
  for (const tool of used) expect(tools[tool], tool).toMatch(/^https:\/\//u)
  expect(Object.keys(tools).filter((tool) => !used.has(tool))).toEqual([])
})

it.each([
  [`https://github.com/sveltejs/kit`, `sveltejs/kit`],
  [`https://github.com/sveltejs/svelte.dev`, `sveltejs/svelte.dev`],
])(`parses GitHub repo URL %s to %s`, (repo, handle) => {
  expect(repo_handle(repo)).toBe(handle)
})

it.each([
  `https://github.com/sveltejs`,
  `https://github.com/sveltejs/kit/tree/main`,
  `https://github.com/sveltejs/kit?tab=readme`,
  `https://gist.github.com/owner/repo`,
  `https://notgithub.com/owner/repo`,
  `not a url`,
])(`rejects malformed repo URL %s, also when enriching sites.yml`, (repo) => {
  expect(() => repo_handle(repo)).toThrow(`bad GitHub repo URL '${repo}'`)
  expect(() => enrich_sites([{ ...raw_site, repo }], {})).toThrow(repo)
})

it(`decodes the entities marked escapes in the plain-text description`, () => {
  const description = `Sweet & *Vercel's* <3  \nnext<br>line`
  const [site] = enrich_sites([{ ...raw_site, description }], {})
  expect(site.description).toBe(`Sweet &amp; <em>Vercel&#39;s</em> &lt;3<br>next<br>line`)
  // line breaks become spaces instead of gluing words together
  expect(site.description_text).toBe(`Sweet & Vercel's <3 next line`)
})
