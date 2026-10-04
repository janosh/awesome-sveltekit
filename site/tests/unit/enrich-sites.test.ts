import sites from '../../../sites.yml'
import { expect, it } from 'vite-plus/test'
import type { Site } from '../../src/lib/index.ts'
import { enrich_sites, load_sites } from '../../src/tasks/enrich-sites.ts'

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
  [``, { description: `` }],
  [`**Useful** site`, { description: `<strong>Useful</strong> site` }],
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
