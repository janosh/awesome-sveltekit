import sites from '../../../sites.yml'
import { expect, it } from 'vite-plus/test'
import { fold, search_text } from '../../src/lib/state.svelte.ts'

const matches = (query: string) =>
  sites
    .filter((site) => search_text(site).includes(fold(query)))
    .map(({ title }) => title)

it(`folds case, accents and whitespace like highlight_matches`, () => {
  expect(fold(`Zoltán  Félix\tSVELTEKIT`)).toBe(`zoltan felix sveltekit`)
})

it.each([
  [`date`, (titles: string[]) => titles.length < sites.length], // not a JSON key match
  // the URL scheme isn't indexed, only links shown in description text
  [`https`, (titles: string[]) => titles.length < 5],
  [`sveltekit`, (titles: string[]) => titles.includes(`Official SvelteKit docs`)],
  [`IMMICH`, (titles: string[]) => titles.includes(`Immich`)],
])(`search for %j`, (query, check) => {
  expect(check(matches(query))).toBe(true)
})

it(`matches tools, tags, contributor names and decoded descriptions, not across fields`, () => {
  const site = sites.find(({ contributors, uses }) => contributors?.length && uses.length)
  if (!site) throw new Error(`no site with contributors and tools`)
  const text = search_text(site)
  for (const word of [site.uses[0], site.tags[0], site.contributors?.[0]?.name ?? ``]) {
    expect(text).toContain(fold(word))
  }
  expect(sites.some((other) => /&(?:amp|#39);/u.test(search_text(other)))).toBe(false)
  // the last tag and first tool are separate fields, so their concatenation never matches
  expect(text).not.toContain(fold(`${site.tags.at(-1)} ${site.uses[0]}`))
})
