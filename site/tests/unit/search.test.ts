import sites from '../../../sites.yml'
import { expect, it } from 'vite-plus/test'
import type { Site } from '../../src/lib/index.ts'
import { search_matcher, search_text } from '../../src/lib/state.svelte.ts'

const matches = (query: string, candidates: Site[] = sites) =>
  candidates
    .filter((site) => search_matcher(query)(search_text(site)))
    .map(({ title }) => title)

it.each([
  [``, sites.map(({ title }) => title)],
  [`Cybernetically`, [`Svelte.dev`]], // only in its description
  [`tracker-free`, [`cobalt`]], // likewise, after a hyphen
  [`IMMICH`, [`Immich`]],
])(`search for %j`, (query, expected) => {
  expect(matches(query)).toEqual(expected)
})

it.each([`date`, `https`, `^`, `slug`])(`%j doesn't match every site`, (query) => {
  // raw JSON keys, the URL scheme and regex/diacritic-like chars aren't indexed
  expect(matches(query).length).toBeLessThan(sites.length / 2)
})

it(`folds case, accents and whitespace, keeps typed accents and field boundaries`, () => {
  const site = (title: string, extra: Partial<Site> = {}): Site => ({
    title,
    slug: title,
    url: `https://example.com`,
    tags: [`tag one`],
    uses: [`Tool`],
    date_created: `2024-01-01`,
    date_added: `2024-01-01`,
    ...extra,
  })
  const candidates = [
    site(`Zoltán  Café`),
    site(`Zoltan Cafe`, { description_text: `Q&A for devs` }),
  ]
  expect(matches(`zoltan cafe`, candidates)).toEqual([`Zoltán  Café`, `Zoltan Cafe`])
  expect(matches(`café`, candidates)).toEqual([`Zoltán  Café`])
  expect(matches(`q&a`, candidates)).toEqual([`Zoltan Cafe`])
  // the last tag and the first tool are separate fields, so their concatenation never matches
  expect(matches(`one tool`, candidates)).toEqual([])
})

it(`indexes decoded descriptions, never marked's entities`, () => {
  expect(sites.some((site) => /&(?:amp|lt|gt|quot|#39);/u.test(search_text(site)))).toBe(
    false,
  )
})
